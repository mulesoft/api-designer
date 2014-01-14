'use strict';

/**
 * Flex layout splitter
 */
angular.module('splitter', []).directive('ngSplitter', ['$window', 'config',
  function($window, config) {
    var collapsedSize = 20;

    /**
     * @param element
     * @returns {Object} The element that is in the DOM before the passed-in element
     */
    function getPrevious(element) {
      element[0].getPreviousMarker = true;
      var siblings = Array.prototype.slice.call(element.parent().children(), 0);
      var idx = 0;
      //Loop through the parent until we find ourselves and return the previous element
      try {
        while(idx < siblings.length) {
          var nextDOMElement = siblings[idx];
          if (nextDOMElement.getPreviousMarker) {
            return idx > 0 ? angular.element(siblings[idx - 1]) : null;
          }
          idx++;
        }
      } finally {
        delete element.getPreviousMarker;
      }
      return null;
    }

    /**
     * @param splitter Splitter that was moved
     * @param sizeAttr 'width' or 'height'
     * @param delta Pixels to resize by
     */
    function resizeNextBy(splitter, sizeAttr, delta) {
      var next = splitter.next();
      if (canResizeNextBy(splitter, sizeAttr, delta)) {
        var targetSize = getOffsetSize(next, sizeAttr) + delta;
        resizeNextTo(splitter, targetSize);
      }
    }

    /**
     * @param splitter Splitter that was moved
     * @param sizeAttr 'width' or 'height'
     * @param delta Pixels we intend to resize the next element by
     * @returns {boolean} That the splitter's previous element would
     * remain larger than 2 x splitter width/height, which is its
     * minimum size
     */
    function canResizeNextBy(splitter, sizeAttr, delta) {
      var prev = getPrevious(splitter);
      //Get the original offsetWidth or offsetHeight:
      var prevElementOffsetSize = getOffsetSize(prev, sizeAttr);
      //Policy: Previous element cannot shrink to less than 2 x splitter width/height
      return prevElementOffsetSize - delta >= getOffsetSize(splitter, sizeAttr) * 2;
    }

    /**
     * Toggles the chevron display
     * @param splitter The splitter that owns the chevron
     * @param collapsed False means expand chevron shown, true
     * means collapse chevron is shown
     */
    function setChevronState(splitter, collapsed) {
      splitter.children().toggleClass('icon-chevron-sign-left', collapsed);
      splitter.children().toggleClass('icon-chevron-sign-right', !collapsed);
      saveIsCollapsed(splitter, collapsed);
    }

    /**
     * @param splitter The splitter that owns the chevron
     * @returns {boolean} Whether the chevron is visible
     */
    function getChevronIsExpander(splitter) {
      return splitter.children().hasClass('icon-chevron-sign-left');
    }

    /**
     * Scales the splitter to the requested size, clipping the size based on
     * our constraints and toggling the resize chevron if the size of the
     * next element goes to the minimum value.
     *
     * @param splitter Splitter that was moved
     * @param size Pixels to resize to
     */
    function resizeNextTo(splitter, size) {
      var next = splitter.next();
      //Clip the size to a minimum of minSize pixels wide/high
      size = Math.max(size, collapsedSize);
      //Show/hide the chevron:
      setChevronState(splitter, size === collapsedSize);
      next.css('flex', '0 0 ' + size + 'px');
    }

    /**
     * @param element Element whose offset size we want
     * @param sizeAttr 'width' or 'height'
     * @returns {Number} offset size
     */
    function getOffsetSize(element, sizeAttr) {
      var offsetSizeProperty = 'offset' + sizeAttr[0].toUpperCase() + sizeAttr.slice(1);
      return element[0][offsetSizeProperty];
    }

    //region Splitter config

    /**
     * Saves the splitter size
     * @param splitter The splitter element. Should have a unique id.
     * @param sizeAttr 'width' or 'height'
     * @returns {Number} The size of the splitter
     */
    function saveSize(splitter, sizeAttr) {
      var size = getOffsetSize(splitter.next(), sizeAttr);
      config.set('splitterSize_' + splitter.attr('id'), size);
      return size;
    }

    /**
     * Loads the splitter size and optionally applies it to the next element
     * after the splitter
     * @param splitter The splitter element. Should have a unique id.
     * @param sizeAttr 'width' or 'height'
     * @param applySize Whether the splitter should have the loaded size applied
     * @returns {Number} The splitter size
     */
    function loadSize(splitter, sizeAttr, applySize) {
      //If no size was saved, use the current size;
      var size = config.get('splitterSize_' + splitter.attr('id'))
                  || saveSize(splitter, sizeAttr);
      if (applySize) {
        resizeNextTo(splitter, size);
        //In case window is too small for requested splitter size, we resize
        //the splitter:
        ensureSplitterFitsInWindow(splitter, sizeAttr, size);
      }
      return size;
    }

    /**
     * Saves whether the splitter is collapsed
     * @param splitter The splitter element. Should have a unique id.
     * @param collapsed Whether the splitter is collapsed
     */
    function saveIsCollapsed(splitter, collapsed) {
      config.set('splitterCollapsed_' + splitter.attr('id'), collapsed);
    }

    /**
     * Loads whether the splitter was collapsed by the user
     * @param splitter The splitter element. Should have a unique id.
     * @returns {boolean} Whether the splitter was collapsed by the user
     */
    function loadIsCollapsed(splitter) {
      return config.get('splitterCollapsed_' + splitter.attr('id')) === 'true';
    }

    //endregion

    /**
     * When window is moved we need to scale the splitter up/down
     * based on the size of the window and the splitter's preferred
     * size.
     * @param splitter The splitter
     * @param sizeAttr 'width' or 'height'
     * @param preferredSize Splitter's preferred size
     */
    function ensureSplitterFitsInWindow(splitter, sizeAttr, preferredSize) {
      var prevElementOffsetSize = getOffsetSize(getPrevious(splitter), sizeAttr);
      //Window shrinks: Ensure that the previous element does not disappear by
      //shrinking the element after the splitter:
      var minSize = Math.max(getOffsetSize(splitter, sizeAttr) * 2, 8);
      while(prevElementOffsetSize < minSize) {
        resizeNextBy(splitter, sizeAttr, -(minSize - prevElementOffsetSize));
        prevElementOffsetSize = getOffsetSize(getPrevious(splitter), sizeAttr);
      }

      //Grow the splitter if it is smaller than its preferred size and is not collapsed
      if (preferredSize && !loadIsCollapsed(splitter)) {
        if (getOffsetSize(splitter.next(), sizeAttr) < preferredSize) {
          resizeNextBy(splitter, sizeAttr, prevElementOffsetSize - minSize);
        }
      }
    }

    return {
      restrict: 'A',
      /**
       * @param scope Angular scope object
       * @param splitter jqLite-wrapped element this this directive matches
       * @param attrs Normalized attribute names/values for the element
       */
      link: function(scope, splitter, attrs) {
        var isActive  = false;
        var vertical  = attrs.ngSplitter === 'vertical';
        var sizeAttr  = vertical ? 'width' : 'height';
        var mousePos  = vertical ? 'clientX' : 'clientY';
        var lastPos;
        //Check the saved splitter state and collapse or resize it
        var collapsed = loadIsCollapsed(splitter);
        if (collapsed) {
          resizeNextTo(splitter, collapsedSize);
        }
        //Load the last non-collapsed size the splitter had, and
        //if the splitter is not collapsed, apply it.
        var preferredSize = loadSize(splitter, sizeAttr, !collapsed);

        //Configure UI events
        splitter.on('mousedown', function() {
          //Only respond to left mouse button:
          isActive = true;
          splitter.parent().addClass('noselect');
        }).parent().on('mousemove', function(evt) {
            if (isActive) {
              var chevronWasExpander = getChevronIsExpander(splitter);
              var delta = evt[mousePos] - lastPos;
              //Scale the elements:
              resizeNextBy(splitter, sizeAttr, -delta);
              lastPos = evt[mousePos];

              //If the chevron was not shown and now is visible
              //then we deactivate the drag
              if (getChevronIsExpander(splitter) && !chevronWasExpander) {
                isActive = false;
              }
            }
          }).on('mousedown', function(evt) {
            lastPos = evt[mousePos];
          }).on('mouseup', function() {
            if (isActive && !loadIsCollapsed(splitter)) {
              preferredSize = saveSize(splitter, sizeAttr);
            }
            isActive = false;
            splitter.parent().removeClass('noselect');
          });
        //Wire up the chevron:
        splitter.children().on('mouseup', function() {
          var isCollapsed = loadIsCollapsed(splitter);
          var targetSize = isCollapsed ? preferredSize : 20;
          resizeNextTo(splitter, targetSize);
          ensureSplitterFitsInWindow(splitter, sizeAttr, preferredSize);
          return false;
        });

        //Window resizing is treated a bit like a splitter move:
        angular.element($window).on('resize', function() { ensureSplitterFitsInWindow(splitter, sizeAttr, preferredSize); });
      }
    };
  }
]);

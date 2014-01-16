'use strict';

/**
 * Flex layout splitter
 */
angular.module('splitter', []).directive('ngSplitter', ['$window', 'config',
  function($window, config) {
    var collapsedSize = 20;

    // Extend angular jqlite with .prev as an opposite to .next
    if (!angular.element.prototype.prev) {
      /**
       * Get the immediately preceding sibling of each element in the set of matched elements.
       */
      angular.element.prototype.prev = function prev() {
        var value;

        if (this.length) {
          value = this[0].previousSibling;
          while (value !== null && value.nodeType !== 1) {
            value = value.previousSibling;
          }
        }

        return angular.isDefined(value) ? angular.element(value) : this;
      };
    }

    /**
     * Scales the splitter to the requested size, clipping the size based on
     * our constraints and toggling the resize chevron if the size of the
     * next element goes to the minimum value.
     *
     * @param splitter Splitter that was moved
     * @param size Pixels to resize to
     */
    function resizeNextTo(splitter, preferredSize) {
      var next      = splitter.next();
      var size      = Math.max(preferredSize, collapsedSize);
      var collapsed = size === collapsedSize;

      setChevronState(splitter, collapsed);

      next
        .css('flex', '0 0 ' + size + 'px')
        //Hide the scrollbar on collapse
        .css('overflow', collapsed ? 'hidden' : 'auto')
      ;
    }

    /**
     * @param splitter Splitter that was moved
     * @param sizeAttr 'width' or 'height'
     * @param delta Pixels to resize by
     */
    function resizeNextBy(splitter, sizeAttr, delta) {
      var prev     = splitter.prev();
      var prevSize = getOffsetSize(prev, sizeAttr);
      var next     = splitter.next();
      var nextSize = getOffsetSize(next, sizeAttr);

      // Force delta to be as small as possible to make
      // sure next container doesn't over grow if there is
      // no space before it
      if ((prevSize + (-delta)) < 0) {
        delta = prevSize;
      }

      if (delta) {
        resizeNextTo(splitter, nextSize + delta);
      }
    }

    /**
     * Toggles the chevron display
     * @param splitter The splitter that owns the chevron
     * @param collapsed False means expand chevron shown, true
     * means collapse chevron is shown
     */
    function setChevronState(splitter, collapsed) {
      splitter.children()
        .toggleClass('icon-chevron-sign-left',   collapsed)
        .toggleClass('icon-chevron-sign-right', !collapsed)
      ;

      saveIsCollapsed(splitter, collapsed);
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
     * @returns {Number} The splitter size
     */
    function loadSize(splitter, sizeAttr) {
      //If no size was saved, use the current size;
      return config.get('splitterSize_' + splitter.attr('id')) || saveSize(splitter, sizeAttr);
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

    return {
      restrict: 'A',
      /**
       * @param scope Angular scope object
       * @param splitter jqLite-wrapped element this this directive matches
       * @param attrs Normalized attribute names/values for the element
       */
      link: function(scope, splitter, attrs) {
        var isActive      = false;
        var vertical      = attrs.ngSplitter === 'vertical';
        var sizeAttr      = vertical ? 'width' : 'height';
        var mousePos      = vertical ? 'clientX' : 'clientY';
        var lastPos;
        var collapsed     = loadIsCollapsed(splitter);
        var preferredSize = loadSize(splitter, sizeAttr);
        var parent        = splitter.parent();

        resizeNextTo(splitter, collapsed ? collapsedSize : preferredSize);

        // Configure UI events
        splitter
          .on('mousedown', function onMouseDown(e) {
            // Only respond to left mouse button:
            if (e.button !== 0) {
              return;
            }

            isActive = true;
            lastPos  = e[mousePos];

            parent.addClass('noselect');
          })
        ;

        angular.element($window)
          .on('mousemove', function onMouseMove(e) {
            if (isActive) {
              var delta = e[mousePos] - lastPos;
              // Scale the elements
              resizeNextBy(splitter, sizeAttr, -delta);
              lastPos = e[mousePos];
            }
          })
          .on('mouseup', function onMouseUp(e) {
            if (isActive && !loadIsCollapsed(splitter)) {
              preferredSize = saveSize(splitter, sizeAttr);
            }

            isActive = false;
            lastPos  = e[mousePos];

            parent.removeClass('noselect');
          })
        ;

        // Wire up the chevron
        splitter.children().on('click', function onClick() {
          var isCollapsed = loadIsCollapsed(splitter);
          var targetSize  = isCollapsed ? preferredSize : collapsedSize;

          resizeNextTo(splitter, targetSize);

          return false;
        });
      }
    };
  }
]);

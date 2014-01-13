'use strict';

/**
 * Flex layout splitter
 */
angular.module('splitter', []).directive('ngSplitter', ['$window',
  function($window) {
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
    }

    /**
     * @param splitter Splitter that was moved
     * @param sizeAttr 'width' or 'height'
     * @param delta Pixels to resize by
     */
    function resizeNextBy(splitter, sizeAttr, delta) {
      var next = splitter.next();
      if (canResizeNextBy(splitter, sizeAttr, delta)) {
        var originalOffsetSize = getOffsetSize(next, sizeAttr);
        next.css('flex', '0 0 ' + (originalOffsetSize + delta) + 'px');
      }
    }

    /**
     * @param splitter Splitter that was moved
     * @param sizeAttr 'width' or 'height'
     * @param delta Pixels to resize by
     */
    function resizeNextTo(splitter, size) {
      var next = splitter.next();
      next.css('flex', '0 0 ' + size + 'px');
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
      return prevElementOffsetSize - delta > getOffsetSize(splitter, sizeAttr) * 2;
    }

    /**
     * @param element Element to resize
     * @param sizeAttr 'width' or 'height'
     * @param delta Pixels to size the element to
     */
    //function resizeFlexTo(element, size) {
      //Get the original offsetWidth or offsetHeight:
    //  element.css('flex', '0 0 ' + size + 'px');
    //}

    /**
     * @param element Element whose offset size we want
     * @param sizeAttr 'width' or 'height'
     * @returns {Number} offset size
     */
    function getOffsetSize(element, sizeAttr) {
      var offsetSizeProperty = 'offset' + sizeAttr[0].toUpperCase() + sizeAttr.slice(1);
      return element[0][offsetSizeProperty];
    }

//    function saveSize(element, sizeAttr) {
      //var size = getOffsetSize(element, sizeAttr);
  //  }

//    function loadSize(element) {
//    }

    return {
      restrict: 'A',
      /**
       * @param scope Angular scope object
       * @param splitter jqLite-wrapped element this this directive matches
       * @param attrs Normalized attribute names/values for the element
       */
      link: function(scope, splitter, attrs) {
        if (attrs.fixed === 'fixed') {
          return;
        }
        //Create 'static' members
        var isActive  = false;
        var vertical  = attrs.ngSplitter === 'vertical';
        var sizeAttr  = vertical ? 'width' : 'height';
        var mousePos  = vertical ? 'clientX' : 'clientY';
        var lastPos;
        //Used when window is resized to scale the 'next' element
        var splitterSize = getOffsetSize(splitter, sizeAttr);
        var preferredSize = getOffsetSize(splitter.next(), sizeAttr);

        //If a size was saved, restore it:
        //var originalSize = loadSize(splitter.next());
        //if (originalSize) {
        //  resizeFlexTo(splitter.next(), originalSize);
        //}

        //Configure UI events
        splitter.on('mousedown', function() {
          //Only respond to left mouse button:
          isActive = true;
          splitter.parent().addClass('noselect');
        }).parent().on('mousemove', function(evt) {
            if (isActive) {
              var delta = evt[mousePos] - lastPos;
              //Scale the elements:
              resizeNextBy(splitter, sizeAttr, -delta);
              lastPos = evt[mousePos];
            }
          }).on('mousedown', function(evt) {
            lastPos = evt[mousePos];
          }).on('mouseup', function() {
            if (isActive) {
              preferredSize = getOffsetSize(splitter.next(), sizeAttr);
            }
            isActive = false;
            splitter.parent().removeClass('noselect');
            //saveSize(splitter.next(), sizeAttr);
          });

        //Window resizing is treated a bit like a splitter move:
        angular.element($window).on('resize', function() {
          var prevElementOffsetSize = getOffsetSize(getPrevious(splitter), sizeAttr);
          //Window shrinks: Ensure that the previous element does not disappear by
          //shrinking the element after the splitter:
          var minSize = splitterSize * 2;
          if (prevElementOffsetSize < minSize) {
            resizeNextBy(splitter, sizeAttr, -(minSize - prevElementOffsetSize));
          } else {
            //Grow the splitter if it is smaller than its preferred size
            if (getOffsetSize(splitter.next(), sizeAttr) < preferredSize) {
              resizeNextBy(splitter, sizeAttr, prevElementOffsetSize - minSize);
            }
          }
        });
      }
    };
  }
]);

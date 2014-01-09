'use strict';

/**
 * Calculating splitter
 */
angular.module('splitter', []).directive('ngSplitter', ['$window',
  function($window) {

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
     *
     * @param element Element to resize
     * @param sizeAttr 'width' or 'height'
     * @param delta Pixels to resize by
     * @returns {boolean} Whether the resize succeeded
     */
    function resize(element, sizeAttr, delta) {
      //Get the original offsetWidth or offsetHeight:
      var offsetSizeProperty = 'offset' + sizeAttr[0].toUpperCase() + sizeAttr.slice(1);
      var originalOffsetSize = element[0][offsetSizeProperty];

      //Get the original width/height css property value
      var originalValue = element.css(sizeAttr);
      //Do we have a calc expression?
      var matches = /^calc\(\d+%\s*(\+|-)\s*(\d*)px\s*\)/.exec(originalValue); //E.g. "calc(20% + 55px), we want the "55"
      if (matches) {
        var offset = parseInt(matches[1] + matches[2], 10);
        offset += delta;
        offset = offset < 0 ? '- ' + (-offset) : '+ ' + offset;
        var newValue = originalValue.replace(/(\+|-)\s*(\d*)px/, offset + 'px');
        element.css(sizeAttr, newValue);
        //There are several failure cases:
        // 1. The element could have been collapse down to a width of 0
        // 2. The element could have a min-width or height
        var failed = element[0][offsetSizeProperty] !== originalOffsetSize + delta;
        if (failed) {
          //roll back:
          element.css(sizeAttr, originalValue);
          return false;
        }
      }
      return true;
    }

    /**
     * Resizes previousElement by delta and next element by -delta. If either
     * resize fails, will roll back the resize on both.
     *
     * @param previousElement Element before the splitter
     * @param nextElement Element after the splitter
     * @param sizeAttr 'width' or 'height'
     * @param delta Pixels to resize the elements by
     */
    function symmetricResize(previousElement, nextElement, sizeAttr, delta, ignoreFail)
    {
      var success = resize(previousElement, sizeAttr, delta);
      if (success || ignoreFail) {
        success = resize(nextElement, sizeAttr, -delta);
        if (!success && !ignoreFail) {
          //Roll back the first scale if the second failed:
          resize(previousElement, sizeAttr, -delta);
        }
      }
    }

    function getDistanceToNext(element) {
      var elementLeft = element[0].offsetLeft;
      var nextLeft = element.next()[0].offsetLeft;
      return elementLeft - nextLeft;
    }

/*
    TOMORROW:
      1. FIX THE PROBLEM WHERE the splitter overlaps the console
      2. Use cookie to make splitter position persistent and reset after page is pageLoaded
      3. Splitter should only active with left mouse button, not right
      4. Splitter 2x click should revert the splitter to its last position, like git checkout -
      5. Reenable the styles that prevent text from getting selected. (the "active" stuff in splitter.less)
      6. Need a nicer/more distinctive splitter background color.
*/
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
        var isActive  = false;
        var vertical  = attrs.ngSplitter === 'vertical';
        var sizeAttr  = vertical ? 'width' : 'height';
        var mousePos  = vertical ? 'clientX' : 'clientY';
        var originalDelta = getDistanceToNext(splitter);
        var lastPos;
        var container = splitter.parent();
        splitter.on('mousedown', function() {
          isActive = true;
          container.addClass('noselect');
        }).parent().on('mousemove', function(evt) {
            if (isActive) {
              var previousElement = getPrevious(splitter);
              var delta = evt[mousePos] - lastPos;
              //Scale the two elements:
              symmetricResize(previousElement, splitter.next(), sizeAttr, delta, false);
              lastPos = evt[mousePos];
            }
          }).on('mousedown', function(evt) {
            lastPos = evt[mousePos];
          }).on('mouseup', function() {
            isActive = false;
            container.removeClass('noselect');
          });

        //If the window is resized, we need to ensure that the splitter remains
        //in the correct location. We do this very carefully by comparing where
        //the splitter should be wrt to its next sibling and where it now is:
        angular.element($window).on('resize', function() {
          var delta = getDistanceToNext(splitter);
          if (delta !== originalDelta) {
            symmetricResize(getPrevious(splitter), splitter.next(), sizeAttr, originalDelta - delta, true);
          }
        });
      }
    };
  }]
);
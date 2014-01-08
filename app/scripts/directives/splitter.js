'use strict';

/**
 * Calculating splitter
 */
angular.module('splitter', []).directive('ngSplitter',
  function() {

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
     * @param property 'width' or 'height'
     * @param delta Pixels to resize by
     * @returns {boolean} Whether the resize succeeded
     */
    function resize(element, property, delta) {
      //Get the original offsetWidth or offsetHeight:
      var offsetSizeProperty = 'offset' + property[0].toUpperCase() + property.slice(1);
      var originalOffsetSize = element[0][offsetSizeProperty];

      //Get the original width/height css property value
      var originalValue = element.css(property);
      //Do we have a calc expression?
      var matches = /^calc\(\d+%\s*(\+|-)\s*(\d*)px\s*\)/.exec(originalValue); //E.g. "calc(20% + 55px), we want the "55"
      if (matches) {
        var offset = parseInt(matches[1] + matches[2], 10);
        offset += delta;
        offset = offset < 0 ? '- ' + (-offset) : '+ ' + offset;
        var newValue = originalValue.replace(/(\+|-)\s*(\d*)px/, offset + 'px');
        element.css(property, newValue);
        //There are several failure cases:
        // 1. The element could have been collapse down to a width of 0
        // 2. The element could have a min-width or height
        var failed = element[0][offsetSizeProperty] !== originalOffsetSize + delta;
        if (failed) {
          //roll back:
          element.css(property, originalValue);
          return false;
        }
      }
      return true;
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
       * @param element jqLite-wrapped element this this directive matches
       * @param attrs Normalized attribute names/values for the element
       */
      link: function(scope, element, attrs) {
        if (attrs.fixed === 'fixed') {
          return;
        }
        var isActive  = false;
        var vertical  = attrs.ngSplitter === 'vertical';
        var sizeAttr  = vertical ? 'width' : 'height';
        var mousePos  = vertical ? 'clientX' : 'clientY';
        var lastPos;
        var container = element.parent();
        element.on('mousedown', function() {
          isActive = true;
          container.addClass('noselect');
        }).parent().on('mousemove', function(evt) {
            if (isActive) {
              var previousElement = getPrevious(element);
              var delta = evt[mousePos] - lastPos;
              //Scale the two elements:
              var success = resize(previousElement, sizeAttr, delta);
              if (success) {
                success = resize(element.next(), sizeAttr, -delta);
                if (!success) {
                  //Roll back the first scale if the second failed:
                  resize(previousElement, sizeAttr, -delta);
                }
              }
              lastPos = evt[mousePos];
            }
          }).on('mousedown', function(evt) {
            lastPos = evt[mousePos];
          }).on('mouseup', function() {
            isActive = false;
            container.removeClass('noselect');
          });
      }
    };
  }
);
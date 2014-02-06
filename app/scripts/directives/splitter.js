'use strict';

/**
 * Flex layout splitter
 */
angular.module('splitter', []).directive('ngSplitter', ['$window', 'config',
  function($window, config) {
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

    function getCollapseTarget(splitter) {
      return splitter.attr('ng-splitter-collapse-target');
    }

    function getCollapseTargetEl(splitter) {
      return splitter[getCollapseTarget(splitter)]();
    }

    function getNonCollapseTargetEl(splitter) {
      return splitter[{next: 'prev', prev: 'next'}[getCollapseTarget(splitter)]]();
    }

    /**
     * Scales the splitter to the requested size, clipping the size based on
     * our constraints and toggling the resize chevron if the size of the
     * next element goes to the minimum value.
     *
     * @param splitter Splitter that was moved
     * @param size Pixels to resize to
     */
    function resizeCollapseTarget(splitter, size) {
      getCollapseTargetEl(splitter).css('min-width', Math.max(0, size) + 'px');
      return Math.max(0, size);
    }

    /**
     * @param splitter Splitter that was moved
     * @param sizeAttr 'width' or 'height'
     * @param delta Pixels to resize by
     * @returns New collapse target size after it has been resized
     */
    function performResizeCollapseTarget(splitter, sizeAttr, delta) {
      var collapseTargetEl        = getCollapseTargetEl(splitter);
      var collapseTargetElSize    = getOffsetSize(collapseTargetEl, sizeAttr);
      var nonCollapseTargetEl     = getNonCollapseTargetEl(splitter);
      var nonCollapseTargetElSize = getOffsetSize(nonCollapseTargetEl, sizeAttr);
      var sign                    = {next: 1, prev: -1}[getCollapseTarget(splitter)];

      // Force delta to be as small as possible to make
      // sure collapse target doesn't over grow if there is
      // no space left
      if ((nonCollapseTargetElSize + (delta * sign)) < 0) {
        delta = nonCollapseTargetElSize * sign * -1;
      }

      if (delta) {
        collapseTargetElSize = resizeCollapseTarget(splitter, collapseTargetElSize - (delta * sign));
      }

      return collapseTargetElSize;
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
     * Saves the splitter size
     * @param splitter The splitter element. Should have a unique id.
     * @param sizeAttr 'width' or 'height'
     * @returns {Number} The size of the splitter
     */
    function saveSize(splitter, sizeAttr) {
      var size = getOffsetSize(getCollapseTargetEl(splitter), sizeAttr);
      config.set('splitterSize_' + splitter.attr('id'), size);
      return size;
    }

    /**
     * Loads whether the splitter was collapsed by the user
     * @param splitter The splitter element. Should have a unique id.
     * @returns {boolean} Whether the splitter was collapsed by the user
     */
    function loadIsCollapsed(splitter) {
      return config.get('splitterCollapsed_' + splitter.attr('id')) === 'true';
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
     * Toggles the collapse target visibility
     * @param splitter The splitter that owns the chevron
     * @param collapse False means expand collapse target, true
     * means collapse target is shown
     */
    function toggleCollapseTarget(splitter, collapse) {
      collapse = arguments.length > 1 ? collapse : !loadIsCollapsed(splitter);

      splitter.toggleClass('collapsed', collapse);
      getCollapseTargetEl(splitter).toggleClass('hide-display', collapse);

      saveIsCollapsed(splitter, collapse);
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
        var userIsDragging = true;
        var vertical      = attrs.ngSplitter === 'vertical';
        var sizeAttr      = vertical ? 'width' : 'height';
        var posAttr       = vertical ? 'clientX' : 'clientY';
        var lastPos;
        var lastSize      = loadSize(splitter, sizeAttr);
        var lastCollapsed = loadIsCollapsed(splitter);
        var parent        = splitter.parent();

        // Restore collapse target state (size and collapsed)
        // from last session
        resizeCollapseTarget(splitter, lastSize);
        toggleCollapseTarget(splitter, lastCollapsed);

        // Configure UI events
        splitter
          .on('mousedown', function onMouseDown(event) {
            // Only respond to left mouse button
            if (event.button !== 0) {
              return;
            }

            lastPos       = event[posAttr];
            lastSize      = loadSize(splitter, sizeAttr);
            lastCollapsed = loadIsCollapsed(splitter);

            isActive  = true;
            parent.addClass('noselect');
          })
        ;

        angular.element($window)
          .on('mousemove', function onMouseMove(event) {
            if (isActive) {
              userIsDragging = true;
              // Scale the collapse target
              var collapsed = performResizeCollapseTarget(splitter, sizeAttr, event[posAttr] - lastPos) === 0;

              // Collapse the target if its size has reached zero
              //
              // We don't want to toggle the state every 1px and for
              // that reason we compare current state with last one
              if (collapsed !== lastCollapsed) {
                toggleCollapseTarget(splitter, collapsed);
              }

              lastPos       = event[posAttr];
              lastCollapsed = collapsed;
            }
          })
          .on('mouseup', function onMouseUp() {
            if (isActive) {
              if (lastCollapsed) {
                // Preserve collapse target's size if it
                // has reached collapsed state during drag & drop operation
                //
                // We do it to make sure collapsed target expands to proper size
                // when users try to expand it in current or next session
                toggleCollapseTarget(splitter, true);
                resizeCollapseTarget(splitter, lastSize);
              } else {
                saveSize(splitter, sizeAttr);
              }

              isActive = false;
              parent.removeClass('noselect');
            }
          })
        ;

        // Wire up the tiny button that handles collapse and expand operations
        splitter.children('.split').on('mousedown', function onClick() {
          userIsDragging = false;
        });
        splitter.children('.split').on('mouseup', function onClick() {
          //Need to make sure that the user is clicking, not dragging:
          if (!userIsDragging) {
            toggleCollapseTarget(splitter);
            userIsDragging = true;
            isActive = false;
          }
        });
      }
    };
  }
]);

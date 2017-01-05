/**
 * This file overwrites the ui-tree-node directive from the angular-ui-tree
 * module to modify the behaviour of tree drag-and-drop to better suit the use case
 * of file trees
 */
(function () {
  'use strict';

  angular.module('ui.tree')
    .directive('uiTreeNode', ['treeConfig', '$uiTreeHelper', '$window', '$document','$timeout', 'ramlRepository', 'config',
      function (treeConfig, $uiTreeHelper, $window, $document, $timeout, ramlRepository, config) {
        return {
          require: ['^uiTreeNodes', '^uiTree', '?uiTreeNode'],
          link: function(scope, element, attrs, controllersArr) {
            var currentConfig = {};
            angular.extend(currentConfig, treeConfig);
            if (currentConfig.nodeClass) {
              element.addClass(currentConfig.nodeClass);
            }
            scope.init(controllersArr);

            scope.collapsed = !!$uiTreeHelper.getNodeAttribute(scope, 'collapsed');

            scope.$watch(attrs.collapsed, function(val) {
              if((typeof val) === 'boolean') {
                scope.collapsed = val;
              }
            });

            scope.$watch('collapsed', function(val) {
              $uiTreeHelper.setNodeAttribute(scope, 'collapsed', val);
              attrs.$set('collapsed', val);
            });

            var elements;  // As a parameter for callbacks
            var firstMoving, dragInfo, pos, dropAccpeted;
            var dragElm, hiddenPlaceElm;
            var hasTouch     = 'ontouchstart' in window;
            var dragDelaying = true;
            var dragStarted  = false;
            var dragTimer    = null;
            var dragCanceled = false;
            var expandTimer  = null;
            var expandDelay  = 1000;  // ms
            var body         = document.body,
                html         = document.documentElement,
                documentHeight,
                documentWidth;

            var dragStart = function(e) {
              if (!hasTouch && (e.button === 2 || e.which === 3)) {
                // disable right click
                return;
              }
              if (e.uiTreeDragging || (e.originalEvent && e.originalEvent.uiTreeDragging)) { // event has already fired in other scope.
                return;
              }

              // the element which is clicked
              var eventElm   = angular.element(e.target);
              var eventScope = eventElm.scope();
              if (!eventScope || !eventScope.$type) {
                return;
              }
              if (eventScope.$type !== 'uiTreeNode' &&
                eventScope.$type !== 'uiTreeHandle') { // Check if it is a node or a handle
                return;
              }
              if (eventScope.$type === 'uiTreeNode' &&
                eventScope.$handleScope) { // If the node has a handle, then it should be clicked by the handle
                return;
              }

              var eventElmTagName = eventElm.prop('tagName').toLowerCase();
              if (eventElmTagName === 'input' ||
                eventElmTagName === 'textarea' ||
                eventElmTagName === 'button' ||
                eventElmTagName === 'select') { // if it's a input or button, ignore it
                return;
              }

              // check if it or it's parents has a 'data-nodrag' attribute
              while (eventElm && eventElm[0] && eventElm[0] !== element) {
                if ($uiTreeHelper.nodrag(eventElm)) { // if the node mark as `nodrag`, DONOT drag it.
                  return;
                }
                eventElm = eventElm.parent();
              }

              if (!scope.beforeDrag(scope)){
                return;
              }

              e.uiTreeDragging = true; // stop event bubbling
              if (e.originalEvent) {
                e.originalEvent.uiTreeDragging = true;
              }
              e.preventDefault();
              var eventObj = $uiTreeHelper.eventObj(e);

              firstMoving = true;
              dragInfo    = $uiTreeHelper.dragInfo(scope);

              var tagName = scope.$element.prop('tagName');

              hiddenPlaceElm = angular.element($window.document.createElement(tagName));
              if (currentConfig.hiddenClass) {
                hiddenPlaceElm.addClass(currentConfig.hiddenClass);
              }
              pos = $uiTreeHelper.positionStarted(eventObj, scope.$element);
              dragElm = angular.element($window.document.createElement(scope.$parentNodesScope.$element.prop('tagName')))
                        .addClass(scope.$parentNodesScope.$element.attr('class'))
                        .addClass(currentConfig.dragClass)
                        .addClass(config.get('theme') === 'light' ? 'drag-light' : '');
              dragElm.css('z-index', 9999);

              scope.$element.after(hiddenPlaceElm);
              dragElm.append(scope.$element.clone().html(scope.$element.children()[0].innerHTML));
              var fileBrowserElement = $document.find('raml-editor-file-browser');
              fileBrowserElement.append(dragElm);
              var left = eventObj.pageX - pos.offsetX - fileBrowserElement.offset().left;
              var top = eventObj.pageY - pos.offsetY - fileBrowserElement.offset().top;
              dragElm.css({
                'left' : left + 'px',
                'top'  : top + 'px'
              });
              elements = {
                dragging: dragElm
              };

              scope.$element.addClass('drag-elm');

              // get the node that is being dragged collasp it
              var dragNode = angular.element(dragElm[0].lastChild).scope();
              dragNode.collapsed = true;

              angular.element($document).bind('touchend', dragEndEvent);
              angular.element($document).bind('touchcancel', dragEndEvent);
              angular.element($document).bind('touchmove', dragMoveEvent);
              angular.element($document).bind('mouseup', dragEndEvent);
              angular.element($document).bind('mousemove', dragMoveEvent);
              angular.element($document).bind('mouseleave', dragCancelEvent);

              documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
              documentWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);

              scope.$treeScope.isDragging = true;
            };

            var dragMove = function(e) {
              if (!dragStarted) {
                if (!dragDelaying) {
                  dragStarted = true;
                  scope.$apply(function() {
                    scope.$callbacks.dragStart(dragInfo.eventArgs(elements, pos));
                  });
                }
                return;
              }

              var eventObj = $uiTreeHelper.eventObj(e);
              var leftElmPos, topElmPos, boundingRect;

              if (dragElm) {
                e.preventDefault();

                if ($window.getSelection) {
                  $window.getSelection().removeAllRanges();
                } else if ($window.document.selection) {
                  $window.document.selection.empty();
                }

                var fileBrowserElement = $document.find('raml-editor-file-browser');
                leftElmPos = eventObj.pageX - pos.offsetX - fileBrowserElement.offset().left;
                topElmPos  = eventObj.pageY - pos.offsetY - fileBrowserElement.offset().top;

                boundingRect = {
                  left:   leftElmPos,
                  right:  leftElmPos + dragElm[0].scrollWidth + 5,  // extra 5px padding
                  top:    topElmPos,
                  bottom: topElmPos + dragElm[0].scrollHeight
                };

                // check horizontal boundaries
                if(boundingRect.left < 0){
                  leftElmPos = 0;
                } else if(boundingRect.right > documentWidth) {
                  leftElmPos = documentWidth - dragElm[0].scrollWidth - 5;
                }

                // check vertical boundaries
                if(boundingRect.top < 0){
                  topElmPos = 0;
                } else if (boundingRect.bottom > documentHeight){
                  topElmPos = documentHeight - dragElm[0].scrollHeight;
                }

                dragElm.css({
                  'left': leftElmPos + 'px',
                  'top': topElmPos + 'px'
                });

                var topScroll = window.pageYOffset || $window.document.documentElement.scrollTop;
                var bottomScroll = topScroll + (window.innerHeight || $window.document.clientHeight || $window.document.clientHeight);

                // to scroll down if cursor y-position is greater than the bottom position the vertical scroll
                if (bottomScroll < eventObj.pageY && bottomScroll <= documentHeight) {
                  window.scrollBy(0, 10);
                }

                // to scroll top if cursor y-position is less than the top position the vertical scroll
                if (topScroll > eventObj.pageY) {
                  window.scrollBy(0, -10);
                }

                $uiTreeHelper.positionMoved(e, pos, firstMoving);
                if (firstMoving) {
                  firstMoving = false;
                  return;
                }

                // Select the drag target. Because IE does not support CSS 'pointer-events: none', it will always
                // pick the drag element itself as the target. To prevent this, we hide the drag element while
                // selecting the target.
                var displayElm;

                if (angular.isFunction(dragElm.hide)) {
                  dragElm.hide();
                }else{
                  displayElm = dragElm[0].style.display;
                  dragElm[0].style.display = 'none';
                }

                var targetX = eventObj.pageX - $window.document.body.scrollLeft;
                var targetY = eventObj.pageY - (window.pageYOffset || $window.document.documentElement.scrollTop);

                // when using elementFromPoint() inside an iframe, you have to call
                // elementFromPoint() twice to make sure IE8 returns the correct value
                $window.document.elementFromPoint(targetX, targetY);

                var targetElm = angular.element($window.document.elementFromPoint(targetX, targetY));
                if (angular.isFunction(dragElm.show)) {
                  dragElm.show();
                }else{
                  dragElm[0].style.display = displayElm;
                }

                var targetNode = targetElm.scope();
                if (!pos.dirAx && targetNode !== scope.prevHoverNode) {
                  var isEmpty         = false;
                  scope.prevHoverNode = targetNode;

                  if (!targetNode) {
                    return;
                  }
                  if (targetNode.$type === 'uiTree' && targetNode.dragEnabled) {
                    isEmpty = targetNode.isEmpty(); // Check if it's empty tree
                  }
                  if (targetNode.$type === 'uiTreeHandle') {
                    targetNode = targetNode.$nodeScope;
                  }
                  if (targetNode.$type === 'uiTreeDummyNode') { // Check if it is dropped at the tree root
                    dropAccpeted = targetNode.$parentNodesScope.accept(scope, -1);
                    if (dropAccpeted) {
                      dragInfo.moveTo(targetNode.$parentNodesScope, targetNode.$parentNodesScope.childNodes(), findInsertIndex(scope.$modelValue, targetNode.$parentNodesScope.$modelValue));
                    }
                    $('.dragover').removeClass('dragover');
                    targetElm.addClass('dragover');
                    if (expandTimer) {
                      $timeout.cancel(expandTimer);
                      expandTimer = null;
                    }
                    return;
                  }
                  if (targetNode.$type !== 'uiTreeNode' && !isEmpty) { // Check if it is a uiTreeNode or it's an empty tree
                    return;
                  }

                  $timeout.cancel(expandTimer);
                  $('.dragover').removeClass('dragover');

                  if (targetNode.$childNodesScope) { // It's a folder
                    angular.element(targetNode.$element.children()[0]).addClass('dragover');

                    // Expand the folder automatically if it was originally collapsed
                    if (targetNode.collapsed) {
                      expandTimer = $timeout(function(){
                        targetNode.collapsed = false;
                        scope.nodeToExpand = null;
                      }, expandDelay);
                    }
                    scope.nodeToExpand = targetNode;
                  } else if (targetNode.$parentNodeScope){ // It's a file, we modify its parent
                    targetElm.addClass('dragover');
                    angular.element(targetNode.$parentNodeScope.$element.children()[0]).addClass('dragover');
                    scope.nodeToExpand = targetNode.$parentNodeScope;
                  } else {  // file at root
                    targetElm.addClass('dragover');
                  }

                  if (isEmpty) { // it's an empty tree
                    if (targetNode.$nodesScope.accept(scope, 0)) {
                      dragInfo.moveTo(targetNode.$nodesScope, targetNode.$nodesScope.childNodes(), 0);
                    }
                  } else if (targetNode.dragEnabled()){ // drag enabled
                    targetElm = targetNode.$element; // Get the element of ui-tree-node
                    dropAccpeted = targetNode.$parentNodesScope.accept(scope, targetNode.index());
                    if (dropAccpeted) {
                      if (targetNode.$childNodesScope) {
                        dragInfo.moveTo(targetNode.$childNodesScope, targetNode.childNodes(), findInsertIndex(scope.$modelValue, targetNode.$childNodesScope.$modelValue));
                      } else {
                        dragInfo.moveTo(targetNode.$parentNodesScope, targetNode.$parentNodesScope.childNodes(), findInsertIndex(scope.$modelValue, targetNode.$parentNodesScope.$modelValue));
                      }
                    }
                  }
                }

                scope.$apply(function() {
                  scope.$callbacks.dragMove(dragInfo.eventArgs(elements, pos));
                });
              }
            };

            var dragEnd = function(e) {
              e.preventDefault();

              if (dragElm) {
                scope.$treeScope.$apply(function() {
                  scope.$callbacks.beforeDrop(dragInfo.eventArgs(elements, pos));
                });
                // roll back elements changed
                hiddenPlaceElm.replaceWith(scope.$element);

                dragElm.remove();
                dragElm = null;
                if (scope.$$apply) {
                  dragInfo.apply();
                  scope.$treeScope.$apply(function() {
                    scope.$callbacks.dropped(dragInfo.eventArgs(elements, pos));
                  });
                } else {
                  bindDrag();
                }
                scope.$treeScope.$apply(function() {
                  var eventArgs = dragInfo.eventArgs(elements, pos);
                  eventArgs.canceled = dragCanceled;
                  scope.$callbacks.dragStop(eventArgs);
                });
                scope.$$apply = false;
                dragInfo = null;
              }

              angular.element($document).unbind('touchend', dragEndEvent); // Mobile
              angular.element($document).unbind('touchcancel', dragEndEvent); // Mobile
              angular.element($document).unbind('touchmove', dragMoveEvent); // Mobile
              angular.element($document).unbind('mouseup', dragEndEvent);
              angular.element($document).unbind('mousemove', dragMoveEvent);
              angular.element($window.document.body).unbind('mouseleave', dragCancelEvent);

              // reset variables
              $('.dragover').removeClass('dragover');
              scope.$element.removeClass('drag-elm');
              scope.$treeScope.isDragging = false;
              scope.prevHoverNode         = null;
              dragCanceled                = false;
            };

            // find the index to insert a element into a sorted array
            var findInsertIndex = function (source, dest) {
              var low = 0, high = dest.length - 1, mid;
              while (high >= low) {
                mid = Math.floor((low + high) / 2);
                if (ramlRepository.sortingFunction.call(null, dest[mid], source) > 0) {
                  high = mid - 1;
                } else {
                  low = mid + 1;
                }
              }
              return low;
            };

            var dragStartEvent = function(e) {
              if (scope.dragEnabled()) {
                dragStart(e);
              }
            };

            var dragMoveEvent = function(e) {
              dragMove(e);
            };

            var dragEndEvent = function(e) {
              scope.$$apply = dropAccpeted;
              dragEnd(e);
            };

            var dragCancelEvent = function(e) {
              scope.$$apply = false;
              dragCanceled  = true;
              dragEnd(e);
            };

            var bindDrag = function() {
              $timeout(function () {
                element.unbind();
                element.bind('touchstart mousedown', function (e) {
                  dragDelaying = true;
                  dragStarted = false;
                  dragTimer = $timeout(function(){
                    dragDelaying = false;
                    dragStartEvent(e);
                  }, scope.dragDelay);
                });
                element.bind('touchend touchcancel mouseup',function(){$timeout.cancel(dragTimer);});
              });
            };
            bindDrag();

            angular.element($window.document.body).bind('keydown', function(e) {
              if (e.keyCode === 27) {
                dragCancelEvent(e);
              }
            });
          }
        };
      }
    ])
    /**
     * ui-tree-dummy-node directive is a used as a dummy node in the tree to accept
     * drag-n-drop events, so that we can implement dragging into the root directory
     * without displaying the root directory in the file-tree
     */
    .directive('uiTreeDummyNode', ['treeConfig',
      function (treeConfig) {
        return {
          require: ['^uiTreeNodes', '^uiTree'],
          template: '<div class="file-item dummy" ng-class="{\'no-drop\': fileBrowser.cursorState === \'no\', copy: fileBrowser.cursorState === \'ok\'}"></div>',
          restrict: 'E',
          replace: true,
          controller: function ($scope, $element) {
            this.scope = $scope;

            $scope.$element          = $element;
            $scope.$parentNodeScope  = null; // uiTreeNode Scope of parent node;
            $scope.$childNodesScope  = null; // uiTreeNodes Scope of child nodes.
            $scope.$parentNodesScope = null; // uiTreeNodes Scope of parent nodes.
            $scope.$treeScope        = null; // uiTree scope
            $scope.$$apply           = false;
            $scope.$type             = 'uiTreeDummyNode';

            $scope.init = function(controllersArr) {
              var treeNodesCtrl = controllersArr[0];
              $scope.$treeScope = controllersArr[1] ? controllersArr[1].scope : null;

              // find the scope of it's parent node
              $scope.$parentNodeScope = treeNodesCtrl.scope.$nodeScope;
              $scope.$parentNodesScope = treeNodesCtrl.scope;
            };
          },
          link: function(scope, element, attr, controllersArr) {
            var config = {};
            angular.extend(config, treeConfig);
            if (config.nodeClass) {
              element.addClass(config.nodeClass);
            }
            scope.init(controllersArr);
          }
        };
      }
    ]);
})();

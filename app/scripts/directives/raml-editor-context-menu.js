(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorContextMenu', function (
      $window,
      ramlRepository,
      ramlEditorInputPrompt,
      ramlEditorConfirmPrompt,
      scroll
    ) {
      function createActions(parent, target) {
        var actions = [
          {
            label: 'Save',
            execute: function() {
              ramlRepository.saveFile(target);
            }
          },
          {
            label: 'Delete',
            execute: function() {
              var action;
              var message;

              if (target.isDirectory) {
                action = parent.removeDirectory;
                message = 'Are you sure you want to delete "' + target.name + '" and all its contents?';
              }
              else {
                action = parent.removeFile;
                message = 'Are you sure you want to delete "' + target.name + '"?';
              }
              ramlEditorConfirmPrompt.open(message, function(){
                action.apply(parent, [target]);
              });
            }
          },
          {
            label: 'Rename',
            execute: function() {
              var action;
              var message;
              var targetList;

              if (target.isDirectory) {
                action = ramlRepository.renameDirectory;
                message = 'Input a new name for this folder:';
                targetList = parent.getDirectories();
              }
              else {
                action = ramlRepository.renameFile;
                message = 'Input a new name for this file:';
                targetList = parent.getFiles();
              }

              var newName = ramlEditorInputPrompt.open(message, target.name, [{
                message: 'That name is already taken.',
                validate: function(input) {
                  return !targetList.some(function (t) {
                    return t.name.toLowerCase() === input.toLowerCase();
                  });
                }
              }]);

              if(newName.length > 0 && newName !== target.name) {
                action.apply(undefined, [target, newName]);
              }
            }
          }
        ];

        // remove the 'Save' action if the target is a directory
        return target.isDirectory ? actions.slice(1) : actions;
      }

      function outOfWindow(el) {
        var rect = el.getBoundingClientRect();
        return !(rect.top >= 0 &&
                 rect.left >= 0 &&
                 rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                 rect.right <= (window.innerWidth || document.documentElement.clientWidth));
      }

      return {
        restrict: 'E',
        templateUrl: 'views/raml-editor-context-menu.tmpl.html',
        link: function(scope, element) {
          function positionMenu(element, offsetTarget) {
            var rect = offsetTarget.getBoundingClientRect();

            var left = rect.left + 0.5 * rect.width,
                top = rect.top + 0.5 * rect.height;

            var menuContainer = angular.element(element[0].children[0]);
            menuContainer.css('left', left + 'px');
            menuContainer.css('top', top + 'px');

            setTimeout(function() {
              if (outOfWindow(menuContainer[0])) {
                menuContainer.css('top', top - menuContainer[0].offsetHeight + 'px');
              }
            }, 0);
          }

          function close() {
            scroll.enable();
            scope.$apply(function() {
              delete contextMenuController.file;
              scope.opened = false;

              $window.removeEventListener('click', close);
              $window.removeEventListener('keydown', closeOnEscape);
            });
          }

          function closeOnEscape(e) {
            if (e.which === 27) {
              e.preventDefault();
              close();
            }
          }

          var contextMenuController = {
            open: function(event, target) {
              scroll.disable();
              this.target = target;
              var parent = ramlRepository.getDirectory(target.parentPath(), scope.homeDirectory);

              scope.actions = createActions(parent, target);

              event.stopPropagation();
              positionMenu(element, event.target);
              $window.addEventListener('click', close);
              $window.addEventListener('keydown', closeOnEscape);

              scope.opened = true;
            }
          };

          scope.registerContextMenu(contextMenuController);
        },

        scope: true
      };
    })
  ;
})();

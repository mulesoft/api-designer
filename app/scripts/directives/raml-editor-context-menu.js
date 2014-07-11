(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorContextMenu', function (
      $window,
      ramlRepository,
      ramlEditorInputPrompt,
      scroll
    ) {
      function createActions(target) {
        var actions = [
          {
            label: 'Save',
            execute: function () {
              ramlRepository.saveFile(target);
            }
          },
          {
            label: 'Delete',
            execute: function () {
              var action;
              var message;

              if (target.isDirectory) {
                action = ramlRepository.removeDirectory;
                message = 'Are you sure you want to delete "' + target.name + '" and all its contents?';
              }
              else {
                action = ramlRepository.removeFile;
                message = 'Are you sure you want to delete "' + target.name + '"?';
              }

              $window.confirm(message) ? action.call(ramlRepository, target) : void(0) ;
            }
          },
          {
            label: 'Rename',
            execute: function () {
              var action;
              var message;
              var parent = ramlRepository.getParent(target);

              if (target.isDirectory) {
                action = ramlRepository.renameDirectory;
                message = 'Input a new name for this folder:';
              }
              else {
                action = ramlRepository.renameFile;
                message = 'Input a new name for this file:';
              }

              var validations = [
                {
                  message: 'That name is already taken.',
                  validate: function(input) {
                    return !parent.children.some(function (t) {
                      return t.name.toLowerCase() === input.toLowerCase();
                    });
                  }
                }, {
                  message: 'New name cannot be empty.',
                  validate: function(input) {
                    return input.length > 0;
                  }
                }
              ];

              ramlEditorInputPrompt.open(message, target.name, validations)
                .then(function(name){
                  action.call(ramlRepository, target, name);
                });
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

            setTimeout(function () {
              if (outOfWindow(menuContainer[0])) {
                menuContainer.css('top', top - menuContainer[0].offsetHeight + 'px');
              }
            }, 0);
          }

          function close() {
            scroll.enable();
            scope.$apply(function () {
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

              scope.actions = createActions(target);

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

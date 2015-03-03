(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorContextMenu', function ramlEditorContextMenu(
      $injector,
      $window,
      confirmModal,
      newNameModal,
      ramlRepository,
      newFileService,
      newFolderService,
      scroll
    ) {
      function createActions(target) {
        var saveAction = {
          label:   'Save',
          execute: function execute() {
            return ramlRepository.saveFile(target);
          }
        };

        var newFileAction = {
          label: 'New File',
          execute: function execute() {
            return newFileService.prompt(target);
          }
        };

        var newFolderAction = {
          label: 'New Folder',
          execute: function execute() {
            return newFolderService.prompt(target);
          }
        };

        var renameAction = {
          label:   'Rename',
          execute: function execute() {
            var parent  = ramlRepository.getParent(target);
            var message = target.isDirectory ? 'Enter a new name for this folder:' : 'Enter a new name for this file:';
            var title   = target.isDirectory ? 'Rename a folder' : 'Rename a file';

            var validations = [
              {
                message:  'This name is already taken.',
                validate: function validate(input) {
                  var path = ramlRepository.join(parent.path, input);

                  return !ramlRepository.getByPath(path);
                }
              }
            ];

            return newNameModal.open(message, target.name, validations, title)
              .then(function (name) {
                ramlRepository.rename(target, name);
              })
            ;
          }
        };

        var deleteAction = {
          label:   'Delete',
          execute: function execute() {
            var message;
            var title;

            if (target.isDirectory) {
              message = 'Are you sure you want to delete "' + target.name + '" and all its contents?';
              title   = 'Remove folder';
            }
            else {
              message = 'Are you sure you want to delete "' + target.name + '"?';
              title   = 'Remove file';
            }

            return confirmModal.open(message, title)
              .then(function () {
                ramlRepository.remove(target);
              })
            ;
          }
        };

        if (target.isDirectory) {
          return [newFileAction, newFolderAction, renameAction, deleteAction];
        }

        return [saveAction, renameAction, deleteAction];
      }

      function outOfWindow(el) {
        var rect = el.getBoundingClientRect();
        return !(rect.top >= 0 &&
                 rect.left >= 0 &&
                 rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                 rect.right <= (window.innerWidth || document.documentElement.clientWidth));
      }

      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-context-menu.tmpl.html',
        link:         function link(scope, element) {
          function positionMenu(element, event) {
            var top           = event.pageY;
            var left          = event.pageX;
            var menuContainer = angular.element(element[0].children[0]);

            menuContainer.css('top', top + 'px');
            menuContainer.css('left', left + 'px');

            setTimeout(function () {
              if (outOfWindow(menuContainer[0])) {
                menuContainer.css('top', top - menuContainer[0].offsetHeight + 'px');
              }
            }, 0);
          }

          function close() {
            scroll.enable();
            scope.$apply(function () {
              delete contextMenuController.target;
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
            open: function open(event, target) {
              scroll.disable();
              this.target = target;

              scope.actions = createActions(target);

              event.stopPropagation();
              positionMenu(element, event);
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

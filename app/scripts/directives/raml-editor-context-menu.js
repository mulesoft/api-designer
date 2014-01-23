/* jshint newcap: false */
(function() {
  'use strict';

  angular.module('ramlEditorApp').directive('ramlEditorContextMenu', function($window, fileList, ramlRepository, ramlEditorRemoveFilePrompt, ramlEditorFilenamePrompt) {
    function Actions(file) {
      return [
        {
          label: 'Save',
          execute: function() {
            fileList.saveFile(file);
          }
        },
        {
          label: 'Delete',
          execute: function() {
            ramlEditorRemoveFilePrompt.open(file);
          }
        },
        {
          label: 'Rename',
          execute: function() {
            ramlEditorFilenamePrompt.open(file.name).then(function(filename) {
              ramlRepository.renameFile(file, filename);
            });
          }
        }
      ];
    }

    return {
      restrict: 'E',
      templateUrl: 'views/raml-editor-context-menu.tmpl.html',
      link: function(scope, element) {
        function positionMenu(element, offsetTarget) {
          var menuContainer = angular.element(element[0].children[0]);
          menuContainer.css('left', offsetTarget.offsetLeft + 0.5 * offsetTarget.offsetWidth + 'px');
          menuContainer.css('top', offsetTarget.offsetTop + 0.5 * offsetTarget.offsetHeight + 'px');
        }

        function close() {
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
          open: function(event, file) {
            this.file = file;
            scope.actions = Actions(file);

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
  });
})();

(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorOmnisearch', function ramlEditorOmniSearch(
      safeApplyWrapper,
      eventEmitter,
      hotkeys
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-omnisearch.tmpl.html',
        controller:  function controller($scope, $element, $timeout) {
          var omnisearch = this;
          var length     = 0;
          var position   = 0;

          $scope.showOmnisearch = false;

          omnisearch.open = function open() {
            omnisearch.searchResults = null;
            omnisearch.searchText    = null;
            omnisearch.searchLine    = null;
            omnisearch.mode          = 'file';
            omnisearch.selected      = null;
            $scope.showOmnisearch    = true;
            position                 = 0;

            $timeout(function() {
              $element.find('input').focus();
            });
          };

          omnisearch.close = function close() {
            omnisearch.searchResults = null;
            omnisearch.searchText    = null;
            omnisearch.searchLine    = null;
            omnisearch.mode          = 'file';
            omnisearch.selected      = null;
            position                 = 0;
            $scope.showOmnisearch    = false;
          };

          eventEmitter.subscribe('event:open:omnisearch', function () {
            omnisearch.open();
          });

          var Command = function (execute) {
            this.execute = execute;
          };

          function goToResource() {
            omnisearch.mode = 'resource';

            function traverse(tree, resources, parentPath) {
              if (Array.isArray(tree.resources)) {
                tree.resources.forEach(function (el) {
                  traverse(el, resources, tree.relativeUri);
                });
              }

              if (tree.relativeUri) {
                resources.push({
                  name:     parentPath? parentPath + tree.relativeUri : tree.relativeUri,
                  relative: tree.relativeUri
                });
              }
            }

            var resources = [];
            var text      = omnisearch.searchText.split('@')[1];

            traverse($scope.fileBrowser.selectedFile.raml, resources);

            resources = resources.sort(function (a,b) { return b.name < a.name; });
            console.log(resources);

            resources.forEach(function (el) {
              if (el.name.indexOf(text) !== -1) {
                omnisearch.searchResults.push(el);
              }
            });

            position            = -1;
            length              = omnisearch.searchResults.length;
          }

          function goToLine() {
            omnisearch.mode = 'line';

            var line = omnisearch.searchText.match(/(\d+)/g);

            omnisearch.searchLine = parseInt(line, 10);

            eventEmitter.publish('event:goToLine', {line: omnisearch.searchLine});
          }

          function searchFile() {
            omnisearch.mode = 'file';

            $scope.homeDirectory.forEachChildDo(function (child) {
              if(!child.isDirectory) {
                var filename = child.name.replace(child.extension, '');

                if (filename.indexOf(omnisearch.searchText) !== -1) {
                  omnisearch.searchResults.push(child);
                }
              }
            });

            omnisearch.selected = omnisearch.searchResults[0];
            length              = omnisearch.searchResults.length;
          }

          function showCheatSheet() {
            omnisearch.close();
            hotkeys.toggleCheatSheet();
          }

          function getCommand(text) {
            if (text.startsWith(':')) {
              return new Command(goToLine);
            }

            if (text.startsWith('@')) {
              return new Command(goToResource);
            }

            if (text === "?") {
              return new Command(showCheatSheet);
            }

            return new Command(searchFile);
          }

          omnisearch.search = function search() {
            omnisearch.searchResults = [];
            position                 = 0;

            getCommand(omnisearch.searchText).execute();
          };

          omnisearch.showContent = function showContent(data) {
            if(omnisearch.mode === 'resource') {
              eventEmitter.publish('event:goToResource', {text: data.relative, focus: true});
            }

            if(omnisearch.mode === 'file') {
              omnisearch.openFile(data);
            }
          };

          omnisearch.openFile = function openFile(file) {
            file = file || omnisearch.selected;

            if (!file) {
              $scope.showOmnisearch = false;
            }

            $scope.fileBrowser.selectFile(file);
            $scope.showOmnisearch = false;
          };

          omnisearch.isSelected = function isSelected(current) {
            return omnisearch.selected ? current.name === omnisearch.selected.name : false;
          };

          omnisearch.keyUp = function move(keyCode) {
            // enter
            if (keyCode === 13) {
              if (omnisearch.mode === 'file') {
                omnisearch.openFile(null);
              }

              if (omnisearch.mode === 'line') {
                eventEmitter.publish('event:goToLine', {
                  line:  omnisearch.searchLine,
                  focus: true
                });
              }

              if (omnisearch.mode === 'resource') {
                eventEmitter.publish('event:goToResource', {
                  text:  omnisearch.selected.relative,
                  focus: true
                });
              }

              omnisearch.close();
            }

            // esc
            if (keyCode === 27) {
              omnisearch.close();
            }

            // Up Arrow
            if (keyCode === 38) {
              if (position > 0) {
                position--;
              }

              omnisearch.selected = omnisearch.searchResults[position];

              if(omnisearch.mode === 'resource') {
                eventEmitter.publish('event:goToResource', {text: omnisearch.selected.relative});
              }
            }

            // Down Arrow
            if (keyCode === 40) {
              $timeout(function() {
                $element.focus();
              });

              if (position < length-1) {
                position++;
              }

              omnisearch.selected = omnisearch.searchResults[position];

              if(omnisearch.mode === 'resource') {
                eventEmitter.publish('event:goToResource', {text: omnisearch.selected.relative});
              }
            }
          };

          $scope.omnisearch = omnisearch;
        }
      };
    })
  ;
})();

(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorOmnisearch', function ramlEditorOmniSearch(
      eventEmitter,
      hotkeys,
      ramlEditorContext
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-omnisearch.tmpl.html',
        controller:  function controller($scope, $element, $timeout, $sce) {
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
            omnisearch.showHelp      = false;
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
            omnisearch.showHelp      = false;
            $scope.showOmnisearch    = false;
            position                 = 0;
          };

          eventEmitter.subscribe('event:open:omnisearch', function () {
            omnisearch.open();
          });

          eventEmitter.subscribe('event:editor:click', function () {
            omnisearch.close();
          });

          var Command = function (execute) {
            this.execute = execute;
          };

          function goToResource() {
            omnisearch.mode = 'resource';

            var resources = ramlEditorContext.context.resources;
            var text      = omnisearch.searchText.replace('@', '')
              .replace(/:/g, '')
              .split(' ')
              .join('/');

            resources.forEach(function (el) {
              var formatedEl   = el.replace(/:/g, '');

              if (formatedEl.indexOf(text) !== -1) {
                omnisearch.searchResults.push({
                  name: $sce.trustAsHtml(formatedEl.replace(text, '<strong style="color: #0090f1;">'+text+'</strong>')),
                  text: el
                });
              }
            });

            position = 0;
            length   = omnisearch.searchResults.length;
            omnisearch.selected = omnisearch.searchResults[0];

            selectResource(false);
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
              var text = omnisearch.searchText;

              if(!child.isDirectory) {
                var filename = child.name.replace(child.extension, '');

                if (text.length > 0 && filename.indexOf(text) !== -1) {
                  omnisearch.searchResults.push({
                    name: $sce.trustAsHtml(child.name.replace(text, '<strong style="color: #0090f1;">'+text+'</strong>')),
                    text: child
                  });
                }
              }
            });

            omnisearch.selected = omnisearch.searchResults[0];
            length              = omnisearch.searchResults.length;
          }

          function searchText() {
            omnisearch.mode = 'text';

            var content  = ramlEditorContext.context.content;
            var text     = omnisearch.searchText.replace('#', '');

            content.forEach(function (line, i) {
              if (text && text.length > 0 && line.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                omnisearch.searchResults.push({
                  name: $sce.trustAsHtml(line.replace(text, '<strong style="color: #0090f1;">'+text+'</strong>')),
                  text: line,
                  line: i+1
                });
              }
            });

            position = -1;
            length   = omnisearch.searchResults.length;
            omnisearch.selected = omnisearch.searchResults[0];

            if (omnisearch.selected) {
              eventEmitter.publish('event:goToLine', {
                line:  omnisearch.selected.line,
                focus: false
              });
            }
          }

          function showCheatSheet() {
            // omnisearch.close();
            // hotkeys.toggleCheatSheet();
            omnisearch.showHelp = true;
          }

          function getCommand(text) {
            if (text.startsWith(':')) {
              return new Command(goToLine);
            }

            if (text.startsWith('@')) {
              return new Command(goToResource);
            }

            if (text.startsWith('#')) {
              return new Command(searchText);
            }

            if (text === '?') {
              return new Command(showCheatSheet);
            }

            return new Command(searchFile);
          }

          omnisearch.search = function search() {
            omnisearch.searchResults = [];
            position                 = 0;
            omnisearch.showHelp      = false;

            getCommand(omnisearch.searchText).execute();
          };

          omnisearch.showContent = function showContent(data, focus, skipFiles) {
            if(omnisearch.mode === 'resource') {
              var resource = data.text.split('/');

              resource = resource.pop().replace(':', '');

              eventEmitter.publish('event:goToResource', {
                scope:     data.text,
                resource:  resource,
                text:      resource,
                focus:     typeof focus === 'undefined' ? true : focus
              });
            }

            if(!skipFiles && omnisearch.mode === 'file') {
              omnisearch.openFile(data.text);
            }

            if(omnisearch.mode === 'text') {
              eventEmitter.publish('event:goToLine', {
                line:  data.line,
                focus: typeof focus === 'undefined' ? true : focus
              });
            }
          };

          omnisearch.openFile = function openFile(file) {
            file = file || omnisearch.selected.text;

            if (!file) {
              $scope.showOmnisearch = false;
            }

            $scope.fileBrowser.selectFile(file);
            $scope.showOmnisearch = false;
          };

          omnisearch.isSelected = function isSelected(current) {
            if (current.line) {
              return omnisearch.selected ? current.line === omnisearch.selected.line : false;
            }

            return omnisearch.selected ? current.text === omnisearch.selected.text : false;
          };

          function selectResource(focus) {
            if (omnisearch.searchResults[position]) {
              var resource = omnisearch.searchResults[position].text.split('/');

              resource = resource.pop().replace(':', '');

              eventEmitter.publish('event:goToResource', {
                scope:    omnisearch.searchResults[position].text,
                resource: resource,
                text:     resource,
                focus:    focus
              });
            }
          }

          // var scrollPosition = 0;
          // var scrollSize     = 19;

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
                selectResource(true);
              }

              if(omnisearch.mode === 'text') {
                eventEmitter.publish('event:goToLine', {
                  line:  omnisearch.selected.line,
                  focus: true
                });
              }

              omnisearch.close();
            }

            // esc
            if (keyCode === 27) {
              omnisearch.close();
            }

            // // Up Arrow
            // if (keyCode === 38) {
            //   if (position > 0) {
            //     position--;
            //     scrollPosition = scrollPosition-scrollSize;
            //     $($element.find('ul')).scrollTop(scrollPosition);
            //   }

            //   omnisearch.selected = omnisearch.searchResults[position];

            //   if(omnisearch.mode === 'resource') {
            //     selectResource(false);
            //   }

            //   if(omnisearch.mode === 'text') {
            //     eventEmitter.publish('event:goToLine', {
            //       line:  omnisearch.selected.line,
            //       focus: false
            //     });
            //   }
            // }

            // // Down Arrow
            // if (keyCode === 40) {
            //   $timeout(function() {
            //     $element.focus();
            //   });

            //   if (position < length-1) {
            //     position++;

            //     if (position > 15) {
            //       scrollPosition = scrollPosition+scrollSize;
            //       $($element.find('ul')).scrollTop(scrollPosition);
            //     }
            //   }

            //   omnisearch.selected = omnisearch.searchResults[position];

            //   if(omnisearch.mode === 'resource') {
            //     selectResource(false);
            //   }

            //   if(omnisearch.mode === 'text') {
            //     eventEmitter.publish('event:goToLine', {
            //       line:  omnisearch.selected.line,
            //       focus: false
            //     });
            //   }
            // }
          };

          $scope.omnisearch = omnisearch;
        }
      };
    })
  ;
})();

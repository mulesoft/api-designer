'use strict';

var codeMirror, codeMirrorErrors,
  $rootScope, $controller, $q, applySuggestion;

describe('RAML Editor Main Controller', function () {
  var params, ctrl, scope, annotationsToDisplay, editor, $timeout, $confirm, $window, ramlRepository, sandbox, ramlParser;

  beforeEach(module('ramlEditorApp'));

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  beforeEach(inject(function ($injector) {
    $rootScope      = $injector.get('$rootScope');
    $controller     = $injector.get('$controller');
    $q              = $injector.get('$q');
    $timeout        = $injector.get('$timeout');
    $confirm        = $injector.get('$confirm');
    $window         = $injector.get('$window');
    codeMirror      = $injector.get('codeMirror');
    applySuggestion = $injector.get('applySuggestion');
    ramlRepository  = $injector.get('ramlRepository');
    ramlParser      = $injector.get('ramlParser');
  }));

  beforeEach(function () {
    scope  = $rootScope.$new();
    editor = getEditor(codeMirror);

    codeMirror.initEditor = function initEditor() {
      return editor;
    };

    codeMirrorErrors = {
      displayAnnotations: function displayAnnotations(annotations) {
        annotationsToDisplay = annotations;
      },

      clearAnnotations: function clearAnnotations() {}
    };

    scope.homeDirectory = {
      children: [],
      forEachChildDo: function() {}
    };

    params = {
      $scope: scope,
      codeMirror: codeMirror,
      codeMirrorErrors: codeMirrorErrors,
      $confirm: $confirm
    };
  });

  describe('leaving the page', function() {
    it('should ask user for confirmation if there are unsaved changes', function () {
      scope.homeDirectory = {
        children: [
          { dirty: false },
          { dirty: true },
          { dirty: false }
        ],
        forEachChildDo: function(action) {
          for (var i = 0; i < this.children.length; i++) {
            action.call(this.children[i], this.children[i]);
          }
        }
      };
      ctrl = $controller('ramlEditorMain', params);

      $window.onbeforeunload().should.equal('WARNING: You have unsaved changes. Those will be lost if you leave this page.');
    });

    it('should not ask user for confirmation if there are no unsaved changes', function () {
      scope.homeDirectory = {
        children: [
          { dirty: false },
          { dirty: false },
          { dirty: false }
        ],
        forEachChildDo: function(action) {
          for (var i = 0; i < this.children.length; i++) {
            action.call(this.children[i], this.children[i]);
          }
        }
      };
      ctrl = $controller('ramlEditorMain', params);

      should.not.exist($window.onbeforeunload());
    });
  });

  describe('on raml parser warning', function () {
    it('should display warnings', function () {
      // Arrange
      ctrl = $controller('ramlEditorMain', params);
      var warning = {
        message: 'Unknown property',
        isWarning: true
      };
      should.not.exist(scope.currentError);

      // Act
      $rootScope.$broadcast('event:raml-parser-error', warning);

      // Assert
      annotationsToDisplay.length.should.be.equal(1);
      annotationsToDisplay[0].line.should.be.equal(1);
      annotationsToDisplay[0].column.should.be.equal(1);
      annotationsToDisplay[0].message.should.be.equal(warning.message);
      annotationsToDisplay[0].severity.should.be.equal('warning');
    });
  });

  describe('on raml parser error', function () {
    it('should display errors on first line if no line specified', function () {
      // Arrange
      ctrl = $controller('ramlEditorMain', params);
      var error = {
        message: 'Error without line or column!'
      };
      should.not.exist(scope.currentError);

      // Act
      $rootScope.$broadcast('event:raml-parser-error', error);

      // Assert
      annotationsToDisplay.length.should.be.equal(1);
      annotationsToDisplay[0].line.should.be.equal(1);
      annotationsToDisplay[0].column.should.be.equal(1);
      annotationsToDisplay[0].message.should.be.equal(error.message);
      annotationsToDisplay[0].severity.should.be.equal('error');
    });

    it('should display errors with link to root cause', function () {
      // Arrange
      ctrl = $controller('ramlEditorMain', params);
      var apiRamlErrorMessage = 'Issues in the used library: "./libraries/types.raml"';

      scope.fileBrowser = {
        selectedFile: {
          name: 'api.raml',
          path: 'api.raml'
        }
      };

      var errors = [{
          'code': 11,
          'message': 'Required property "type" is missing',
          'path': 'libraries/album_simple.raml',
          'range': {
            'start': {
              'line': 5,
              'column': 0,
              'position': 93
            },
            'end': {
              'line': 5,
              'column': 7,
              'position': 100
            }
          },
          'isWarning': false,
          'trace': [
            {
              'code': 11,
              'message': 'Error in the included file: Required property "type" is missing',
              'path': 'libraries/types.raml',
              'range': {
                'start': {
                  'line': 2,
                  'column': 2,
                  'position': 28
                },
                'end': {
                  'line': 2,
                  'column': 13,
                  'position': 39
                }
              },
              'isWarning': false,
              'trace': [
                {
                  'code': 0,
                  'message': apiRamlErrorMessage,
                  'path': 'api.raml',
                  'range': {
                    'start': {
                      'line': 5,
                      'column': 2,
                      'position': 82
                    },
                    'end': {
                      'line': 5,
                      'column': 5,
                      'position': 85
                    }
                  },
                  'isWarning': true
                }
              ]
            }
          ]
        }];
      should.not.exist(scope.currentError);

      // Act
      $rootScope.$broadcast('event:raml-parser-error', errors);

      // Assert
      annotationsToDisplay.length.should.be.equal(1);
      annotationsToDisplay[0].line.should.be.equal(6);
      annotationsToDisplay[0].column.should.be.equal(2);
      annotationsToDisplay[0].tracingColumn.should.be.equal(2);
      annotationsToDisplay[0].tracingLine.should.be.equal(3);
      annotationsToDisplay[0].message.should.be.equal(apiRamlErrorMessage);
      annotationsToDisplay[0].severity.should.be.equal('error');
    });

    describe.skip('code folding a block containing the errored line', function() {
      it('lifts the error marker to the start of the fold', function() {
        annotationsToDisplay = [];

        ctrl = $controller('ramlEditorMain', params);
        var error = {
          message: 'Error without line or column!',
          'problem_mark': {
            line: 8
          }
        };

        $rootScope.$broadcast('event:raml-parser-error', error);
        CodeMirror.signal(editor, 'fold', editor, {line: 6}, {line: 10});

        annotationsToDisplay[0].line.should.be.equal(7);
        annotationsToDisplay[0].message.should.be.equal('Error on line 9: ' + error.message);
        annotationsToDisplay[0].severity.should.be.equal('error');
      });

      it('restores the error marker on unfolding', function() {
        annotationsToDisplay = [];

        ctrl = $controller('ramlEditorMain', params);
        var error = {
          message: 'Error without line or column!',
          'problem_mark': {
            line: 8
          }
        };

        $rootScope.$broadcast('event:raml-parser-error', error);
        CodeMirror.signal(editor, 'fold', editor, {line: 6}, {line: 10});
        CodeMirror.signal(editor, 'unfold', editor, {line: 6}, {line: 10});

        annotationsToDisplay[0].line.should.be.equal(9);
        annotationsToDisplay[0].message.should.be.equal(error.message);
        annotationsToDisplay[0].severity.should.be.equal('error');
      });

      it('moves the error marker to the next fold when nested', function() {
        annotationsToDisplay = [];
        sinon.stub(editor, 'findMarksAt', function() {
          return [{
            __isFold: true,
            find: function() {
              return {from: {line: 7}};
            }
          }];
        });

        ctrl = $controller('ramlEditorMain', params);
        var error = {
          message: 'Error without line or column!',
          'problem_mark': {
            line: 8
          }
        };

        $rootScope.$broadcast('event:raml-parser-error', error);
        CodeMirror.signal(editor, 'fold', editor, {line: 7}, {line: 10});
        CodeMirror.signal(editor, 'fold', editor, {line: 6}, {line: 10});
        CodeMirror.signal(editor, 'unfold', editor, {line: 6}, {line: 10});

        annotationsToDisplay[0].line.should.be.equal(8);
        annotationsToDisplay[0].message.should.be.equal('Error on line 9: ' + error.message);
        annotationsToDisplay[0].severity.should.be.equal('error');
      });
    });
  });

  describe('on event:raml-editor-file-selected', function () {
    beforeEach(function() {
      scope.fileBrowser = {
        selectedFile: {

        }
      };
      ctrl = $controller('ramlEditorMain', params);

      editor.getValue().should.be.equal('');
    });

    it('loads the new file in the editor', function () {
      scope.$emit('event:raml-editor-file-selected', { name: 'api.raml', path: '/', contents: 'file1' });
      scope.$digest();

      editor.getValue().should.be.equal('file1');
    });

    describe('setting the editor mode', function() {
      var setOptionStub;

      beforeEach(function() {
        setOptionStub = sinon.stub(editor, 'setOption');
      });

      it('formats xml', function() {
        scope.$emit('event:raml-editor-file-selected', { name: 'api.xml', extension: 'xml', path: '/', contents: 'file1' });
        scope.$digest();

        setOptionStub.should.have.been.calledWith('mode', sinon.match({name: 'xml'}));
      });

      it('formats xsd', function() {
        scope.$emit('event:raml-editor-file-selected', { name: 'api.xsd', extension: 'xsd', path: '/', contents: 'file1' });
        scope.$digest();

        setOptionStub.should.have.been.calledWith('mode', sinon.match({name: 'xml'}));
      });

      it('formats json', function() {
        scope.$emit('event:raml-editor-file-selected', { name: 'api.json', extension: 'json', path: '/', contents: 'file1' });
        scope.$digest();

        setOptionStub.should.have.been.calledWith('mode', sinon.match({name: 'javascript'}));
      });

      it('formats md', function() {
        scope.$emit('event:raml-editor-file-selected', { name: 'api.md', extension: 'md', path: '/', contents: 'file1' });
        scope.$digest();

        setOptionStub.should.have.been.calledWith('mode', sinon.match({name: 'gfm'}));
      });

      it('formats other extensions as raml', function() {
        scope.$emit('event:raml-editor-file-selected', { name: 'api.whatever', extension: 'whatever', path: '/', contents: 'file1' });
        scope.$digest();

        setOptionStub.should.have.been.calledWith('mode', sinon.match({name: 'raml'}));
      });
    });
  });

  describe('on changes to editor content', function() {
    it('updates the fileBrowser.selectedFile contents', function() {
      scope.fileBrowser = {
        selectedFile: {
          name:     'api.raml',
          contents: ''
        }
      };
      $controller('ramlEditorMain', params);

      editor.setValue('updated editor contents');
      scope.$digest();
      $timeout.flush();

      scope.fileBrowser.selectedFile.contents.should.equal('updated editor contents');
    });
  });

  describe('tracing errors', function () {
    beforeEach(function () {
      scope.fileBrowser = {
        rootFile: {
          type: 'file',
          path: '/api.raml',
          isDirectory : false,
          extension: 'raml',
          name: 'api.raml',
          contents: '#%RAML 1.0\ntitle: My API\nresourceTypes:\n  collection: !include resourceType.raml',
          children: []
        },

        resourceFile: {
          name: 'resourceType.raml',
          path:      '/resourceType.raml',
          extension: 'raml',
          contents : '#%RAML 1.0 ResourceType'
        }
      };
    });

    it.skip('error should be traced in files including it', function () {
      ctrl = $controller('ramlEditorMain', params);

      sinon.stub(ramlRepository, 'getByPath', function (path) {
        return { path: path };
      });

      var loadRaml = sinon.spy(scope, 'loadRaml');

      scope.fileBrowser.selectedFile = scope.fileBrowser.rootFile;
      scope.$emit('event:raml-editor-file-selected', scope.fileBrowser.selectedFile);
      scope.$emit('event:file-updated');
      scope.$digest();
      loadRaml.exceptions.length.should.be.equal(1);
      loadRaml.should.have.been.calledWith(scope.fileBrowser.rootFile.contents, scope.fileBrowser.rootFile.path);

      scope.fileBrowser.selectedFile = scope.fileBrowser.resourceFile;
      scope.$emit('event:raml-editor-file-selected', scope.fileBrowser.selectedFile);
      scope.$emit('event:file-updated');
      scope.$digest();
      loadRaml.exceptions.length.should.be.equal(2);
      loadRaml.should.have.been.calledWith(scope.fileBrowser.resourceFile.contents, scope.fileBrowser.resourceFile.path);
    });
  });

  describe('parsing RAML definition', function () {
    it.skip('should use ramlParserFileReader to load included local files using ramlRepository', function (done) {
      //
      $controller('ramlEditorMain', params);

      // arrange
      var loadFileStub = sinon.stub(ramlRepository, 'getByPath', function (path) {
        // assert
        path.should.be.equal('/2.raml');

        // restore
        loadFileStub.restore();

        // done
        done();
      });

      // act
      scope.loadRaml([
        '#%RAML 0.8',
        '---',
        'title: !include 2.raml'
      ].join('\n'), '/1.raml');
    });

    it.skip('should use ramlParserFileReader to load included external files using $http service', function (done) {
      inject(function ($http) {
        //
        $controller('ramlEditorMain', params);

        // arrange
        var httpGetStub = sinon.stub($http, 'get', function (url) {
          // assert
          url.should.be.equal('/proxy/http://api.com/title.raml');

          // restore
          httpGetStub.restore();

          // done
          done();

          // return something to manage unhandled exception
          return $q.defer().promise;
        });

        // act
        scope.loadRaml([
          '#%RAML 0.8',
          '---',
          'title: !include http://api.com/title.raml'
        ].join('\n'));
      });
    });
  });

  describe('getIsFileParsable', function () {
    var getIsFileParsable;

    beforeEach(function () {
      $controller('ramlEditorMain', params);
      getIsFileParsable = scope.getIsFileParsable;
    });

    it('should return false for files without ".raml" extension', function () {
      getIsFileParsable(
        {
          name:      'myApi.json',
          extension: 'json'
        }
      ).should.be.false;
    });

    it('should return false for files without proper version tag as the very first line', function () {
      getIsFileParsable(
        {
          name:      'myApi.raml',
          extension: 'raml',
          contents:  'title: My API'
        }
      ).should.be.false;
    });

    it.skip('should use passed RAML source (invalid) instead of provided by file model and return false', function () {
      getIsFileParsable(
        {
          name:      'myApi.raml',
          extension: 'raml',
          contents:  ['#%RAML 0.8', '---', 'title: My API'].join('\n')
        },
        'title: My API'
      ).should.be.false;
    });

    it('should return true for files with ".raml" extension  and proper version tag as the very first line', function () {
      getIsFileParsable(
        {
          name:      'myApi.raml',
          extension: 'raml',
          contents:  ['#%RAML 0.8', '---', 'title: My API'].join('\n')
        }
      ).should.be.true;
    });

    it.skip('should use passed RAML source (valid) instead of provided by file model and return true', function () {
      getIsFileParsable(
        {
          name:      'myApi.raml',
          extension: 'raml',
          contents:  'title: My API'
        },
        ['#%RAML 0.8', '---', 'title: My API'].join('\n')
      ).should.be.true;
    });

    it('should return true for version tag ending with whitespaces', function () {
      getIsFileParsable(
        {
          name:      'myApi.raml',
          extension: 'raml',
          contents:  ['#%RAML 0.8 ', '---', 'title: My API'].join('\n')
        }
      ).should.be.true;
    });

    describe('with root file', function () {
      beforeEach(function () {
        scope.fileBrowser = {
          rootFile: {
            name:      'root.raml',
            extension: 'raml',
            contents:  ['#%RAML 0.8', '---', 'title: My API'].join('\n')
          }
        };
      });

      describe('as selected file', function () {
        beforeEach(function () {
          scope.fileBrowser.selectedFile = scope.fileBrowser.rootFile;
        });

        it('should return true', function () {
          getIsFileParsable(scope.fileBrowser.selectedFile).should.be.true;
        });
      });

      describe('not being selected', function () {
        beforeEach(function () {
          scope.fileBrowser.selectedFile = {
            name:       'selected.raml',
            extension:  'raml',
            contents:   ['#%RAML 0.8', '---', 'title: My API'].join('\n')
          };
        });

        it.skip('should return false', function () {
          getIsFileParsable(scope.fileBrowser.selectedFile).should.be.false;
        });
      });
    });

    describe('typed fragments are parsable', function () {
      beforeEach(function () {
        scope.fileBrowser = {
          rootFile: {
            name:      'root.raml',
            extension: 'raml',
            contents:  ['#%RAML 1.0', '---', 'title: My API'].join('\n')
          },
          libraryFile: {
            name:      'library.raml',
            extension: 'raml',
            contents:  ['#%RAML 1.0 Library', '---', 'title: My API'].join('\n')
          },
          overlayFile: {
            name:      'overlay.raml',
            extension: 'raml',
            contents:  ['#%RAML 1.0 Overlay', '---', 'title: My API'].join('\n')
          },
          extensionFile: {
            name:      'extension.raml',
            extension: 'raml',
            contents:  ['#%RAML 1.0 Extension', '---', 'title: My API'].join('\n')
          },
          traitFile: {
            name:      'trait.raml',
            extension: 'raml',
            contents:  ['#%RAML 1.0 Trait', '---', 'title: My API'].join('\n')
          },
          resourceTypeFile: {
            name:      'resourceType.raml',
            extension: 'raml',
            contents:  ['#%RAML 1.0 ResourceType', '---', 'title: My API'].join('\n')
          }
        };
      });

      describe('root file is parsable', function () {
        it('should return true', function () {
          getIsFileParsable(scope.fileBrowser.rootFile).should.be.true;
        });
      });

      describe('library file is parsable', function () {
        it('should return true', function () {
          getIsFileParsable(scope.fileBrowser.libraryFile).should.be.true;
        });
      });

      describe('overlay file is parsable', function () {
        it('should return true', function () {
          getIsFileParsable(scope.fileBrowser.overlayFile).should.be.true;
        });
      });

      describe('extension file is parsable', function () {
        it('should return true', function () {
          getIsFileParsable(scope.fileBrowser.extensionFile).should.be.true;
        });
      });

      describe('trait file is parsable', function () {
        it('should return true', function () {
          getIsFileParsable(scope.fileBrowser.traitFile).should.be.true;
        });
      });

      describe('resourceType file is parsable', function () {
        it('should return true', function () {
          getIsFileParsable(scope.fileBrowser.resourceTypeFile).should.be.true;
        });
      });
    });
  });

  describe('getIsMockingServiceVisible', function () {
    var getIsMockingServiceVisible;

    beforeEach(function () {
      $controller('ramlEditorMain', params);
      getIsMockingServiceVisible = scope.getIsMockingServiceVisible;
    });

    it('should return false when mocking service is disabled', function () {
      scope.mockingServiceDisabled = true;
      getIsMockingServiceVisible().should.be.false;
    });

    it('should return false when mocking service is not disabled and file is NOT parsable', function () {
      scope.fileParsable = false;
      getIsMockingServiceVisible().should.be.false;
    });

    it('should return true when mocking service is not disabled and file is parsable', function () {
      scope.fileParsable = true;
      getIsMockingServiceVisible().should.be.true;
    });
  });

  describe('getIsShelfVisible', function () {
    var getIsShelfVisible;

    beforeEach(function () {
      $controller('ramlEditorMain', params);
      getIsShelfVisible = scope.getIsShelfVisible;
    });

    it('should return true when file is parsable', function () {
      scope.fileParsable = true;
      getIsShelfVisible().should.be.true;
    });

    it('should return false when file is NOT parsable', function () {
      scope.fileParsable = false;
      getIsShelfVisible().should.be.false;
    });
  });

  describe('getIsConsoleVisible', function () {
    var getIsConsoleVisible;

    beforeEach(function () {
      $controller('ramlEditorMain', params);
      getIsConsoleVisible = scope.getIsConsoleVisible;
    });

    it('should return true when file is parsable', function () {
      scope.fileParsable = true;
      scope.raml = {};
      getIsConsoleVisible().should.be.ok;
    });

    it('should return false when file is NOT parsable', function () {
      scope.fileParsable = false;
      getIsConsoleVisible().should.be.false;
    });
  });
});

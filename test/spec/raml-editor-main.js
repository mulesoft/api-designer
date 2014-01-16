'use strict';

var codeMirror, eventService, codeMirrorErrors,
  $rootScope, $controller, $q, applySuggestion;

describe('RAML Editor Main Controller', function () {
  var params, ctrl, scope, annotationsToDisplay, editor, $timeout, $confirm, $window, ramlRepository;

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $q = $injector.get('$q');
    $timeout = $injector.get('$timeout');
    $confirm = $injector.get('$confirm');
    $window = $injector.get('$window');
    codeMirror = $injector.get('codeMirror');
    eventService = $injector.get('eventService');
    applySuggestion = $injector.get('applySuggestion');
    ramlRepository = $injector.get('ramlRepository');
  }));

  beforeEach(function () {
    scope = $rootScope.$new();

    editor = getEditor(codeMirror);

    codeMirror.initEditor = function (){
      return editor;
    };

    codeMirrorErrors = {
      displayAnnotations: function displayAnnotations(annotations) {
        annotationsToDisplay = annotations;
      },

      clearAnnotations: function clearAnnotations() {

      }
    };

    params = {
      $scope: scope,
      codeMirror: codeMirror,
      codeMirrorErrors: codeMirrorErrors,
      eventService: eventService,
      $confirm: $confirm,
      fileList: {}
    };
  });

  describe('leaving the page', function() {
    it('should ask user for confirmation if there are unsaved changes', function () {
      params.fileList = {
        files: [
          { dirty: false },
          { dirty: true },
          { dirty: false }
        ]
      };
      ctrl = $controller('ramlEditorMain', params);

      $window.onbeforeunload().should.equal('WARNING: You have unsaved changes. Those will be lost if you leave this page.');
    });

    it('should not ask user for confirmation if there are no unsaved changes', function () {
      params.fileList = {
        files: [
          { dirty: false },
          { dirty: false },
          { dirty: false }
        ]
      };
      ctrl = $controller('ramlEditorMain', params);

      should.not.exist($window.onbeforeunload());
    });
  });

  describe('on raml parser error', function () {
    it('should display errors on first line if no line specified', function () {
      // Arrange
      ctrl = $controller('ramlEditorMain', params);
      var error = {
        message: 'Error without line or column!'
      };
      scope.hasErrors.should.be.false;

      // Act
      eventService.broadcast('event:raml-parser-error', error);

      // Assert
      annotationsToDisplay.length.should.be.equal(1);
      annotationsToDisplay[0].line.should.be.equal(1);
      annotationsToDisplay[0].column.should.be.equal(1);
      annotationsToDisplay[0].message.should.be.equal(error.message);
      scope.hasErrors.should.be.true;
    });
  });

  describe('on event:raml-editor-file-selected', function () {
    it('loads the new file in the editor', function () {
      scope.fileBrowser = {};
      ctrl = $controller('ramlEditorMain', params);

      editor.getValue().should.be.equal('');

      scope.$emit('event:raml-editor-file-selected', { name: 'api.raml', path: '/', contents: 'file1' });
      scope.$digest();

      editor.getValue().should.be.equal('file1');
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

  describe('parsing RAML definition', function () {
    it('should use ramlParserFileReader to load included local files using ramlRepository', function (done) {
      //
      $controller('ramlEditorMain', params);

      // arrange
      var loadFileDeferred = $q.defer();
      var loadFileStub     = sinon.stub(ramlRepository, 'loadFile', function (file) {
        // assert
        file.path.should.be.equal('/');
        file.name.should.be.equal('title.raml');

        // restore
        loadFileStub.restore();

        // done
        done();

        // return something to manage unhandled exception
        return loadFileDeferred.promise;
      });

      // act
      scope.loadRaml([
        '#%RAML 0.8',
        '---',
        'title: !include title.raml'
      ].join('\n'));
    });

    it('should use ramlParserFileReader to load included external files using $http service', function (done) {
      inject(function ($http) {
        //
        $controller('ramlEditorMain', params);

        // arrange
        var httpGetStub = sinon.stub($http, 'get', function (url) {
          // assert
          url.should.be.equal('http://api.com/title.raml');

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

    it('should return false for files without ".raml" extenstion', function () {
      getIsFileParsable(
        {
          name: 'myApi.json'
        }
      ).should.be.false;
    });

    it('should return false for files without proper version tag as the very first line', function () {
      getIsFileParsable(
        {
          name:     'myApi.raml',
          contents: 'title: My API'
        }
      ).should.be.false;
    });

    it('should use passed RAML source (invalid) instead of provided by file model and return false', function () {
      getIsFileParsable(
        {
          name:     'myApi.raml',
          contents: ['#%RAML 0.8', '---', 'title: My API'].join('\n')
        },
        'title: My API'
      ).should.be.false;
    });

    it('should return true for files with ".raml" extenstion and proper version tag as the very first line', function () {
      getIsFileParsable(
        {
          name:     'myApi.raml',
          contents: ['#%RAML 0.8', '---', 'title: My API'].join('\n')
        }
      ).should.be.true;
    });

    it('should use passed RAML source (valid) instead of provided by file model and return true', function () {
      getIsFileParsable(
        {
          name:     'myApi.raml',
          contents: 'title: My API'
        },
        ['#%RAML 0.8', '---', 'title: My API'].join('\n')
      ).should.be.true;
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
      getIsConsoleVisible().should.be.true;
    });

    it('should return false when file is NOT parsable', function () {
      scope.fileParsable = false;
      getIsConsoleVisible().should.be.false;
    });
  });
});

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
      $confirm: $confirm
    };
  });

  it('should disable console when document is empty', function () {
    $controller('ramlEditorMain', params);

    var sourceUpdatedSpy = sinon.spy(scope, 'sourceUpdated');
    scope.editor.setValue('');

    scope.$apply();
    $timeout.flush();
    scope.$apply();

    sourceUpdatedSpy.called.should.be.true;
    scope.hasErrors.should.be.false;

    sourceUpdatedSpy.restore();
  });

  it('should disable console when parser has errors', function (done) {
    $controller('ramlEditorMain', params);

    var sourceUpdatedSpy = sinon.spy(scope, 'sourceUpdated');
    scope.editor.setValue('#%RAML 0.8');

    scope.$apply();
    $timeout.flush();

    setTimeout(function () {
      sourceUpdatedSpy.called.should.be.true;

      scope.hasErrors.should.be.true;

      sourceUpdatedSpy.restore();

      done();
    });
  });

  it('should enable console when everything is good', function (done) {
    $controller('ramlEditorMain', params);

    var sourceUpdatedSpy = sinon.spy(scope, 'sourceUpdated');
    scope.editor.setValue([
      '#%RAML 0.8',
      'title: Title'
    ].join('\n'));

    scope.$apply();
    $timeout.flush();

    setTimeout(function () {
      sourceUpdatedSpy.called.should.be.true;

      scope.hasErrors.should.be.false;

      sourceUpdatedSpy.restore();

      done();
    });
  });

  it('should ask user for confirmation if there are unsaved changes', function () {
    ctrl = $controller('ramlEditorMain', params);
    var canSaveStub = sinon.stub(scope, 'canSave').returns(true);

    $window.onbeforeunload().should.be.equal('WARNING: You have unsaved changes. Those will be lost if you leave this page.');

    canSaveStub.restore();
  });

  it('should not ask user for confirmation if there are no unsaved changes', function () {
    ctrl = $controller('ramlEditorMain', params);
    var canSaveStub = sinon.stub(scope, 'canSave').returns(false);

    should.not.exist($window.onbeforeunload());

    canSaveStub.restore();
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

  describe('controller actions', function (){
    it('should create a new RAML file if the current document is saved', function(){
      // arrange
      ctrl = $controller('ramlEditorMain', params);

      var file = {
        contents: 'NEW RAML FILE'
      };

      sinon.stub(scope, 'canSave').returns(false);
      sinon.stub(ramlRepository, 'createFile').returns(file);
      sinon.stub(editor, 'setValue');
      sinon.stub(editor, 'setCursor');

      // act
      scope.newFile();

      // assert
      scope.canSave.calledOnce.should.be.true;
      ramlRepository.createFile.calledOnce.should.be.true;
      editor.setValue.calledOnce.should.be.true;
      editor.setCursor.calledOnce.should.be.true;

      scope.file.should.deep.equal(file);

      // restore
      scope.canSave.restore();
      ramlRepository.createFile.restore();
      editor.setValue.restore();
      editor.setCursor.restore();
    });

    it('should create a new RAML file if the current document is not saved and the prompt is successful', function(){
      // arrange
      sinon.stub(params, '$confirm').returns(true);
      ctrl = $controller('ramlEditorMain', params);

      var file = {
        contents: 'NEW RAML FILE'
      };

      sinon.stub(scope, 'canSave').returns(true);
      sinon.stub(ramlRepository, 'createFile').returns(file);
      sinon.stub(editor, 'setValue');
      sinon.stub(editor, 'setCursor');

      // act
      scope.newFile();

      // assert
      scope.canSave.calledTwice.should.be.true;
      ramlRepository.createFile.calledOnce.should.be.true;
      editor.setValue.calledOnce.should.be.true;
      editor.setCursor.calledOnce.should.be.true;
      params.$confirm.calledOnce.should.be.true;
      editor.setValue.calledWith(file.contents).should.be.true;
      scope.file.should.deep.equal(file);

      // restore
      scope.canSave.restore();
      ramlRepository.createFile.restore();
      editor.setValue.restore();
      editor.setCursor.restore();
      params.$confirm.restore();
    });

    it('should not create a new RAML file if the current document is not saved and the prompt fails', function(){
      // arrange
      sinon.stub(params, '$confirm').returns(false);
      ctrl = $controller('ramlEditorMain', params);

      var file = {
        contents: 'NEW RAML FILE'
      };

      sinon.stub(scope, 'canSave').returns(true);
      sinon.stub(ramlRepository, 'createFile').returns(file);
      sinon.stub(editor, 'setValue');
      sinon.stub(editor, 'setCursor');

      // act
      scope.newFile();

      // assert
      scope.canSave.calledTwice.should.be.true;
      ramlRepository.createFile.called.should.not.be.true;
      params.$confirm.calledOnce.should.be.true;

      // restore
      scope.canSave.restore();
      ramlRepository.createFile.restore();
      editor.setValue.restore();
      editor.setCursor.restore();
      params.$confirm.restore();
    });
  });

  describe('saving files', function () {
    describe('save', function () {
      it('should be enabled only if file is dirty', function() {
        ctrl = $controller('ramlEditorMain', params);

        scope.file = {
          dirty: true
        };

        scope.canSave().should.be.true;

        scope.file.dirty = false;
        scope.canSave().should.not.be.true;
      });

      it('should abort if the file can\'t be saved', function(){
        ctrl = $controller('ramlEditorMain', params);

        sinon.stub(scope, 'canSave').returns(false);
        sinon.stub(scope, 'saveFile');

        scope.save();

        scope.canSave.calledOnce.should.be.true;
        scope.saveFile.calledOnce.should.not.be.true;

        scope.canSave.restore();
        scope.saveFile.restore();
      });

      it('should abort if no file name is provided', function () {
        ctrl = $controller('ramlEditorMain', params);

        scope.file = {
          dirty: true
        };

        sinon.stub(scope, '_promptForFileName');
        sinon.stub(scope, 'saveFile');

        scope.save();

        scope._promptForFileName.called.should.be.true;
        scope.saveFile.calledOnce.should.not.be.true;

        scope._promptForFileName.restore();
        scope.saveFile.restore();
      });

      it('should ask for a file name if the file is new has never been saved', function () {
        ctrl = $controller('ramlEditorMain', params);

        sinon.stub(scope, 'canSave').returns(true);
        sinon.stub(scope, '_promptForFileName').returns('api.raml');
        sinon.stub(scope, 'saveFile');

        scope.file = {
          persisted: false
        };

        scope.save();

        scope.canSave.calledOnce.should.be.true;
        scope._promptForFileName.called.should.be.true;
        scope.saveFile.called.should.be.true;

        scope.canSave.restore();
        scope._promptForFileName.restore();
        scope.saveFile.restore();
      });

      it('should not ask for a file name if the file comes from the persistence store', function () {
        ctrl = $controller('ramlEditorMain', params);

        sinon.stub(scope, 'canSave').returns(true);
        sinon.stub(scope, '_promptForFileName');
        sinon.stub(scope, 'saveFile');

        scope.file = {
          persisted: true
        };

        scope.save();

        scope.canSave.calledOnce.should.be.true;
        scope._promptForFileName.called.should.not.be.true;
        scope.saveFile.called.should.be.true;

        scope.canSave.restore();
        scope._promptForFileName.restore();
        scope.saveFile.restore();
      });
    });

    describe('save as', function () {
      it('should be enabled only if the file has been saved or loaded from the persistence store', function (){
        // arrange
        ctrl = $controller('ramlEditorMain', params);

        scope.file = {
          persisted: true
        };

        // act & assert
        scope.canSaveAs().should.be.true;

        scope.file.persisted = false;
        scope.canSaveAs().should.not.be.true;
      });

      it('should abort if the file is new', function() {
        ctrl = $controller('ramlEditorMain', params);

        scope.file = {
          persisted: false
        };

        sinon.stub(scope, '_promptForFileName');

        scope.saveAs();

        scope._promptForFileName.called.should.not.be.true;
        scope._promptForFileName.restore();
      });

      it('should abort if no file name is provided', function () {
        ctrl = $controller('ramlEditorMain', params);

        scope.file = {
          persisted: true
        };

        sinon.stub(scope, '_promptForFileName');
        sinon.stub(scope, 'saveFile');

        scope.saveAs();

        scope._promptForFileName.called.should.be.true;
        scope.saveFile.calledOnce.should.not.be.true;

        scope._promptForFileName.restore();
        scope.saveFile.restore();
      });

      it('save as should ask for a file name and call save file', function () {
        ctrl = $controller('ramlEditorMain', params);

        scope.file = {
          persisted: true
        };

        sinon.stub(scope, '_promptForFileName').returns('api.raml');
        sinon.stub(scope, 'saveFile');

        scope.saveAs();

        scope._promptForFileName.calledOnce.should.be.true;
        scope.saveFile.calledOnce.should.be.true;

        scope.saveFile.calledAfter(scope._promptForFileName).should.be.true;

        scope._promptForFileName.restore();
        scope.saveFile.restore();
      });
    });
  });

  describe('file browser actions', function () {
    var file1 = { name: 'api.raml', path: '/', contents: 'file1' };
    var file2 = { name: 'traits.raml', path: '/', contents: 'file2' };

    it('should expand the file browser', function () {
      // arrange
      ctrl = $controller('ramlEditorMain', params);

      // act
      scope.toggleBrowser();

      // assert
      scope.browser.expanded.should.be.true;
    });

    it('opening the file browser should trigger a file listing retrieval', function () {
      // arrange
      var fileList = [ file1, file2 ];
      var getDirectoryDeferred = $q.defer();
      var getDirectoryStub = sinon.stub(ramlRepository, 'getDirectory').returns(getDirectoryDeferred.promise);

      ctrl = $controller('ramlEditorMain', params);

      // act
      scope.toggleBrowser();

      getDirectoryDeferred.resolve(fileList);
      $rootScope.$apply();

      // assert
      scope.browser.expanded.should.be.true;
      getDirectoryStub.should.have.been.calledOnce;
      scope.files.should.deep.equal(fileList);

      // restore
      getDirectoryStub.restore();
    });

    it('collapseBrowser() should close the browser if it is open', function () {
      ctrl = $controller('ramlEditorMain', params);

      scope.browser.expanded.should.be.false;

      scope.toggleBrowser();
      scope.browser.expanded.should.be.true;

      scope.collapseBrowser();
      scope.browser.expanded.should.be.false;
    });

    it('selecting a file from the browser should open it in the code editor', function () {
      // arrange
      var loadFileDeferred = $q.defer();
      var loadFileStub = sinon.stub(ramlRepository, 'loadFile').returns(loadFileDeferred.promise);
      var setValueSpy = sinon.spy(editor, 'setValue');

      ctrl = $controller('ramlEditorMain', params);

      // act
      scope.loadFile(file1);

      loadFileDeferred.resolve(file1);
      $rootScope.$apply();

      // assert
      scope.file.should.deep.equal(file1);
      loadFileStub.should.have.been.calledOnce;
      editor.setValue.calledWith(file1.contents).should.be.true;

      // restore
      loadFileStub.restore();
      setValueSpy.restore();
    });

    it('switching a file from the browser should not open it in the code editor if the document is unsaved and confirmation fails', function () {
      // arrange
      sinon.stub(params, '$confirm').returns(false);
      ctrl = $controller('ramlEditorMain', params);
      sinon.stub(scope, 'canSave').returns(true);
      sinon.stub(ramlRepository, 'loadFile').returns(file1).yields(file1);
      sinon.spy(editor, 'setValue');

      // act
      scope.switchFile(file1);

      // assert
      scope.canSave.calledTwice.should.be.true;
      params.$confirm.calledOnce.should.be.true;
      ramlRepository.loadFile.called.should.not.be.true;

      // restore
      ramlRepository.loadFile.restore();
      editor.setValue.restore();
      params.$confirm.restore();
    });

    it('switching a file from the browser should open it in the code editor if the document is unsaved and confirmation confirms it', function () {
      // arrange
      sinon.stub(params, '$confirm').returns(true);
      ctrl = $controller('ramlEditorMain', params);
      sinon.stub(scope, 'canSave').returns(true);
      sinon.stub(ramlRepository, 'loadFile').returns(file1).yields(file1);
      sinon.spy(editor, 'setValue');
      sinon.spy(editor, 'setCursor');
      sinon.spy(editor, 'focus');

      // act
      scope.switchFile(file1);

      // assert
      scope.canSave.calledTwice.should.be.true;
      editor.setValue.calledWith(file1.contents).should.be.true;
      editor.setCursor.calledWith({line: 0, ch: 0}).should.be.true;
      editor.focus.calledOnce.should.be.true;
      params.$confirm.calledOnce.should.be.true;

      // restore
      ramlRepository.loadFile.restore();
      editor.setValue.restore();
      params.$confirm.restore();
    });
  });

  describe('deleteFile()', function () {
    var file1 = { name: 'api.raml',    path: '/', contents: 'file1' };
    var file2 = { name: 'traits.raml', path: '/', contents: 'file2' };

    it('should delete a file', function () {
      // arrange
      var $confirmStub = sinon.stub(params, '$confirm').returns(true);
      var removeFileDeferred = $q.defer();
      var removeFileStub = sinon.stub(ramlRepository, 'removeFile').returns(removeFileDeferred.promise);

      ctrl = $controller('ramlEditorMain', params);
      scope.file = file2;

      // act
      scope.deleteFile(file1);

      // assert
      removeFileStub.calledWith(file1).should.be.true;
      scope.browser.expanded.should.be.false;

      // restore
      removeFileStub.restore();
      $confirmStub.restore();
    });

    it('should not delete the file if the user cancels', function () {
      // arrange
      sinon.stub(params, '$confirm').returns(false);
      ctrl = $controller('ramlEditorMain', params);
      sinon.stub(ramlRepository, 'removeFile').yields();
      scope.file = file2;

      // act
      scope.deleteFile(file1);

      // assert
      ramlRepository.removeFile.called.should.not.be.true;
      scope.browser.expanded.should.be.false;

      // restore
      ramlRepository.removeFile.restore();
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
      eventService.broadcast('event:raml-source-updated', [
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
        eventService.broadcast('event:raml-source-updated', [
          '#%RAML 0.8',
          '---',
          'title: !include http://api.com/title.raml'
        ].join('\n'));
      });
    });
  });
});

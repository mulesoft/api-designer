'use strict';

var codeMirror, eventService, codeMirrorErrors, ramlRepository,
  $rootScope, $controller, applySuggestion;

describe('RAML Editor Main Controller', function () {
  var params, ctrl, scope, annotationsToDisplay, editor, $timeout, $confirm;

  beforeEach(module('ramlEditorApp'));

  beforeEach(
    inject( function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');
      $timeout = $injector.get('$timeout');
      codeMirror = $injector.get('codeMirror');
      eventService = $injector.get('eventService');
      $confirm = $injector.get('$confirm');
      applySuggestion = $injector.get('applySuggestion');
    })
  );

  beforeEach(function () {
    scope = $rootScope.$new();

    editor = {
      on: function () {},
      setValue: function() {},
      setCursor: function() {},
      focus: function() {}
    };

    codeMirror.initEditor = function (){
      return editor;
    };

    codeMirrorErrors = {};
    codeMirrorErrors.displayAnnotations = function (annotations) {
      annotationsToDisplay = annotations;
    };

    ramlRepository = {
      bootstrap: function () {},
      createFile: function () {},
      getDirectory: function () {},
      loadFile: function () {},
      removeFile: function () {}
    };

    params = {
      $scope: scope,
      codeMirror: codeMirror,
      codeMirrorErrors: codeMirrorErrors,
      eventService: eventService,
      ramlRepository: ramlRepository,
      $confirm: $confirm,
      afterBootstrap: function () { }
    };
  });

  describe('on raml parser error', function () {
    it('should display errors on first line if no line specified', function () {
      // Arrange
      ctrl = $controller('ramlMain', params);
      var error = {
        message: 'Error without line or column!'
      };
      scope.hasErrors.should.be.equal(false);

      // Act
      eventService.broadcast('event:raml-parser-error', error);

      // Assert
      annotationsToDisplay.should.be.ok;
      annotationsToDisplay.length.should.be.equal(1);
      annotationsToDisplay[0].line.should.be.equal(1);
      annotationsToDisplay[0].column.should.be.equal(1);
      annotationsToDisplay[0].message.should.be.equal(error.message);
      scope.hasErrors.should.be.equal(true);
    });
  });

  describe('controller actions', function (){
    it('should create a new RAML file if the current document is saved', function(){
      //arrange
      ctrl = $controller('ramlMain', params);

      var file = {
        contents: 'NEW RAML FILE'
      };

      sinon.stub(scope, 'canSave').returns(false);
      sinon.stub(ramlRepository, 'createFile').returns(file);
      sinon.stub(editor, 'setValue');
      sinon.stub(editor, 'setCursor');

      //act
      scope.newFile();

      //assert

      scope.canSave.calledOnce.should.be.ok;
      ramlRepository.createFile.calledOnce.should.be.ok;
      editor.setValue.calledOnce.should.be.ok;
      editor.setCursor.calledOnce.should.be.ok;

      scope.file.should.deep.equal(file);

      //restore
      scope.canSave.restore();
      ramlRepository.createFile.restore();
      editor.setValue.restore();
      editor.setCursor.restore();
    });

    it('should create a new RAML file if the current document is not saved and the prompt is successful', function(){
      //arrange
      sinon.stub(params, '$confirm').returns(true);
      ctrl = $controller('ramlMain', params);

      var file = {
        contents: 'NEW RAML FILE'
      };

      sinon.stub(scope, 'canSave').returns(true);
      sinon.stub(ramlRepository, 'createFile').returns(file);
      sinon.stub(editor, 'setValue');
      sinon.stub(editor, 'setCursor');

      //act
      scope.newFile();

      //assert
      scope.canSave.calledTwice.should.be.ok;
      ramlRepository.createFile.calledOnce.should.be.ok;
      editor.setValue.calledOnce.should.be.ok;
      editor.setCursor.calledOnce.should.be.ok;
      params.$confirm.calledOnce.should.be.ok;
      editor.setValue.calledWith(file.contents).should.be.ok;
      scope.file.should.deep.equal(file);

      //restore
      scope.canSave.restore();
      ramlRepository.createFile.restore();
      editor.setValue.restore();
      editor.setCursor.restore();
      params.$confirm.restore();
    });

    it('should not create a new RAML file if the current document is not saved and the prompt fails', function(){
      //arrange
      sinon.stub(params, '$confirm').returns(false);
      ctrl = $controller('ramlMain', params);

      var file = {
        contents: 'NEW RAML FILE'
      };

      sinon.stub(scope, 'canSave').returns(true);
      sinon.stub(ramlRepository, 'createFile').returns(file);
      sinon.stub(editor, 'setValue');
      sinon.stub(editor, 'setCursor');

      //act
      scope.newFile();

      //assert
      scope.canSave.calledTwice.should.be.ok;
      ramlRepository.createFile.called.should.not.be.ok;
      params.$confirm.calledOnce.should.be.ok;

      //restore
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
        ctrl = $controller('ramlMain', params);

        scope.file = {
          dirty: true
        };

        scope.canSave().should.be.ok;

        scope.file.dirty = false;
        scope.canSave().should.not.be.ok;
      });

      it('should abort if the file can\'t be saved', function(){
        ctrl = $controller('ramlMain', params);

        sinon.stub(scope, 'canSave').returns(false);
        sinon.stub(scope, '_saveFile');

        scope.save();

        scope.canSave.calledOnce.should.be.ok;
        scope._saveFile.calledOnce.should.not.be.ok;

        scope.canSave.restore();
        scope._saveFile.restore();
      });

      it('should abort if no file name is provided', function () {
        ctrl = $controller('ramlMain', params);

        scope.file = {
          dirty: true
        };

        sinon.stub(scope, '_promptForFileName');
        sinon.stub(scope, '_saveFile');

        scope.save();

        scope._promptForFileName.called.should.be.ok;
        scope._saveFile.calledOnce.should.not.be.ok;

        scope._promptForFileName.restore();
        scope._saveFile.restore();
      });

      it('should ask for a file name if the file is new has never been saved', function () {
        ctrl = $controller('ramlMain', params);

        sinon.stub(scope, 'canSave').returns(true);
        sinon.stub(scope, '_promptForFileName').returns('api.raml');
        sinon.stub(scope, '_saveFile');

        scope.file = {
          persisted: false
        };

        scope.save();

        scope.canSave.calledOnce.should.be.ok;
        scope._promptForFileName.called.should.be.ok;
        scope._saveFile.called.should.be.ok;

        scope.canSave.restore();
        scope._promptForFileName.restore();
        scope._saveFile.restore();
      });

      it('should not ask for a file name if the file comes from the persistence store', function () {
        ctrl = $controller('ramlMain', params);

        sinon.stub(scope, 'canSave').returns(true);
        sinon.stub(scope, '_promptForFileName');
        sinon.stub(scope, '_saveFile');

        scope.file = {
          persisted: true
        };

        scope.save();

        scope.canSave.calledOnce.should.be.ok;
        scope._promptForFileName.called.should.not.be.ok;
        scope._saveFile.called.should.be.ok;

        scope.canSave.restore();
        scope._promptForFileName.restore();
        scope._saveFile.restore();
      });
    });

    describe('save as', function () {
      it('should be enabled only if the file has been saved or loaded from the persistence store', function (){
        //arrange
        ctrl = $controller('ramlMain', params);

        scope.file = {
          persisted: true
        };

        //act & assert
        scope.canSaveAs().should.be.ok;

        scope.file.persisted = false;
        scope.canSaveAs().should.not.be.ok;
      });

      it('should abort if the file is new', function() {
        ctrl = $controller('ramlMain', params);

        scope.file = {
          persisted: false
        };

        sinon.stub(scope, '_promptForFileName');

        scope.saveAs();

        scope._promptForFileName.called.should.not.be.ok;
        scope._promptForFileName.restore();
      });

      it('should abort if no file name is provided', function () {
        ctrl = $controller('ramlMain', params);

        scope.file = {
          persisted: true
        };

        sinon.stub(scope, '_promptForFileName');
        sinon.stub(scope, '_saveFile');

        scope.saveAs();

        scope._promptForFileName.called.should.be.ok;
        scope._saveFile.calledOnce.should.not.be.ok;

        scope._promptForFileName.restore();
        scope._saveFile.restore();
      });

      it('save as should ask for a file name and call save file', function () {
        ctrl = $controller('ramlMain', params);

        scope.file = {
          persisted: true
        };

        sinon.stub(scope, '_promptForFileName').returns('api.raml');
        sinon.stub(scope, '_saveFile');

        scope.saveAs();

        scope._promptForFileName.calledOnce.should.be.ok;
        scope._saveFile.calledOnce.should.be.ok;

        scope._saveFile.calledAfter(scope._promptForFileName).should.be.ok;

        scope._promptForFileName.restore();
        scope._saveFile.restore();
      });
    });
  });

  describe('file browser actions', function () {
    var file1 = { name: 'api.raml', path: '/', contents: 'file1' };
    var file2 = { name: 'traits.raml', path: '/', contents: 'file2' };

    it('should expand the file browser', function () {
      //arrange
      ctrl = $controller('ramlMain', params);

      //act
      scope.toggleBrowser();

      //assert
      scope.browser.expanded.should.be.equal(true);
    });

    it('opening the file browser should trigger a file listing retrieval', function () {
      //arrange
      var fileList = [ file1, file2 ];

      fileList.loading = false;
      ctrl = $controller('ramlMain', params);
      sinon.stub(ramlRepository, 'getDirectory').returns(fileList).yields(fileList);

      //act
      scope.toggleBrowser();

      //assert
      scope.browser.expanded.should.be.equal(true);
      ramlRepository.getDirectory.should.have.been.calledOnce;
      scope.files.should.deep.equal(fileList);

      //restore
      ramlRepository.getDirectory.restore();
    });

    it('collapseBrowser() should close the browser if it is open', function () {
      //arrange
      var fileList = [ file1, file2 ];
      var previousState = false;

      fileList.loading = false;
      ctrl = $controller('ramlMain', params);
      sinon.stub(ramlRepository, 'getDirectory').returns(fileList).yields(fileList);
      scope.toggleBrowser();
      previousState = scope.browser.expanded;

      //act
      scope.collapseBrowser();

      //assert
      previousState.should.be.equal(true);
      scope.browser.expanded.should.be.equal(false);
      ramlRepository.getDirectory.should.have.been.calledOnce;
      scope.files.should.deep.equal(fileList);

      //restore
      ramlRepository.getDirectory.restore();
    });

    it('selecting a file from the browser should open it in the code editor', function () {
      //arrange
      ctrl = $controller('ramlMain', params);
      sinon.stub(ramlRepository, 'loadFile').returns(file1).yields(file1);
      sinon.spy(editor, 'setValue');

      //act
      scope.loadFile(file1);

      //assert
      scope.file.should.deep.equal(file1);
      ramlRepository.loadFile.should.have.been.calledOnce;
      editor.setValue.calledWith(file1.contents).should.be.ok;

      //restore
      ramlRepository.loadFile.restore();
      editor.setValue.restore();
    });

    it('switching a file from the browser should not open it in the code editor if the document is unsaved and confirmation fails', function () {
      //arrange
      sinon.stub(params, '$confirm').returns(false);
      ctrl = $controller('ramlMain', params);
      sinon.stub(scope, 'canSave').returns(true);
      sinon.stub(ramlRepository, 'loadFile').returns(file1).yields(file1);
      sinon.spy(editor, 'setValue');

      //act
      scope.switchFile(file1);

      //assert
      scope.canSave.calledTwice.should.be.ok;
      params.$confirm.calledOnce.should.be.ok;
      ramlRepository.loadFile.called.should.not.be.ok;

      //restore
      ramlRepository.loadFile.restore();
      editor.setValue.restore();
      params.$confirm.restore();
    });

    it('switching a file from the browser should open it in the code editor if the document is unsaved and confirmation confirms it', function () {
      //arrange
      sinon.stub(params, '$confirm').returns(true);
      ctrl = $controller('ramlMain', params);
      sinon.stub(scope, 'canSave').returns(true);
      sinon.stub(ramlRepository, 'loadFile').returns(file1).yields(file1);
      sinon.spy(editor, 'setValue');
      sinon.spy(editor, 'setCursor');
      sinon.spy(editor, 'focus');

      //act
      scope.switchFile(file1);

      //assert
      scope.canSave.calledTwice.should.be.ok;
      editor.setValue.calledWith(file1.contents).should.be.ok;
      editor.setCursor.calledWith({line: 0, ch: 0}).should.be.ok;
      editor.focus.calledOnce.should.be.ok;
      params.$confirm.calledOnce.should.be.ok;

      //restore
      ramlRepository.loadFile.restore();
      editor.setValue.restore();
      params.$confirm.restore();

    });

  });

  describe('deleting files', function () {
    var file1 = { name: 'api.raml', path: '/', contents: 'file1' };
    var file2 = { name: 'traits.raml', path: '/', contents: 'file2' };

    it('should be able to delete a file', function () {
      //arrange
      sinon.stub(params, '$confirm').returns(true);
      ctrl = $controller('ramlMain', params);
      sinon.stub(ramlRepository, 'removeFile').yields();
      scope.file = file2;

      //act
      scope.deleteFile(file1);

      //assert
      ramlRepository.removeFile.calledWith(file1).should.be.ok;
      scope.browser.expanded.should.be.equal(false);

      //restore
      ramlRepository.removeFile.restore();
    });

    it('should be re-bootstrap the editor if the deleted file is open', function () {
      //arrange
      sinon.stub(params, '$confirm').returns(true);
      ctrl = $controller('ramlMain', params);
      sinon.stub(ramlRepository, 'removeFile').yields();
      sinon.stub(scope, 'bootstrap');
      scope.file = file1;

      //act
      scope.deleteFile(file1);

      //assert
      ramlRepository.removeFile.calledWith(file1).should.be.ok;
      scope.bootstrap.calledOnce.should.be.ok;

      //restore
      ramlRepository.removeFile.restore();
      scope.bootstrap.restore();
    });

    it('should not delete the file if the user cancels', function () {
      //arrange
      sinon.stub(params, '$confirm').returns(false);
      ctrl = $controller('ramlMain', params);
      sinon.stub(ramlRepository, 'removeFile').yields();
      scope.file = file2;

      //act
      scope.deleteFile(file1);

      //assert
      ramlRepository.removeFile.called.should.not.be.ok;
      scope.browser.expanded.should.be.equal(false);

      //restore
      ramlRepository.removeFile.restore();
    });
  });

});

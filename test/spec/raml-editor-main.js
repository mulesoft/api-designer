'use strict';

var codeMirror, eventService, codeMirrorErrors, ramlRepository,
  $rootScope, $controller;


describe('RAML Editor Main Controller', function () {
  var params, ctrl, scope, annotationsToDisplay, editor, $timeout;

  beforeEach(module('ramlEditorApp'));

  beforeEach(
    inject( function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');
      $timeout = $injector.get('$timeout');
      codeMirror = $injector.get('codeMirror');
      eventService = $injector.get('eventService');
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
      loadFile: function () {}
    };

    params = {
      $scope: scope,
      codeMirror: codeMirror,
      codeMirrorErrors: codeMirrorErrors,
      eventService: eventService,
      ramlRepository: ramlRepository,
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
      scope.canSave.should.have.been.calledOnce;
      ramlRepository.createFile.should.have.been.calledOnce;
      editor.setValue.should.have.been.calledOnce;
      editor.setCursor.should.have.been.calledOnce;

      scope.file.should.deep.equal(file);

      //restore
      scope.canSave.restore();
      ramlRepository.createFile.restore();
      editor.setValue.restore();
      editor.setCursor.restore();
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
  });

});

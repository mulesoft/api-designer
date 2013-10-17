'use strict';

var codeMirror, eventService, codeMirrorErrors, ramlRepository,
  $rootScope, $controller;


describe('RAML Editor Main Controller', function () {
  var params, ctrl, scope, annotationsToDisplay, editor;

  beforeEach(module('ramlEditorApp'));

  beforeEach(
    inject( function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');
      codeMirror = $injector.get('codeMirror');
      eventService = $injector.get('eventService');
    })
  );

  beforeEach(function () {
    scope = $rootScope.$new();

    editor = {
      on: function () {},
      setValue: function() {},
      setCursor: function(){}
    }

    codeMirror.initEditor = function (){
      return editor;
    };

    codeMirrorErrors = {};
    codeMirrorErrors.displayAnnotations = function (annotations) {
      annotationsToDisplay = annotations;
    };

    ramlRepository = {
      bootstrap: function () {},
      createFile: function(){}
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
    it('should display errors on first line if no line specified', function (done) {
      // Arrange
      params.afterBootstrap = function () {
        done();
      };
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
    it('should create a new RAML file if the current document is saved', function(done){
      //arrange
      params.afterBootstrap = function(){
        done();
      }
      ctrl = $controller('ramlMain', params);

      var file = {
        contents: 'NEW RAML FILE'
      }

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

  describe('Save As', function () {
    it('should be enabled only if file has been saved', function (done){
      //arrange
      params.afterBootstrap = function() {
        done();
      }
    })
  });

});

'use strict';

var codeMirror, eventService, codeMirrorErrors, ramlRepository,
  $rootScope, $controller;


describe('RAML Editor Main Controller', function () {
  beforeEach(angular.mock.module('ramlEditorApp'));

  beforeEach(
    angular.mock.inject( function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');
      codeMirror = $injector.get('codeMirror');
      eventService = $injector.get('eventService');
    })
  );

  describe('on raml parser error', function () {
    var params, ctrl, scope, annotationsToDisplay;

    beforeEach(function () {
      scope = $rootScope.$new();
      codeMirror.initEditor = function () {
        return {
          on: function () {}
        };
      };

      codeMirrorErrors = {};
      codeMirrorErrors.displayAnnotations = function (annotations) {
        annotationsToDisplay = annotations;
      };

      ramlRepository = { bootstrap: function () {} };

      params = {
        $scope: scope,
        codeMirror: codeMirror,
        codeMirrorErrors: codeMirrorErrors,
        eventService: eventService,
        ramlRepository: ramlRepository,
        afterBootstrap: function () { }
      };

    });
    
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

});

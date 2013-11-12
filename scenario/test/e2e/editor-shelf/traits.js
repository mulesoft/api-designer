'use strict';
var expect = require('expect.js');
var ramlUrl = require('../../config').url;
describe('shelf',function(){

  beforeEach(function () {
    browser.get(ramlUrl);
    browser.executeScript(function () {
      localStorage['config.updateResponsivenessInterval'] = 1;
      window.onbeforeunload = null;
    });
    browser.wait(function(){
      return editorGetLine(2).then(function(text) {
        return text === 'title:';
      });
    });
  });

//  var namedParameters = ['baseUriParameters', 'headers', 'queryParameters']; // baseUriParameters is missing example option on the shelf.  
  var namedParameters = [ 'headers', 'queryParameters'];
  describe('traits elements',function(){

    it('check elements at trait level', function (){
//      browser.executeScript('location.reload()');
      var definition = [
        '#%RAML 0.8',
        'title: The API',
        'traits: ',
        '  - trait1: ',
        '         '
      ].join('\\n');
      editorSetValue(definition);
      editorSetCursor(5,7);
      shelfElemTraitsByGroupAssertion();
    });

    describe('Named Parameters', function(){

      it('displayed on the shelf', function(){
        namedParameters.forEach(function(namedParameter){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'traits: ',
            '  - trait1: ',
            '      '+namedParameter+': ',
            '        hola: ',
            '              '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,10);
          shelfElemNamedParametersByGroupAssertion();
        });
      });

      describe('Not displayed after select', function(){

        it('displayName is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          displayName:',
              '            '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['displayName'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('description is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          description:',
              '              '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['description'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('example is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          example:',
              '             '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['example'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('type is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          type:',
              '             '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['type'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('enum is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          enum:',
              '             '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['enum'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('pattern is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          pattern:',
              '              '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['pattern'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('minLength is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          minLength:',
              '              '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['minLength'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('maxLength is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          maxLength:',
              '             '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['maxLength'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('maximum is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          maximum:',
              '            '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['maximum'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('minimum is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          minimum:',
              '             '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['minimum'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('required is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          required:',
              '             '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['required'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('default is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          default:',
              '              '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,10);
            var list2 =['default'];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

      }); // Not displayed after being selected

    }); //NAmed Parameter  
  
    
    describe('response', function(){

      it('displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      responses: ',
          '        200: ',
          '          '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(7,10);
        shelfElemResponsesByGroupAssertion();
      });

      describe('Not displayed after select', function(){

        it('displayName is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'traits: ',
            '  - trait1: ',
            '      responses: ',
            '        200: ',
            '          description: ',
            '             '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(8,10);
          var list2 =['description'];
          var listPromise = shelfGetListOfElementsFromShelf();
          listPromise.then(function (list) {
            noShelfElementsAssertion(list, shelfGetElementsResponseLevel(),list2);
          });
        });

        it('displayName is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'traits: ',
            '  - trait1: ',
            '      responses: ',
            '        200: ',
            '          body: ',
            '             '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(8,10);
          var list2 =['body'];
          var listPromise = shelfGetListOfElementsFromShelf();
          listPromise.then(function (list) {
            noShelfElementsAssertion(list, shelfGetElementsResponseLevel(),list2);
          });
        });

      }); // Not displayed after select

    }); //response

    describe('body', function(){

    }); //body

    describe('Not displayed after select', function(){

      it('property is no longer displayed on the shelf', function(){
        var options = shelfGetElementsTraitsLevel();
        options.forEach(function(option){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'traits: ',
            '  - trait1: ',
            '      '+option+': ',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(6,7);
          var list2 =[option];
          var listPromise = shelfGetListOfElementsFromShelf();
          listPromise.then(function (list) {
            noShelfElementsAssertion(list, shelfGetElementsTraitsLevel(),list2);
          });
        });
      });

    });// Don't displayed after select

  });//traits elements
}); // shelf

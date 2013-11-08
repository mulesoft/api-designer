'use strict';
var expect = require('expect.js');
var ramlUrl = require('../../config').url;
describe('shelf',function(){

  beforeEach(function () {
    browser.get(ramlUrl);
    browser.executeScript(function () {
      localStorage['config.updateResponsivenessInterval'] = 1;
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
//          console.log(namedParameter);
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
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['displayName'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('description is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['description'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('example is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
//              console.log(list.length);
              var list2 =['example'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('type is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['type'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('enum is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['enum'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('pattern is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['pattern'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('minLength is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['minLength'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('maxLength is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['maxLength'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('maximum is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['maximum'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('minimum is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['minimum'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('required is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['required'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

        it('default is no longer displayed on the shelf', function(){
          namedParameters.forEach(function(namedParameter){
//            console.log(namedParameter);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['default'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['description'];
              return noShelfElementsAssertion(list,shelfGetElementsResponseLevel(),list2);
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
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['body'];
              return noShelfElementsAssertion(list,shelfGetElementsResponseLevel(),list2);
            });
          });

        }); // Not displayed after select




        }); //response

    describe('body', function(){

    }); //body



   describe('Not displayed after select', function(){

      it('protocols is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      protocols: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(6,7);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['protocols'];
          return noShelfElementsAssertion(list,shelfGetElementsTraitsLevel(),list2);
        });
      });

      it('displayName is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      displayName: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(6,7);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['displayName'];
          return noShelfElementsAssertion(list,shelfGetElementsTraitsLevel(),list2);
        });
      });

      it('description is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      description: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(6,7);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['description'];
          return noShelfElementsAssertion(list,shelfGetElementsTraitsLevel(),list2);
        });
      });

      it('baseUriParameters is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      baseUriParameters: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(6,7);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['baseUriParameters'];
          return noShelfElementsAssertion(list,shelfGetElementsTraitsLevel(),list2);
        });
      });


      it('headers is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      headers: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(6,7);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['headers'];
          return noShelfElementsAssertion(list,shelfGetElementsTraitsLevel(),list2);
        });
      });

      it('queryParameters is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      queryParameters: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(6,7);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['queryParameters'];
          return noShelfElementsAssertion(list,shelfGetElementsTraitsLevel(),list2);
        });
      });

      it('responses is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      responses: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(6,7);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['responses'];
          return noShelfElementsAssertion(list,shelfGetElementsTraitsLevel(),list2);
        });
      });

      it('securedBy is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      securedBy: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(6,7);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['securedBy'];
          return noShelfElementsAssertion(list,shelfGetElementsTraitsLevel(),list2);
        });
      });

      it('body is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      body: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(6,7);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['body'];
          return noShelfElementsAssertion(list,shelfGetElementsTraitsLevel(),list2);
        });
      });

    });// Don't displayed after select

  });//traits elements
}); // shelf

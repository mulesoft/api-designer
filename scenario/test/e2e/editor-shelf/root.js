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

  describe('root elements',function(){

    describe('RAML version', function(){

      it('should offer RAML version on line 1', function(){
        var definition = '';
        editorSetValue(definition);
        shelfGetElementsFromShelf().then(function(list){
          expect(list.length).to.eql(1);
          list[0].getText().then(function(text){
            expect(text).to.eql('#%RAML 0.8');
          });
        });
      });

      xit('should not be offer RAML version - line 1 - fail RT-363', function(){
        var definition = '#%RAML 0.8';
        editorSetValue(definition);
        shelfGetElementsFromShelf().then(function(list){
          expect(list.length).to.eql(0);
        });
      });

    }); //RAML version

    describe('root section', function(){

      it('root section by group', function(){
        var definition = [
          '#%RAML 0.8',
          '      '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(2,1);
        shelfElementsRootByGroupAssertion();
      });

      xdescribe('documentation', function(){

      }); //description

      xdescribe('baseUriParameters - NamedParameter', function(){ // Failed due to https://www.pivotaltracker.com/story/show/60351064

        it('baseUriParameters - Named Parameters section by group', function(){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'baseUri: http://www.theapi.com/{hola}',
            'baseUriParameters:',
            '  hola:',
            '     '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(6,5);
          shelfElemNamedParametersByGroupAssertion();
        });

        describe('Not displayed after select', function(){

          it('displayName is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    displayName:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['displayName'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('description is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    description:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['description'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('example is no displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    example:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['example'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('type is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    type:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['type'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('enum is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    enum:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['enum'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('pattern is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    pattern:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['pattern'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('minLength is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    minLength:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['minLength'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('maxLength is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    maxLength:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['maxLength'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('maximum is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    maximum:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['maximum'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('minimum is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    minimum:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['minimum'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('required is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    required:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['required'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

          it('default is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://www.theapi.com/{hola}',
              'baseUriParameters:',
              '  hola:',
              '    default:',
              '      '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,5);
            shelfGetElementsFromShelf().then(function(list){
              var list2 =['default'];
              return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
            });
          });

        }); // Not displayed after being selected

      }); //baseUriParameters

      xdescribe('Not displayed after select', function(){

        it('title is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['title'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('varsion is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'version: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['version'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('schemas is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'schemas: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['schemas'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('baseUri is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'baseUri: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['baseUri'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('mediaType: is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'mediaType: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['mediaType'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('protocols: is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'protocols: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['protocols'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('documentation: is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'documentation: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['documentation'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('baseUriParameters: is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'baseUriParameters: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['baseUriParameters'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('securitySchemes: is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'securitySchemes: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['securitySchemes'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('securedBy: is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'securedBy: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['securedBy'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('traits: is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'traits: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['traits'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('resourceTypes: is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'resourceTypes: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['resourceTypes'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });
        //no test is added for New Resource
        // need to be automated added from the shelf and then verify the shelf status

      }); // Not displayed after select

    }); // root section
  }); // root elements

});//shelf
   

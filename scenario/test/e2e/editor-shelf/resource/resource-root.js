'use strict';
var expect = require('expect.js');
var ramlUrl = require('../../../config').url;
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

  describe('resource-root elements',function(){

    it('resource shelf elements by group', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        '/res:',
        '   '
      ].join('\\n');
      editorSetValue(definition);
      editorSetCursor(4,3);
      shelfElementsResourceByGroupAssertion();

    });

    describe('not displayed after being selected', function(){

      it('displayName is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  displayName: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['displayName'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('get is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  get: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['get'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('post is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  post: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['post'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('put is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  put: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['put'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('delete is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  delete: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['delete'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('head is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  head: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['head'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('patch is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  patch: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['patch'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('options is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  options: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['options'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('trace is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  trace: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['trace'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('connect is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  connect: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['connect'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('uriParameters is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  uriParameters: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['uriParameters'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('baseUriParameters is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  baseUriParameters: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['baseUriParameters'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('securedBy is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  securedBy: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['securedBy'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('IS is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  is: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['is'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

      it('type is no longer displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  type: ',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,3);
        shelfGetElementsFromShelf().then(function(list){
          var list2 =['type'];
          return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
        });
      });

    }); //not displayed after being selected

    xdescribe('uriParameters - Named Parameter', function(){ // https://www.pivotaltracker.com/story/show/60351064

      it('NamedParameters displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          'baseUri: http://www.theapi.com/',
          '/{hola}:',
          '  uriParameters: ',
          '    hola:',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(7,7);
        shelfElemNamedParametersByGroupAssertion();
      });

      describe('Not displayed after select', function(){

        it('displayName is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  baseUriParameters: ',
            '    hola:',
            '      displayName:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['displayName'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('description is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  baseUriParameters: ',
            '    hola:',
            '      description:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['description'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('example is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  baseUriParameters: ',
            '    hola:',
            '      example:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['example'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('type is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  baseUriParameters: ',
            '    hola:',
            '      type:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['type'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('enum is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  baseUriParameters: ',
            '    hola:',
            '      enum:',
            '       '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['enum'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('pattern is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  baseUriParameters: ',
            '    hola:',
            '      pattern:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['pattern'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('minLength is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  baseUriParameters: ',
            '    hola:',
            '      minLength:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['minLength'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('maxLength is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  baseUriParameters: ',
            '    hola:',
            '      maxLength:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['maxLength'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('maximum is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  baseUriParameters: ',
            '    hola:',
            '      maximum:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['maximum'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('minimum is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  baseUriParameters: ',
            '    hola:',
            '      minimum:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['minimum'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('required is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  uriParameters: ',
            '    hola:',
            '      required:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['required'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('default is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/',
            '/{hola}:',
            '  uriParameters: ',
            '    hola:',
            '      default:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['default'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

      }); // Not displayed after being selected

    }); //uriParameters


    xdescribe('baseUriParameters - Named Parameter' , function(){ // https://www.pivotaltracker.com/story/show/60351064

      it('Named Parameters displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          'baseUri: http://www.theapi.com/{hola}',
          '/res:',
          '  baseUriParameters: ',
          '    hola: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(7,7);
        shelfElemNamedParametersByGroupAssertion();
      });

      describe('Not displayed after select', function(){

        it('displayName is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      displayName:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['displayName'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('description is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      description:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['description'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('example is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      example:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['example'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('type is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      type:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['type'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('enum is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      enum:',
            '       '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['enum'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('pattern is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      pattern:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['pattern'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('minLength is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      minLength:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['minLength'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('maxLength is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      maxLength:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['maxLength'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('maximum is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      maximum:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['maximum'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('minimum is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      minimum:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['minimum'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('required is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      required:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['required'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

        it('default is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  baseUriParameters: ',
            '    hola:',
            '      default:',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['default'];
            return noShelfElementsAssertion(list,shelfGetElemNamedParametersLevel(),list2);
          });
        });

      }); // Not displayed after being selected

    }); //baseUriParameters

  });//resource-root elements
}); // shelf
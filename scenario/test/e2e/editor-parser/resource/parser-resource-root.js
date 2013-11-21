'use strict';
var AssertsHelper = require('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require('../../../lib/editor-helper.js').EditorHelper;
describe('parser ',function(){
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();

  describe('Resource attributes', function () {

    describe('type', function () {

      it('should fail: unused parameter param1_called from a resource', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          'resourceTypes:',
          '  - base:',
          '      get:',
          '  - collection:',
          '      type:',
          '        base:',
          '  - typedCollection:',
          '      type: collection',
          '/r1:',
          '  type: ',
          '    typedCollection:',
          '      param1:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('14','unused parameter: param1');
      });

      xit('RT-327 -should fail: invalid type name send as parameter', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: Example API',
          'baseUri: http://localhost:3000/api/',
          'resourceTypes:',
          '  - type1:',
          '      type: <<typeName>>',
          '      get:',
          '  - type2:',
          '      description: Type 2',
          '      post:',
          '  - type3:',
          '      description: Type 3',
          '      delete:',
          '/usersType1:',
          '  type: ',
          '    type1:',
          '      typeName: type2',
          '/usersType2:',
          '  type: ',
          '    type1:',
          '      typeName: type'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('22','there is no resource type named type');
      });

      xit('RT-327 -should fail: invalid type name send as parameter', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: Example API',
          'baseUri: http://localhost:3000/api/',
          'resourceTypes:',
          '  - type1:',
          '      type: <<typeName>>',
          '      is: ',
          '        - <<hol>>',
          '      get:',
          '  - type2:',
          '      description: Type 2',
          '      post:',
          '  - type3:',
          '      description: Type 3',
          '      delete:',
          '/usersType1:',
          '  type: ',
          '    type1:',
          '      typeName: type2',
          '      hol: yr',
          '/usersType2:',
          '  type: ',
          '    type1:',
          '      typeName: type3',
          '      hol: y'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('21','there is no trait named yr');
      });

      xit('RT-327 -should fail: invalid type name send as parameter', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: Example API',
          'baseUri: http://localhost:3000/api/',
          'resourceTypes:',
          '  - type1:',
          '      type: <<typeName>>',
          '      is: ',
          '        - <<hol>>',
          '      get:',
          '  - type2:',
          '      description: Type 2',
          '      post:',
          '  - type3:',
          '      description: Type 3',
          '      delete:',
          '/usersType1:',
          '  type: ',
          '    type1:',
          '      typeName: type2',
          '      hol: '
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('21','??');
      });
    }); //type

    describe('is', function(){

      it('should fail: invalid trait name sent as parameter ', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: Test    ',
          'traits:',
          '  - hola:',
          '      usage: | ',
          '        this is the usage of this trait:',
          '  - chau:',
          '      displayName: name',
          '      description: <<param1>>',
          '/h:',
          '  is: ',
          '    - chau:',
          '        ',
          '        ',
          '  get:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('13','value was not provided for parameter: param1');
      });
    });

    it('should fail: property protocols is invalid in a resource', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: My API',
        '/rt1:',
        '  protocols:'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('5','property: \'protocols\' is invalid in a resource');
    });

  }); // Resource -root


});

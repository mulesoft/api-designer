'use strict';
var AssertsHelper = require ('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../../lib/editor-helper.js').EditorHelper;
describe('parser ',function(){
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();

  describe('rt-root', function () {

    it('should fail: property protocols is invalid in a resourceType', function () {
      var definition = [
        '#%RAML 0.8',
        'title: My API',
        'resourceTypes:',
        '  - hola:',
        '      protocols:'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('5','property: \'protocols\' is invalid in a resource type');
    });

    it('should fail: parameter key cannot be used as a resource type name', function () {
      var definition = [
        '#%RAML 0.8',
        'title: My API',
        'resourceTypes:',
        '  - <<name>>:'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('4','parameter key cannot be used as a resource type name');
    });

    it('should fail: unused parameter pp_declared on a RT', function () {
      var definition = [
        '#%RAML 0.8',
        'title: miapi',
        'resourceTypes:',
        '  - base:',
        '      get:',
        '  - collection:',
        '      type:',
        '        base:',
        '          pp: hola',
        '/r1:',
        '  type: collection'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('8','unused parameter: pp');
    });

    it('should fail: it must be a mapping_diccionary', function () {
      var definition = [
        '#%RAML 0.8',
        'title: My API',
        'resourceTypes:',
        '  - member: {}',
        '    member2: '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('5','invalid resourceType definition, it must be a map');
    });

    it('should fail: it must be a map', function () {
      var definition = [
        '#%RAML 0.8',
        'title: My API',
        'resourceTypes:',
        '  - member:'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('4','invalid resourceType definition, it must be a map');
    });

    it('should fail: circular reference - between resource', function () {
      var definition = [
        '#%RAML 0.8',
        'title: My API',
        'resourceTypes:',
        '  - rt1:',
        '      type: rt2',
        '      get:',
        '  - rt2:',
        '      type: rt2',
        '/res1:',
        '  type: rt1'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('7','circular reference of "rt2" has been detected: rt1 -> rt2 -> rt2');
    });

    it('should fail: property protocols is invalid in a resourceType', function () {
      var definition = [
        '#%RAML 0.8',
        'title: My API',
        'resourceTypes:',
        '  - rt1:',
        '      protocols:'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('5','property: \'protocols\' is invalid in a resource type');
    });

    describe('is', function () {

      it('should fail: property is must be an array', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      is:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','property \'is\' must be an array');
      });


      it('should fail: there is not trait named ...', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      is: [h]'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','there is no trait named h');
      });


    }); // is

    describe('property already used', function () {

      it('should fail: property already used: is', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      is: []',
          '      is:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property already used: \'is\'');
      });

      it('should fail: property already used: usage', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      usage: ',
          '      usage:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property already used: \'usage\'');
      });

      it('should fail: property already used: description', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      description: ',
          '      description:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property already used: \'description\'');
      });

      it('should fail: property already used: type', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      type: rt2',
          '      type:',
          '  - rt2:',
          '      description: hola'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property already used: \'type\'');
      });

      it('should fail: property already used: securedBy', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      securedBy: []',
          '      securedBy:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property already used: \'securedBy\'');
      });

      it('should fail: property already used: baseUriParameters', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'baseUri: https://www.api.com/{change}',
          'resourceTypes:',
          '  - rt1:',
          '      baseUriParameters:',
          '      baseUriParameters:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','property already used: \'baseUriParameters\'');
      });

      it('should fail: property already used: uriParameters', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      uriParameters:',
          '      uriParameters:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property already used: \'uriParameters\'');
      });

      it('should fail: property already used: displayName', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      displayName:',
          '      displayName:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property already used: \'displayName\'');
      });
    }); // property already used

  }); //resourceTypes

});

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
        '---',
        'title: My API',
        'resourceTypes:',
        '  - hola:',
        '      protocols:'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('6','property: \'protocols\' is invalid in a resource type');
    });

    it('should fail: parameter key cannot be used as a resource type name', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: My API',
        'resourceTypes:',
        '  - <<name>>:'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('5','parameter key cannot be used as a resource type name');
    });

    it('should fail: unused parameter pp_declared on a RT', function () {
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
        '          pp: hola',
        '/r1:',
        '  type: collection'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('9','unused parameter: pp');
    });

    it('should fail: it must be a mapping_diccionary', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: My API',
        'resourceTypes:',
        '  - member: {}',
        '    member2: '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('6','invalid resourceType definition, it must be a map');
    });

    it('should fail: it must be a map', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: My API',
        'resourceTypes:',
        '  - member:'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('5','invalid resourceType definition, it must be a map');
    });

    it('should fail: circular reference - between resource', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
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
      designerAsserts.parserError('8','circular reference of "rt2" has been detected: rt1 -> rt2 -> rt2');
    });

    it('should fail: property protocols is invalid in a resourceType', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: My API',
        'resourceTypes:',
        '  - rt1:',
        '      protocols:'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('6','property: \'protocols\' is invalid in a resource type');
    });

    describe('is', function () {

      it('should fail: property is must be an array', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      is:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property \'is\' must be an array');
      });


      it('should fail: there is not trait named ...', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      is: [h]'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','there is no trait named h');
      });


    }); // is

    describe('property already used', function () {

      it('should fail: property already used: is', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      is: []',
          '      is:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','property already used: \'is\'');
      });

      it('should fail: property already used: usage', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      usage: ',
          '      usage:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','property already used: \'usage\'');
      });

      it('should fail: property already used: description', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      description: ',
          '      description:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','property already used: \'description\'');
      });

      it('should fail: property already used: type', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      type: rt2',
          '      type:',
          '  - rt2:',
          '      description: hola'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','property already used: \'type\'');
      });

      it('should fail: property already used: securedBy', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      securedBy: []',
          '      securedBy:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','property already used: \'securedBy\'');
      });

      it('should fail: property already used: baseUriParameters', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'baseUri: https://www.api.com/{change}',
          'resourceTypes:',
          '  - rt1:',
          '      baseUriParameters:',
          '      baseUriParameters:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('8','property already used: \'baseUriParameters\'');
      });

      it('should fail: property already used: uriParameters', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      uriParameters:',
          '      uriParameters:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','property already used: \'uriParameters\'');
      });

      it('should fail: property already used: displayName', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      displayName:',
          '      displayName:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','property already used: \'displayName\'');
      });
    }); // property already used

    describe('method already declared', function () {

      it('should fail: method already declared: get', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      get:',
          '      get:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','method already declared: \'get\'');
      });

      it('should fail: method already declared: post', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      post:',
          '      post:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','method already declared: \'post\'');
      });

      it('should fail: method already declared: put', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      put:',
          '      put:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','method already declared: \'put\'');
      });

      it('should fail: method already declared: delete', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      delete:',
          '      delete:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','method already declared: \'delete\'');
      });

      it('should fail: method already declared: head', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      head:',
          '      head:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','method already declared: \'head\'');
      });

      it('should fail: method already declared: patch', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      patch:',
          '      patch:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','method already declared: \'patch\'');
      });

      it('should fail: method already declared: options', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes:',
          '  - rt1:',
          '      options:',
          '      options:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','method already declared: \'options\'');
      });

    }); // method already declared

    describe('resourceTypes - Methods', function () {

      describe('get', function () {

        describe('protocols', function () {
          it('should fail: RTMethods-protocols property already used protocol', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      get:',
              '        protocols: []',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','property already used: \'protocols\'');
          });

          it('should fail: RTMethods-protocol property must be an array', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      get:',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('7','property must be an array');
          });

          it('should fail: RTMethods-protocol value must be a string', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      get:',
              '        protocols:',
              '          - '
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','value must be a string');
          });

          it('should fail: only HTTP and HTTPS values are allowed', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      get:',
              '        protocols:',
              '          - htt'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','only HTTP and HTTPS values are allowed');
          });

        }); // protocols

      }); // get

      describe('post', function () {

        describe('protocols', function () {
          it('should fail: RTMethods-protocols property already used protocol', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      post:',
              '        protocols: []',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','property already used: \'protocols\'');
          });

          it('should fail: RTMethods-protocol property must be an array', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      post:',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('7','property must be an array');
          });

          it('should fail: RTMethods-protocol value must be a string', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      post:',
              '        protocols:',
              '          - '
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','value must be a string');
          });

          it('should fail: only HTTP and HTTPS values are allowed', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      post:',
              '        protocols:',
              '          - htt'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','only HTTP and HTTPS values are allowed');
          });

        }); // protocols

      }); // post

      describe('put', function () {

        describe('protocols', function () {
          it('should fail: RTMethods-protocols property already used protocol', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      put:',
              '        protocols: []',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','property already used: \'protocols\'');
          });

          it('should fail: RTMethods-protocol property must be an array', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      put:',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('7','property must be an array');
          });

          it('should fail: RTMethods-protocol value must be a string', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      put:',
              '        protocols:',
              '          - '
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','value must be a string');
          });

          it('should fail: only HTTP and HTTPS values are allowed', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      put:',
              '        protocols:',
              '          - htt'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','only HTTP and HTTPS values are allowed');
          });

        }); // protocols

      }); // put

      describe('delete', function () {

        describe('protocols', function () {
          it('should fail: RTMethods-protocols property already used protocol', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      delete:',
              '        protocols: []',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','property already used: \'protocols\'');
          });

          it('should fail: RTMethods-protocol property must be an array', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      delete:',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('7','property must be an array');
          });

          it('should fail: RTMethods-protocol value must be a string', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      delete:',
              '        protocols:',
              '          - '
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','value must be a string');
          });

          it('should fail: only HTTP and HTTPS values are allowed', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      delete:',
              '        protocols:',
              '          - htt'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','only HTTP and HTTPS values are allowed');
          });

        }); // protocols

      }); // delete

      describe('head', function () {

        describe('protocols', function () {
          it('should fail: RTMethods-protocols property already used protocol', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      head:',
              '        protocols: []',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','property already used: \'protocols\'');
          });

          it('should fail: RTMethods-protocol property must be an array', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      head:',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('7','property must be an array');
          });

          it('should fail: RTMethods-protocol value must be a string', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      head:',
              '        protocols:',
              '          - '
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','value must be a string');
          });

          it('should fail: only HTTP and HTTPS values are allowed', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      head:',
              '        protocols:',
              '          - htt'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','only HTTP and HTTPS values are allowed');
          });

        }); // protocols

      }); // head

      describe('patch', function () {

        describe('protocols', function () {
          it('should fail: RTMethods-protocols property already used protocol', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      patch:',
              '        protocols: []',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','property already used: \'protocols\'');
          });

          it('should fail: RTMethods-protocol property must be an array', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      patch:',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('7','property must be an array');
          });

          it('should fail: RTMethods-protocol value must be a string', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      patch:',
              '        protocols:',
              '          - '
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','value must be a string');
          });

          it('should fail: only HTTP and HTTPS values are allowed', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      patch:',
              '        protocols:',
              '          - htt'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','only HTTP and HTTPS values are allowed');
          });

        }); // protocols

      }); // patch

      describe('options', function () {

        describe('protocols', function () {
          it('should fail: RTMethods-protocols property already used protocol', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      options:',
              '        protocols: []',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','property already used: \'protocols\'');
          });

          it('should fail: RTMethods-protocol property must be an array', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      options:',
              '        protocols:'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('7','property must be an array');
          });

          it('should fail: RTMethods-protocol value must be a string', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      options:',
              '        protocols:',
              '          - '
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','value must be a string');
          });

          it('should fail: only HTTP and HTTPS values are allowed', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'resourceTypes:',
              '  - hola:',
              '      options:',
              '        protocols:',
              '          - htt'
            ].join('\\n');
            editor.setValue(definition);
            designerAsserts.parserError('8','only HTTP and HTTPS values are allowed');
          });

        }); // protocols

      }); // options

    }); // RTMethods

  }); //resourceTypes

});

'use strict';

describe('editor-parser', function () {

//  beforeEach(function () {
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
//  });

  describe('include', function () {

    xit('should fail: file circular reference', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: !include example.ramln'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('3', 'detected circular !include of example.raml');
    });

    it('should fail: test ', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: !include http://some.broken.link.com\\n'
      ].join('\\n');
      editorSetValue(definition);
//      editorSetLine(4,'version: 1');
//      browser.sleep (1000);
      editorParserErrorAssertions('3','error: cannot fetch http://some.broken.link.com');


    });

    it('should fail: file name/URL cannot be null', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Mi Api',
        'trait: !include'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('4', 'file name/URL cannot be null');
    });




  }); //include

  describe('Editor Error validation', function () {

    describe('Root Section', function () {

//      it('should fail: The first line must be: #%RAML 0.8', function(){
//        var definition = '';
//        editorSetValue(definition);
//        editorParserErrorAssertions('1','The first line must be: \'#%RAML 0.8\'');
//      });
//
//      it('should fail: unsupported raml version #%RAML 0.1', function () {
//        var definition = [
//          '#%RAML 0.1'
//        ].join('\\n');
//        editorSetValue(definition);
//        editorParserErrorAssertions('1','Unsupported RAML version: \'#%RAML 0.1\'');
//      });
//
//      it('should fail: document must be a map---', function () {
//        var definition = [
//          '#%RAML 0.8',
//          '---'
//        ].join('\\n');
//        editorSetValue(definition);
//        editorParserErrorAssertions('2','document must be a map');
//      });
//
//      it('should fail: document must be a map(titl)', function () {
//        var definition = [
//          '#%RAML 0.8',
//          '---',
//          'titl'
//        ].join('\\n');
//        editorSetValue(definition);
//        editorParserErrorAssertions('3','document must be a map');
//      });
//
//      it('should fail: empty document (only comments)', function () {
//        var definition = [
//          '#%RAML 0.8',
//          '#---'
//        ].join('\\n');
//        editorSetValue(definition);
//        editorParserErrorAssertions('1','empty document');
//      });
//
//      it('should fail: block map end ...', function () {
//        var definition = [
//          '#%RAML 0.8',
//          '---',
//          'title: Example Api',
//          '...',
//          'version: 1.0'
//        ].join('\\n');
//        editorSetValue(definition);
//        editorParserErrorAssertions('5','expected \'<document start>\', but found <block mapping end>');
//      });


      describe('version', function () {

        it('**** should fail: root property already used version', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'version: v1',
            'version:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','root property already used: \'version\'');
        });

        it('should fail: missing version', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: hola',
            'baseUri: http://server/api/{version}'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('3','missing version');
        });

      }); //Version

      describe('baseUri', function () {

        it('should fail: root property already used baseUri', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'baseUri: http://www.myapi.com',
            'baseUri:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','root property already used: \'baseUri\'');
        });

        it('should fail: baseUri must have a value', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'baseUri:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('4','baseUri must have a value');
        });

      }); //baseUri

      describe('baseUriParameters', function () {

        it('should fail: root property already used baseUriParameters', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'baseUriParameters:',
            'baseUriParameters:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','root property already used: \'baseUriParameters\'');
        });

        it('should fail: invalid map - baseUriParameters/Uri1/{require}', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: Test',
            'baseUri: http://server/api/{version}/{uri1}',
            'version: v1',
            'baseUriParameters: ',
            '  uri1: ',
            '    require'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('7','URI parameter must be a map');
        });

        it('should fail: baseUriParameter - version parameter not allowed here', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: hola',
            'version: v0.1',
            'baseUri: http://server/api/{version}',
            'baseUriParameters:',
            '  version:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('7','version parameter not allowed here');
        });

        it('should fail when no baseUri is defined', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: my title',
            'baseUriParameters:',
            '  hols:',
            '    displayName: hola'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','uri parameters defined when there is no baseUri');
        });

        it('should fail: uri parameter unused', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: my title',
            'baseUri: http://www.myapi.com/',
            'baseUriParameters:',
            '  hola:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('6','hola uri parameter unused');
        });

      }); //baseUriParameters

      describe('mediaType', function () {

        it('should fail: root property already used mediaType', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'mediaType: hola',
            'mediaType:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','root property already used: \'mediaType\'');
        });

      }); //mediaType

      describe('Documentation', function () {

        it('should fail: Documentation - unkown property Documentation', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'Documentation:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('4','unknown property Documentation');
        });

        it('should fail: documentation must be an array', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'documentation:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('4','documentation must be an array');
        });

        it('should fail: each documentation section must be a map', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'documentation:',
            '  -'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','each documentation section must be a map');
        });

        it('should fail: title must be a string', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'documentation:',
            '  - title:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','title must be a string');
        });

        it('should fail: content must be a string', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'documentation:',
            '  - content:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','content must be a string');
        });

        it('should fail: a documentation entry must have a content property', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'documentation:',
            '  - title: hola'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','a documentation entry must have content property');
        });

        it('should fail: a documentation entry must have title property', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'documentation:',
            '  - content: hola'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','a documentation entry must have title property');
        });

        it('should fail: root property already used documentation', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'documentation:',
            '  - title: hola',
            '    content: my content',
            'documentation:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('7','root property already used: \'documentation\'');
        });

        it('should fail: property already used title', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'documentation:',
            '  - title: hola',
            '    title:',
            '    content: my content'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('6','property already used: \'title\'');
        });

        it('should fail: property already used content', function (){
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'documentation:',
            '  - title: hola',
            '    content: my content',
            '    content:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('7','property already used: \'content\'');
        });

      }); //Documentation

      describe('traits', function () {

        it('should failed response with form Parameters', function(){
          var definition = [
            '#%RAML 0.8',
            'title: hola',
            'traits: ',
            '  - hola: ',
            '      responses: ',
            '        200: ',
            '          body: ',
            '            application/x-www-form-urlencoded: ',
            '              formParameters: '
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('9','formParameters cannot be used to describe response bodies');
        });

        it('should fail: root property already used traits', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'traits: []',
            'traits:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','root property already used: \'traits\'');
        });

        it('should fail: parameter key cannot be used as a trait name', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'traits:',
            '  - <<name>>:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','parameter key cannot be used as a trait name');
        });

        it('should fail: array as key - trait []', function () {
          var definition = [
            '#%RAML 0.8',
            'title: hola',
            'resourceTypes:',
            '  - member3:',
            '      get:',
            '        is:',
            '          - gettrait',
            'traits:',
            '  - gettrait:',
            '      description: this is the description',
            '      responses:',
            '        [100,200,300,400,500]:',
            '           description: this is the description',
            '/resourc:',
            '  type: member3'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('12','only scalar map keys are allowed in RAML');
        });

        it('should fail: array as key - trait {}', function () {
          var definition = [
            '#%RAML 0.8',
            'title: hola',
            'resourceTypes:',
            '  - member3:',
            '      get:',
            '        is:',
            '          - gettrait',
            'traits:',
            '  - gettrait:',
            '      description: this is the description',
            '      responses:',
            '        {100,200,300,400,500}:',
            '           description: this is the description',
            '/resourc:',
            '  type: member3'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('12','only scalar map keys are allowed in RAML');
        });

        describe('protocols', function () {

          it('should fail: traits-protocols property already used protocol', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'traits:',
              '  - hola:',
              '      protocols: []',
              '      protocols:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('7','property already used: \'protocols\'');
          });

          it('should fail: protocol property must be an array', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'traits:',
              '  - hola:',
              '      protocols:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','property must be an array');
          });

          it('should fail: protocol value must be a string', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'traits:',
              '  - hola:',
              '      protocols:',
              '        - '
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('7','value must be a string');
          });

          it('should fail: only HTTP and HTTPS values are allowed', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: My API',
              'traits:',
              '  - hola:',
              '      protocols:',
              '        - htt'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('7','only HTTP and HTTPS values are allowed');
          });

        }); // protocols

      }); //traits

      describe('resourceTyoes', function () {

        it('should fail: property protocols is invalid in a resourceType', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'resourceTypes:',
            '  - hola:',
            '      protocols:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('6','property: \'protocols\' is invalid in a resource type');
        });

        it('should fail: root property already used resourceTypes', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'resourceTypes: []',
            'resourceTypes:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','root property already used: \'resourceTypes\'');
        });

        it('should fail: parameter key cannot be used as a resource type name', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'resourceTypes:',
            '  - <<name>>:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','parameter key cannot be used as a resource type name');
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
          editorSetValue(definition);
          editorParserErrorAssertions('9','unused parameter: pp');
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
          editorSetValue(definition);
          editorParserErrorAssertions('6','invalid resourceType definition, it must be a map');
        });

        it('should fail: it must be a map', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'resourceTypes:',
            '  - member:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','invalid resourceType definition, it must be a map');
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
          editorSetValue(definition);
          editorParserErrorAssertions('8','circular reference of "rt2" has been detected: rt1 -> rt2 -> rt2');
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
          editorSetValue(definition);
          editorParserErrorAssertions('6','property: \'protocols\' is invalid in a resource type');
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
            editorSetValue(definition);
            editorParserErrorAssertions('6','property \'is\' must be an array');
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
            editorSetValue(definition);
            editorParserErrorAssertions('6','there is no trait named h');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','property already used: \'is\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','property already used: \'usage\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','property already used: \'description\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','property already used: \'type\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','property already used: \'securedBy\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('8','property already used: \'baseUriParameters\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','property already used: \'uriParameters\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','property already used: \'displayName\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','method already declared: \'get\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','method already declared: \'post\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','method already declared: \'put\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','method already declared: \'delete\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','method already declared: \'head\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','method already declared: \'patch\'');
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
            editorSetValue(definition);
            editorParserErrorAssertions('7','method already declared: \'options\'');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','property already used: \'protocols\'');
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
                editorSetValue(definition);
                editorParserErrorAssertions('7','property must be an array');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','value must be a string');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','only HTTP and HTTPS values are allowed');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','property already used: \'protocols\'');
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
                editorSetValue(definition);
                editorParserErrorAssertions('7','property must be an array');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','value must be a string');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','only HTTP and HTTPS values are allowed');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','property already used: \'protocols\'');
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
                editorSetValue(definition);
                editorParserErrorAssertions('7','property must be an array');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','value must be a string');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','only HTTP and HTTPS values are allowed');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','property already used: \'protocols\'');
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
                editorSetValue(definition);
                editorParserErrorAssertions('7','property must be an array');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','value must be a string');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','only HTTP and HTTPS values are allowed');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','property already used: \'protocols\'');
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
                editorSetValue(definition);
                editorParserErrorAssertions('7','property must be an array');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','value must be a string');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','only HTTP and HTTPS values are allowed');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','property already used: \'protocols\'');
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
                editorSetValue(definition);
                editorParserErrorAssertions('7','property must be an array');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','value must be a string');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','only HTTP and HTTPS values are allowed');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','property already used: \'protocols\'');
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
                editorSetValue(definition);
                editorParserErrorAssertions('7','property must be an array');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','value must be a string');
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
                editorSetValue(definition);
                editorParserErrorAssertions('8','only HTTP and HTTPS values are allowed');
              });

            }); // protocols

          }); // options

        }); // RTMethods

      }); //resourceTypes

      describe('schemas', function () {

        it('should fail: schemas property must be an array', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: Test',
            'schemas:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('4','schemas property must be an array');
        });

        it('should fail: root property already used schemas', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'schemas: []',
            'schemas:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','root property already used: \'schemas\'');
        });

      }); //schemas

      describe('securitySchemes', function () {

        it('should fail: root property already used securitySchemes', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'securitySchemes: []',
            'securitySchemes:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','root property already used: \'securitySchemes\'');
        });

      }); //securitySchemes

      describe('protocols', function () {

        it('should fail: root property already used protocol', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'protocols: []',
            'protocols:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','root property already used: \'protocols\'');
        });


        it('should fail: protocol property must be an array', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'protocols:'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('4','property must be an array');
        });


        it('should fail: protocol value must be a string', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'protocols:',
            '  - '
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','value must be a string');
        });

        it('should fail: only HTTP and HTTPS values are allowed', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            'protocols:',
            '  - htt'
          ].join('\\n');
          editorSetValue(definition);
          editorParserErrorAssertions('5','only HTTP and HTTPS values are allowed');
        });

      }); //protocols

    }); //describeRootSection

    describe('Resource', function () {

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
            editorSetValue(definition);
            editorParserErrorAssertions('14','unused parameter: param1');
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
            editorSetValue(definition);
            editorParserErrorAssertions('22','there is no resource type named type');
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
            editorSetValue(definition);
            editorParserErrorAssertions('21','there is no trait named yr');
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
            editorSetValue(definition);
            editorParserErrorAssertions('21','??');
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
            editorSetValue(definition);
            editorParserErrorAssertions('13','value was not provided for parameter: param1');
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
          editorSetValue(definition);
          editorParserErrorAssertions('5','property: \'protocols\' is invalid in a resource');
        });

      }); // Resource attributes

      describe('Methods', function () {

        describe('get', function () {

          it('should fail with displayName property', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  get:',
              '    displayName:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','property: \'displayName\' is invalid in a method');
          });

          it('should fail: method already declared: get', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  get:',
              '  get:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','method already declared: \'get\'');
          });

          describe('protocols', function () {

            it('should fail: Rget-protocols property already used protocol', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  get:',
                '    protocols: []',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','property already used: \'protocols\'');
            });

            it('should fail: Rget-protocol property must be an array', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  get:',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('6','property must be an array');
            });

            it('should fail: Rget-protocol value must be a string', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  get:',
                '    protocols:',
                '      - '
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','value must be a string');
            });

            it('should fail: Rget-protocols only HTTP and HTTPS values are allowed', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  get:',
                '    protocols:',
                '      - htt'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','only HTTP and HTTPS values are allowed');
            });

          }); // protocols


        }); //get

        describe('put', function () {

          it('should fail with displayName property', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  put:',
              '    displayName:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','property: \'displayName\' is invalid in a method');
          });

          it('should fail: method already declared: put', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  put:',
              '  put:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','method already declared: \'put\'');
          });

          describe('protocols', function () {

            it('should fail: Rput-protocols property already used protocol', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  put:',
                '    protocols: []',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','property already used: \'protocols\'');
            });

            it('should fail: Rput-protocol property must be an array', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  put:',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('6','property must be an array');
            });

            it('should fail: Rput-protocol value must be a string', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  put:',
                '    protocols:',
                '      - '
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','value must be a string');
            });

            it('should fail: Rput-protocols only HTTP and HTTPS values are allowed', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  put:',
                '    protocols:',
                '      - htt'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','only HTTP and HTTPS values are allowed');
            });

          }); // protocols

        }); //put

        describe('head', function () {

          it('should fail with displayName property', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  head:',
              '    displayName:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','property: \'displayName\' is invalid in a method');
          });

          it('should fail: method already declared: head', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  head:',
              '  head:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','method already declared: \'head\'');
          });

          describe('protocols', function () {

            it('should fail: Rhead-protocols property already used protocol', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  head:',
                '    protocols: []',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','property already used: \'protocols\'');
            });

            it('should fail: Rhead-protocols property must be an array', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  head:',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('6','property must be an array');
            });

            it('should fail: Rhead-protocol value must be a string', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  head:',
                '    protocols:',
                '      - '
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','value must be a string');
            });

            it('should fail: Rhead-protocols only HTTP and HTTPS values are allowed', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  head:',
                '    protocols:',
                '      - htt'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','only HTTP and HTTPS values are allowed');
            });

          }); // protocols

        }); //head

        describe('options', function () {

          it('should fail with displayName property', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  options:',
              '    displayName:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','property: \'displayName\' is invalid in a method');
          });

          it('should fail: method already declared: options', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  options:',
              '  options:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','method already declared: \'options\'');
          });

          describe('protocols', function () {

            it('should fail: Roptions-protocols property already used protocol', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  options:',
                '    protocols: []',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','property already used: \'protocols\'');
            });

            it('should fail: Roptions-protocol property must be an array', function (){
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  options:',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('6','property must be an array');
            });

            it('should fail: Roptions-protocol value must be a string', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  options:',
                '    protocols:',
                '      - '
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','value must be a string');
            });

            it('should fail: Roptions-protocols only HTTP and HTTPS values are allowed', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  options:',
                '    protocols:',
                '      - htt'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','only HTTP and HTTPS values are allowed');
            });

          }); // protocols

        }); //options

        describe('post', function () {

          it('should fail with displayName property', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  post:',
              '    displayName:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','property: \'displayName\' is invalid in a method');
          });

          it('should fail: method already declared: post', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  post:',
              '  post:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','method already declared: \'post\'');
          });

          describe('protocols', function () {

            it('should fail: Rpost-protocols property already used protocol', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  post:',
                '    protocols: []',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','property already used: \'protocols\'');
            });

            it('should fail: Rpost-protocol property must be an array', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  post:',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('6','property must be an array');
            });

            it('should fail: Rpost-protocol value must be a string', function (){
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  post:',
                '    protocols:',
                '      - '
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','value must be a string');
            });

            it('should fail: Rpost-protocols only HTTP and HTTPS values are allowed', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  post:',
                '    protocols:',
                '      - htt'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','only HTTP and HTTPS values are allowed');
            });

          }); // protocols

        }); //post

        describe('delete', function () {

          it('should fail with displayName property', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  delete:',
              '    displayName:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','property: \'displayName\' is invalid in a method');
          });

          it('should fail: method already declared: delete', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  delete:',
              '  delete:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','method already declared: \'delete\'');
          });

          describe('protocols', function () {

            it('should fail: Rdelete-protocols property already used protocol', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  delete:',
                '    protocols: []',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','property already used: \'protocols\'');
            });

            it('should fail: Rdelete-protocol property must be an array', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  delete:',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('6','property must be an array');
            });

            it('should fail: Rdelete-protocol value must be a string', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  delete:',
                '    protocols:',
                '      - '
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','value must be a string');
            });

            it('should fail: Rdelete-protocols only HTTP and HTTPS values are allowed', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  delete:',
                '    protocols:',
                '      - htt'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','only HTTP and HTTPS values are allowed');
            });

          }); // protocols
        }); //delete

        describe('patch', function () {

          it('should fail with displayName property', function () { //RT-300
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  patch:',
              '    displayName:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','property: \'displayName\' is invalid in a method');
          });

          it('should fail: method already declared: patch', function () {
            var definition = [
              '#%RAML 0.8',
              '---',
              'title: miapi',
              '/r1:',
              '  patch:',
              '  patch:'
            ].join('\\n');
            editorSetValue(definition);
            editorParserErrorAssertions('6','method already declared: \'patch\'');
          });

          describe('protocols', function () {

            it('should fail: Rpatch-protocols property already used protocol', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  patch:',
                '    protocols: []',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','property already used: \'protocols\'');
            });

            it('should fail: Rpatch-protocol property must be an array', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  patch:',
                '    protocols:'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('6','property must be an array');
            });

            it('should fail: Rpatch-protocol value must be a string', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  patch:',
                '    protocols:',
                '      - '
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','value must be a string');
            });

            it('should fail: Rpatch-protocols only HTTP and HTTPS values are allowed', function () {
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: My API',
                '/reso:',
                '  patch:',
                '    protocols:',
                '      - htt'
              ].join('\\n');
              editorSetValue(definition);
              editorParserErrorAssertions('7','only HTTP and HTTPS values are allowed');
            });

          }); // protocols

        }); //patch

      }); // Methods

    }); //Resource

  }); //Editor Error validation

});//RAMLeditor - Parser errors validation

'use strict';

var expect = require('expect.js');
var protractor = require('protractor');
var webdriver = require('selenium-webdriver');
var EditorHelper = require('../lib/editor-helper.js').EditorHelper;
var j0hnQa = 'https://j0hnqa.mulesoft.org/';
var ramlUrl = require('../config').url;


describe('RAMLeditor - Parser errors validation',function(){
    var driver, ptor, editorHelper;

    before(function(){
        ptor = this.ptor;
        driver = ptor.driver;
        ptor.driver.manage().timeouts().setScriptTimeout(80000);
        editorHelper = new EditorHelper(ptor, driver);
     });

    beforeEach(function(){
        ptor.get(ramlUrl);
        ptor.executeScript(function () {
            localStorage['config.updateResponsivenessInterval'] = 1;
        });
    });

    describe('include',function(){

        it.skip('should fail: file circular reference', function(done) {
            var definition = [
                '#%RAML 0.8',
                '---',
                'title: !include example.raml'
            ].join('\\n');
            editorHelper.setValue(definition);
            editorHelper.getErrorLineMessage().then(function (list){
                    var line = list[0], message = list[1];
                    expect(message).to.eql('detected circular !include of example.raml');
                    expect(line).to.eql('3');
                    done();
            });
        });

        it('should fail: file name/URL cannot be null', function(done) {
            var definition = [
                '#%RAML 0.8',
                '---',
                'title: !include'
            ].join('\\n');
            editorHelper.setValue(definition);
            editorHelper.getErrorLineMessage().then(function (list){
                    var line = list[0], message = list[1];
                    expect(message).to.eql('file name/URL cannot be null');
                    expect(line).to.eql('3');
                    done();
            });
        });

        it('should fail: test ', function(done) {
            var definition = [
                '#%RAML 0.8',
                '---',
                'title: !include http://some.broken.link.com'
            ].join('\\n');
            editorHelper.setValue(definition);
            editorHelper.getErrorLineMessage().then(function (list){
                var line = list[0], message = list[1];
                expect(message).to.match(/cannot fetch http:\/\/some.broken.link.com ([^)]+)/);
                expect(line).to.eql('3');
                done();
            });
        });

    }); //include

    describe('Editor Error validation', function() {

            describe('Root Section', function(){

                it('should fail: unsupported raml version #%RAML 0.1', function(done) {
                    var definition = [
                        '#%RAML 0.1'
                    ].join('\\n');
                    editorHelper.setValue(definition);
                    editorHelper.getErrorLineMessage().then(function (list){
                        var line = list[0], message = list[1];
                        expect(message).to.eql('Unsupported RAML version: \'#%RAML 0.1\'');
                        expect(line).to.eql('1');
                        done();
                    });
                });

                it('should fail: document must be a map---', function(done) {
                    var definition = [
                        '#%RAML 0.8',
                        '---'
                    ].join('\\n');
                    editorHelper.setValue(definition);
                    editorHelper.getErrorLineMessage().then(function (list){
                        var line = list[0], message = list[1];
                        expect(message).to.eql('document must be a map');
                        expect(line).to.eql('2');
                        done();
                    });
                });

                it('should fail: document must be a map(titl)', function(done){
                    var definition = [
                        '#%RAML 0.8',
                        '---',
                        'titl'
                    ].join('\\n');
                    editorHelper.setValue(definition);
                    editorHelper.getErrorLineMessage().then(function (list){
                        var line = list[0], message = list[1];
                        expect(message).to.eql('document must be a map');
                        expect(line).to.eql('3');
                        done();
                    });
                });

                it('should fail: empty document (only comments)', function(done){
                    var definition = [
                        '#%RAML 0.8',
                        '#---'
                    ].join('\\n');

                    editorHelper.setValue(definition);
                    editorHelper.getErrorLineMessage().then(function (list){
                        var line = list[0], message = list[1];
                        expect(message).to.eql('empty document');
                        expect(line).to.eql('1');
                        done();
                    });
                });

                it('should fail: block map end ...', function(done){
                    var definition = [
                        '#%RAML 0.8',
                        '---',
                        'title: Example Api',
                        '...',
                        'version: 1.0'
                    ].join('\\n');
                    editorHelper.setValue(definition);
                    editorHelper.getErrorLineMessage().then(function (list){
                        var line = list[0], message = list[1];
                        expect(message).to.eql('expected \'<document start>\', but found <block mapping end>');
                        expect(line).to.eql('5');
                        done();
                    });
                });

                describe('title',function(){

                    it('should fail: root property already used title', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'title:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'title\'');
                            expect(line).to.eql('4');
                            done();
                        });
                    });

                    it('should fail: missing title', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'version: v1'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('missing title');
                            expect(line).to.eql('3');
                            done();
                        });
                    });

                }); //Title

                describe('version',function(){

                    it('**** should fail: root property already used version', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'version: v1',
                            'version:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'version\'');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: missing version', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: hola',
                            'baseUri: http://server/api/{version}'
                        ].join('\\n');

                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('missing version');
                            expect(line).to.eql('3');
                            done();
                        });
                    });

                }); //Version

                describe('baseUri',function(){

                    it('should fail: root property already used baseUri', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'baseUri: http://www.myapi.com',
                            'baseUri:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'baseUri\'');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: baseUri must have a value', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'baseUri:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('baseUri must have a value');
                            expect(line).to.eql('4');
                            done();
                        });
                    });

                }); //baseUri

                describe('baseUriParameters',function(){

                    it('should fail: root property already used baseUriParameters', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'baseUriParameters:',
                            'baseUriParameters:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'baseUriParameters\'');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: invalid map - baseUriParameters/Uri1/{require}', function(done){
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
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('URI parameter must be a map');
                            expect(line).to.eql('7');
                            done();
                        });
                    });

                    it('should fail: baseUriParameter - version parameter not allowed here', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: hola',
                            'version: v0.1',
                            'baseUri: http://server/api/{version}',
                            'baseUriParameters:',
                            '  version:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('version parameter not allowed here');
                            expect(line).to.eql('7');
                            done();
                        });
                    });

                    it('should fail when no baseUri is defined', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: my title',
                            'baseUriParameters:',
                            '  hols:',
                            '    displayName: hola'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('uri parameters defined when there is no baseUri');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: uri parameter unused', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: my title',
                            'baseUri: http://www.myapi.com/',
                            'baseUriParameters:',
                            '  hola:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('hola uri parameter unused');
                            expect(line).to.eql('6');
                            done();
                        });
                    });

                }); //baseUriParameters

                describe('mediaType',function(){

                    it('should fail: root property already used mediaType', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'mediaType: hola',
                            'mediaType:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'mediaType\'');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                }); //mediaType

                describe('Documentation',function(){

                    it('should fail: Documentation - unkown property Documentation', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'Documentation:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('unknown property Documentation');
                            expect(line).to.eql('4');
                            done();
                        });
                    });

                    it('should fail: documentation must be an array', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'documentation:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('documentation must be an array');
                            expect(line).to.eql('4');
                            done();
                        });
                    });

                    it('should fail: each documentation section must be a map', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'documentation:',
                            '  -'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('each documentation section must be a map');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: title must be a string', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'documentation:',
                            '  - title:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('title must be a string');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: content must be a string', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'documentation:',
                            '  - content:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('content must be a string');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: a documentation entry must have a content property', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'documentation:',
                            '  - title: hola'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('a documentation entry must have content property');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: a documentation entry must have title property', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'documentation:',
                            '  - content: hola'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('a documentation entry must have title property');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: root property already used documentation', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'documentation:',
                            '  - title: hola',
                            '    content: my content',
                            'documentation:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'documentation\'');
                            expect(line).to.eql('7');
                            done();
                        });
                    });

                    it('should fail: property already used title', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'documentation:',
                            '  - title: hola',
                            '    title:',
                            '    content: my content'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('property already used: \'title\'');
                            expect(line).to.eql('6');
                            done();
                        });
                    });

                    it('should fail: property already used content', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'documentation:',
                            '  - title: hola',
                            '    content: my content',
                            '    content:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('property already used: \'content\'');
                            expect(line).to.eql('7');
                            done();
                        });
                    });

                }); //Documentation

                describe('traits',function(){

                    it('should fail: root property already used traits', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'traits: []',
                            'traits:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'traits\'');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                     it('should fail: parameter key cannot be used as a trait name', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'traits:',
                            '  - <<name>>:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('parameter key cannot be used as a trait name');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: array as key - trait []', function(done){
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
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('only scalar map keys are allowed in RAML');
                            expect(line).to.eql('12');
                            done();
                        });
                    });

                    it('should fail: array as key - trait {}', function(done){
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
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('only scalar map keys are allowed in RAML');
                            expect(line).to.eql('12');
                            done();
                        });
                    });

                    describe('protocols', function(){

                        it('should fail: traits-protocols property already used protocol', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'traits:',
                                '  - hola:',
                                '      protocols: []',
                                '      protocols:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property already used: \'protocols\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });


                        it('should fail: protocol property must be an array', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'traits:',
                                '  - hola:',
                                '      protocols:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property must be an array');
                                expect(line).to.eql('6');
                                done();
                            });
                        });


                        it('should fail: protocol value must be a string', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'traits:',
                                '  - hola:',
                                '      protocols:',
                                '        - '
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('value must be a string');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: only HTTP and HTTPS values are allowed', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'traits:',
                                '  - hola:',
                                '      protocols:',
                                '        - htt'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                    }); // protocols

                }); //traits

                describe('resourceTyoes',function(){

                    it('should fail: property protocols is invalid in a resourceType', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'resourceTypes:',
                            '  - hola:',
                            '      protocols:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('property: \'protocols\' is invalid in a resource type');
                            expect(line).to.eql('6');
                            done();
                        });
                    });

                    it('should fail: root property already used resourceTypes', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'resourceTypes: []',
                            'resourceTypes:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'resourceTypes\'');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: parameter key cannot be used as a resource type name', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'resourceTypes:',
                            '  - <<name>>:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('parameter key cannot be used as a resource type name');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: unused parameter pp_declared on a RT', function(done){
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
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('unused parameter: pp');
                            expect(line).to.eql('9');
                            done();
                        });
                    });

                    it('should fail: it must be a mapping_diccionary', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'resourceTypes:',
                            '  - member: {}',
                            '    member2: '
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('invalid resourceType definition, it must be a map');
                            expect(line).to.eql('6');
                            done();
                        });
                    });

                    it('should fail: it must be a map', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'resourceTypes:',
                            '  - member:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('invalid resourceType definition, it must be a map');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: circular reference - between resource', function(done){
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
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('circular reference of \'rt2\' has been detected: rt1 -> rt2 -> rt2');
                            expect(line).to.eql('8');
                            done();
                        });
                    });

                    it('should fail: property protocols is invalid in a resourceType', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'resourceTypes:',
                            '  - rt1:',
                            '      protocols:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('property: \'protocols\' is invalid in a resource type');
                            expect(line).to.eql('6');
                            done();
                        });
                    });

                    describe('is', function(){

                        it('should fail: property is must be an array', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      is:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property \'is\' must be an array');
                                expect(line).to.eql('6');
                                done();
                            });
                        });



                        it('should fail: there is not trait named ...', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      is: [h]'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('there is no trait named h');
                                expect(line).to.eql('6');
                                done();
                            });
                        });


                    }); // is

                    describe('property already used', function(){

                        it('should fail: property already used: is', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      is: []',
                                '      is:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property already used: \'is\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: property already used: usage', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      usage: ',
                                '      usage:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property already used: \'usage\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: property already used: description', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      description: ',
                                '      description:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property already used: \'description\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: property already used: type', function(done){
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
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property already used: \'type\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: property already used: securedBy', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      securedBy: []',
                                '      securedBy:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property already used: \'securedBy\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: property already used: baseUriParameters', function(done){
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
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property already used: \'baseUriParameters\'');
                                expect(line).to.eql('8');
                                done();
                            });
                        });

                        it('should fail: property already used: uriParameters', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      uriParameters:',
                                '      uriParameters:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property already used: \'uriParameters\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: property already used: displayName', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      displayName:',
                                '      displayName:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property already used: \'displayName\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });
                    }); // property already used

                    describe('method already declared', function(){

                        it('should fail: method already declared: get', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      get:',
                                '      get:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'get\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: method already declared: post', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      post:',
                                '      post:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'post\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: method already declared: put', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      put:',
                                '      put:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'put\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: method already declared: delete', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      delete:',
                                '      delete:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'delete\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: method already declared: head', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      head:',
                                '      head:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'head\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: method already declared: patch', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      patch:',
                                '      patch:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'patch\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                        it('should fail: method already declared: options', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: My API',
                                'resourceTypes:',
                                '  - rt1:',
                                '      options:',
                                '      options:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'options\'');
                                expect(line).to.eql('7');
                                done();
                            });
                        });

                    }); // method already declared

                    describe('resourceTypes - Methods', function(){

                        describe('get',function(){

                            describe('protocols', function(){
                                it('should fail: RTMethods-protocols property already used protocol', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property already used: \'protocols\'');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol property must be an array', function(done){
                                    var definition = [
                                        '#%RAML 0.8',
                                        '---',
                                        'title: My API',
                                        'resourceTypes:',
                                        '  - hola:',
                                        '      get:',
                                        '        protocols:'
                                    ].join('\\n');
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property must be an array');
                                        expect(line).to.eql('7');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol value must be a string', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('value must be a string');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: only HTTP and HTTPS values are allowed', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                            }); // protocols

                        }); // get

                        describe('post',function(){

                            describe('protocols', function(){
                                it('should fail: RTMethods-protocols property already used protocol', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property already used: \'protocols\'');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol property must be an array', function(done){
                                    var definition = [
                                        '#%RAML 0.8',
                                        '---',
                                        'title: My API',
                                        'resourceTypes:',
                                        '  - hola:',
                                        '      post:',
                                        '        protocols:'
                                    ].join('\\n');
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property must be an array');
                                        expect(line).to.eql('7');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol value must be a string', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('value must be a string');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: only HTTP and HTTPS values are allowed', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                            }); // protocols

                        }); // post

                        describe('put',function(){

                            describe('protocols', function(){
                                it('should fail: RTMethods-protocols property already used protocol', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property already used: \'protocols\'');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol property must be an array', function(done){
                                    var definition = [
                                        '#%RAML 0.8',
                                        '---',
                                        'title: My API',
                                        'resourceTypes:',
                                        '  - hola:',
                                        '      put:',
                                        '        protocols:'
                                    ].join('\\n');
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property must be an array');
                                        expect(line).to.eql('7');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol value must be a string', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('value must be a string');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: only HTTP and HTTPS values are allowed', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                            }); // protocols

                        }); // put

                        describe('delete',function(){

                            describe('protocols', function(){
                                it('should fail: RTMethods-protocols property already used protocol', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property already used: \'protocols\'');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol property must be an array', function(done){
                                    var definition = [
                                        '#%RAML 0.8',
                                        '---',
                                        'title: My API',
                                        'resourceTypes:',
                                        '  - hola:',
                                        '      delete:',
                                        '        protocols:'
                                    ].join('\\n');
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property must be an array');
                                        expect(line).to.eql('7');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol value must be a string', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('value must be a string');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: only HTTP and HTTPS values are allowed', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                            }); // protocols

                        }); // delete

                        describe('head',function(){

                            describe('protocols', function(){
                                it('should fail: RTMethods-protocols property already used protocol', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property already used: \'protocols\'');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol property must be an array', function(done){
                                    var definition = [
                                        '#%RAML 0.8',
                                        '---',
                                        'title: My API',
                                        'resourceTypes:',
                                        '  - hola:',
                                        '      head:',
                                        '        protocols:'
                                    ].join('\\n');
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property must be an array');
                                        expect(line).to.eql('7');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol value must be a string', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('value must be a string');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: only HTTP and HTTPS values are allowed', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                            }); // protocols

                        }); // head

                        describe('patch',function(){

                            describe('protocols', function(){
                                it('should fail: RTMethods-protocols property already used protocol', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property already used: \'protocols\'');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol property must be an array', function(done){
                                    var definition = [
                                        '#%RAML 0.8',
                                        '---',
                                        'title: My API',
                                        'resourceTypes:',
                                        '  - hola:',
                                        '      patch:',
                                        '        protocols:'
                                    ].join('\\n');
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property must be an array');
                                        expect(line).to.eql('7');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol value must be a string', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('value must be a string');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: only HTTP and HTTPS values are allowed', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                            }); // protocols

                        }); // patch

                        describe('options',function(){

                            describe('protocols', function(){
                                it('should fail: RTMethods-protocols property already used protocol', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property already used: \'protocols\'');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol property must be an array', function(done){
                                    var definition = [
                                        '#%RAML 0.8',
                                        '---',
                                        'title: My API',
                                        'resourceTypes:',
                                        '  - hola:',
                                        '      options:',
                                        '        protocols:'
                                    ].join('\\n');
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('property must be an array');
                                        expect(line).to.eql('7');
                                        done();
                                    });
                                });

                                it('should fail: RTMethods-protocol value must be a string', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('value must be a string');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                                it('should fail: only HTTP and HTTPS values are allowed', function(done){
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
                                    editorHelper.setValue(definition);
                                    editorHelper.getErrorLineMessage().then(function (list){
                                        var line = list[0], message = list[1];
                                        expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                        expect(line).to.eql('8');
                                        done();
                                    });
                                });

                            }); // protocols

                        }); // options

                    }); // RTMethods

                }); //resourceTypes

                describe('schemas', function(){

                    it('should fail: schemas property must be an array', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: Test',
                            'schemas:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('schemas property must be an array');
                            expect(line).to.eql('4');
                            done();
                        });
                    });

                    it('should fail: root property already used schemas', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'schemas: []',
                            'schemas:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'schemas\'');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                }); //schemas

                describe('securitySchemes', function(){

                    it('should fail: root property already used securitySchemes', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'securitySchemes: []',
                            'securitySchemes:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'securitySchemes\'');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                }); //securitySchemes

                describe('protocols', function(){

                    it('should fail: root property already used protocol', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'protocols: []',
                            'protocols:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('root property already used: \'protocols\'');
                            expect(line).to.eql('5');
                            done();
                        });
                    });


                    it('should fail: protocol property must be an array', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'protocols:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('property must be an array');
                            expect(line).to.eql('4');
                            done();
                        });
                    });


                    it('should fail: protocol value must be a string', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'protocols:',
                            '  - '
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('value must be a string');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                    it('should fail: only HTTP and HTTPS values are allowed', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'protocols:',
                            '  - htt'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('only HTTP and HTTPS values are allowed');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                }); //protocols

            }); //describeRootSection

            describe('Resource', function(){

                describe('Resource attributes', function(){

                    describe('type',function(){

                        it('should fail: unused parameter param1_called from a resource', function(done){
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
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('unused parameter: param1');
                                expect(line).to.eql('14');
                                done();
                            });
                        });

                    }); //type

                    it('should fail: property protocols is invalid in a resource', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            '/rt1:',
                            '  protocols:'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql('property: \'protocols\' is invalid in a resource');
                            expect(line).to.eql('5');
                            done();
                        });
                    });

                }); // Resource attributes

                describe('Methods', function(){

                    describe('get', function(){

                        it('should fail with displayName property', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  get:',
                                '    displayName:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property: \'displayName\' is invalid in a method');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        it('should fail: method already declared: get', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  get:',
                                '  get:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'get\'');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                         describe('protocols', function(){

                            it('should fail: Rget-protocols property already used protocol', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  get:',
                                    '    protocols: []',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property already used: \'protocols\'');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rget-protocol property must be an array', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  get:',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property must be an array');
                                    expect(line).to.eql('6');
                                    done();
                                });
                            });

                            it('should fail: Rget-protocol value must be a string', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  get:',
                                    '    protocols:',
                                    '      - '
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('value must be a string');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rget-protocols only HTTP and HTTPS values are allowed', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  get:',
                                    '    protocols:',
                                    '      - htt'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                        }); // protocols


                    }); //get

                    describe('put',function(){

                        it('should fail with displayName property', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  put:',
                                '    displayName:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property: \'displayName\' is invalid in a method');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        it('should fail: method already declared: put', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  put:',
                                '  put:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            //ptor.sleep(500);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'put\'');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        describe('protocols', function(){

                            it('should fail: Rput-protocols property already used protocol', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  put:',
                                    '    protocols: []',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property already used: \'protocols\'');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rput-protocol property must be an array', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  put:',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property must be an array');
                                    expect(line).to.eql('6');
                                    done();
                                });
                            });

                            it('should fail: Rput-protocol value must be a string', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  put:',
                                    '    protocols:',
                                    '      - '
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('value must be a string');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rput-protocols only HTTP and HTTPS values are allowed', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  put:',
                                    '    protocols:',
                                    '      - htt'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                        }); // protocols

                    }); //put

                    describe('head',function(){

                        it('should fail with displayName property', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  head:',
                                '    displayName:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property: \'displayName\' is invalid in a method');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        it('should fail: method already declared: head', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  head:',
                                '  head:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'head\'');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        describe('protocols', function(){

                            it('should fail: Rhead-protocols property already used protocol', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  head:',
                                    '    protocols: []',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property already used: \'protocols\'');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rhead-protocols property must be an array', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  head:',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property must be an array');
                                    expect(line).to.eql('6');
                                    done();
                                });
                            });

                            it('should fail: Rhead-protocol value must be a string', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  head:',
                                    '    protocols:',
                                    '      - '
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('value must be a string');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rhead-protocols only HTTP and HTTPS values are allowed', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  head:',
                                    '    protocols:',
                                    '      - htt'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                        }); // protocols

                    }); //head

                    describe('options',function(){

                        it('should fail with displayName property', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  options:',
                                '    displayName:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property: \'displayName\' is invalid in a method');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        it('should fail: method already declared: options', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  options:',
                                '  options:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'options\'');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        describe('protocols', function(){

                            it('should fail: Roptions-protocols property already used protocol', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  options:',
                                    '    protocols: []',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property already used: \'protocols\'');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Roptions-protocol property must be an array', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  options:',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property must be an array');
                                    expect(line).to.eql('6');
                                    done();
                                });
                            });

                            it('should fail: Roptions-protocol value must be a string', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  options:',
                                    '    protocols:',
                                    '      - '
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('value must be a string');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Roptions-protocols only HTTP and HTTPS values are allowed', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  options:',
                                    '    protocols:',
                                    '      - htt'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                        }); // protocols

                    }); //options

                    describe('post',function(){

                        it('should fail with displayName property', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  post:',
                                '    displayName:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property: \'displayName\' is invalid in a method');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        it('should fail: method already declared: post', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  post:',
                                '  post:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'post\'');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        describe('protocols', function(){

                            it('should fail: Rpost-protocols property already used protocol', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  post:',
                                    '    protocols: []',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property already used: \'protocols\'');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rpost-protocol property must be an array', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  post:',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property must be an array');
                                    expect(line).to.eql('6');
                                    done();
                                });
                            });

                            it('should fail: Rpost-protocol value must be a string', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  post:',
                                    '    protocols:',
                                    '      - '
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('value must be a string');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rpost-protocols only HTTP and HTTPS values are allowed', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  post:',
                                    '    protocols:',
                                    '      - htt'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                        }); // protocols

                    }); //post

                    describe('delete',function(){

                        it('should fail with displayName property', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  delete:',
                                '    displayName:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property: \'displayName\' is invalid in a method');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        it('should fail: method already declared: delete', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  delete:',
                                '  delete:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'delete\'');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        describe('protocols', function(){

                            it('should fail: Rdelete-protocols property already used protocol', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  delete:',
                                    '    protocols: []',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property already used: \'protocols\'');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rdelete-protocol property must be an array', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  delete:',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property must be an array');
                                    expect(line).to.eql('6');
                                    done();
                                });
                            });

                            it('should fail: Rdelete-protocol value must be a string', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  delete:',
                                    '    protocols:',
                                    '      - '
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('value must be a string');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rdelete-protocols only HTTP and HTTPS values are allowed', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  delete:',
                                    '    protocols:',
                                    '      - htt'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                        }); // protocols
                    }); //delete

                    describe('patch',function(){

                        it('should fail with displayName property', function(done){ //RT-300
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  patch:',
                                '    displayName:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('property: \'displayName\' is invalid in a method');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        it('should fail: method already declared: patch', function(done){
                            var definition = [
                                '#%RAML 0.8',
                                '---',
                                'title: miapi',
                                '/r1:',
                                '  patch:',
                                '  patch:'
                            ].join('\\n');
                            editorHelper.setValue(definition);
                            editorHelper.getErrorLineMessage().then(function (list){
                                var line = list[0], message = list[1];
                                expect(message).to.eql('method already declared: \'patch\'');
                                expect(line).to.eql('6');
                                done();
                            });
                        });

                        describe('protocols', function(){

                            it('should fail: Rpatch-protocols property already used protocol', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  patch:',
                                    '    protocols: []',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property already used: \'protocols\'');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rpatch-protocol property must be an array', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  patch:',
                                    '    protocols:'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('property must be an array');
                                    expect(line).to.eql('6');
                                    done();
                                });
                            });

                            it('should fail: Rpatch-protocol value must be a string', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  patch:',
                                    '    protocols:',
                                    '      - '
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('value must be a string');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                            it('should fail: Rpatch-protocols only HTTP and HTTPS values are allowed', function(done){
                                var definition = [
                                    '#%RAML 0.8',
                                    '---',
                                    'title: My API',
                                    '/reso:',
                                    '  patch:',
                                    '    protocols:',
                                    '      - htt'
                                ].join('\\n');
                                editorHelper.setValue(definition);
                                editorHelper.getErrorLineMessage().then(function (list){
                                    var line = list[0], message = list[1];
                                    expect(message).to.eql('only HTTP and HTTPS values are allowed');
                                    expect(line).to.eql('7');
                                    done();
                                });
                            });

                        }); // protocols

                    }); //patch

                }); // Methods

            }); //Resource

        }); //Editor Error validation

});//RAMLeditor - Parser errors validation

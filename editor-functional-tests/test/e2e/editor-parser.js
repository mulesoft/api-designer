var util = require('util');
var expect = require('expect.js');
var protractor = require('../../node_modules/protractor/lib/protractor.js');
var webdriver = require('selenium-webdriver');
var EditorHelper = require('../lib/editor-helper.js').EditorHelper;
var j0hnQa = 'https://j0hnqa.mulesoft.org/';
var ramlUrl = require('../config').url;


describe('RAMLeditor - Parser errors validation',function(){
    this.timeout(80000);
    var driver, ptor, editorHelper;
  
     before(function(){
        driver = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.chrome()).build();
        // driver = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.phantomjs()).build();
        driver.manage().timeouts().setScriptTimeout(80000);
        ptor = protractor.wrapDriver(driver);
        editorHelper = new EditorHelper(ptor, driver);
    });

    after(function(done){

        driver.quit().then(function(){done()});

    })

    describe('include',function(){

        it('should fail: file circular reference', function(done) {
            //the file need to be uploaded in the server.
            ptor.get(ramlUrl);
            var definition = [
                '#%RAML 0.8',
                '---',
                'title: !include example.raml'
            ].join('\\n');
            editorHelper.setValue(definition);
            editorHelper.getErrorLineMessage().then(function (list){
                var line = list[0], message = list[1];
                expect(message).to.eql("detected circular !include of example.raml");
                expect(line).to.eql("3");
                done(); 
            });
        });

        it('should fail: file name/URL cannot be null', function(done) {            
            ptor.get(ramlUrl);
            var definition = [
                '#%RAML 0.8',
                '---',
                'title: !include'
            ].join('\\n');
            editorHelper.setValue(definition);
            editorHelper.getErrorLineMessage().then(function (list){
                var line = list[0], message = list[1];
                expect(message).to.eql("file name/URL cannot be null");
                expect(line).to.eql("3");
                done(); 
            });
        });

        it('should fail: test ', function(done) {
            ptor.get(ramlUrl);
            var definition = [
                '#%RAML 0.8',
                '---',
                'title: !include http://some.broken.link.com'
            ].join('\\n');
            editorHelper.setValue(definition);
            editorHelper.getErrorLineMessage().then(function (list){
                var line = list[0], message = list[1];                
                expect(message).to.match(/cannot fetch http:\/\/some.broken.link.com ([^)]+)/);
                expect(line).to.eql("3");
                done(); 
            });
        });

    }); //include
  
    describe('Editor Error validation', function() {      
                                                                
            describe('Root Section', function(){

            
                it('should fail: unsupported raml version #%RAML 0.1', function(done) {
                    ptor.get(ramlUrl);
                    var definition = [
                        '#%RAML 0.1'       
                    ].join('\\n');                  
                    editorHelper.setValue(definition);
                    editorHelper.getErrorLineMessage().then(function (list){
                        var line = list[0], message = list[1];
                        expect(message).to.eql("Unsupported RAML version: '#%RAML 0.1'");
                        expect(line).to.eql("1");
                        done(); 
                    });                  
                });                 

                it('should fail: document must be a map---', function(done) {
                    ptor.get(ramlUrl);
                    var definition = [
                        '#%RAML 0.8',
                        '---'
                    ].join('\\n');
                    editorHelper.setValue(definition);
                    editorHelper.getErrorLineMessage().then(function (list){
                        var line = list[0], message = list[1];
                        expect(message).to.eql("document must be a map");
                        expect(line).to.eql("2");
                        done(); 
                    });         
                });

                it('should fail: document must be a map(titl)', function(done){
                    ptor.get(ramlUrl);
                    var definition = [
                        '#%RAML 0.8',
                        '---',
                        'titl'
                    ].join('\\n');                                              
                    editorHelper.setValue(definition);
                    editorHelper.getErrorLineMessage().then(function (list){
                        var line = list[0], message = list[1];
                        expect(message).to.eql("document must be a map");
                        expect(line).to.eql("3");
                        done(); 
                    }); 
                });
                
                it('should fail: empty document (only comments)', function(done){
                    ptor.get(ramlUrl);
                    var definition = [
                        '#%RAML 0.8',
                        '#---'
                    ].join('\\n');
                    editorHelper.setValue(definition); 
                    editorHelper.getErrorLineMessage().then(function (list){
                        var line = list[0], message = list[1];
                        expect(message).to.eql("empty document");
                        expect(line).to.eql("1");
                        done(); 
                    }); 
                });

                it('should fail: block map end ...', function(done){
                    ptor.get(ramlUrl);
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
                        expect(message).to.eql("expected '<document start>', but found <block mapping end>");
                        expect(line).to.eql("5");
                        done(); 
                    }); 
                });

                describe('title',function(){

                    it('should fail: root property already used title', function(done){
                        ptor.get(ramlUrl);
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',                                                        
                            'title:'
                        ].join('\\n');
                        editorHelper.setValue(definition);   
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql("root property already used: 'title'");
                            expect(line).to.eql("4");
                            done(); 
                        }); 
                    });

                    it('should fail: missing title', function(done){
                        ptor.get(ramlUrl);
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'version: v1'
                        ].join('\\n');
                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql("missing title");
                            expect(line).to.eql("3");
                            done(); 
                        }); 
                    });

                }); //Title

                describe('version',function(){

                    it('**** should fail: root property already used version', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("root property already used: 'version'");
                            expect(line).to.eql("5");
                            done(); 
                        });
                    });
                                      
                    it('should fail: missing version', function(done){
                        ptor.get(ramlUrl);
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: hola',                          
                            'baseUri: http://server/api/{version}'                          
                        ].join('\\n');

                        editorHelper.setValue(definition);
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql("missing version");
                            expect(line).to.eql("3");
                            done(); 
                        });        
                    });

                }); //Version
    
                describe('baseUri',function(){

                    it('should fail: root property already used baseUri', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("root property already used: 'baseUri'");
                            expect(line).to.eql("5");
                            done(); 
                        });
                    });

                }); //baseUri

                describe('baseUriParameters',function(){

                    it('should fail: root property already used baseUriParameters', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("root property already used: 'baseUriParameters'");
                            expect(line).to.eql("5");
                            done(); 
                        });
                    });

                    it('should fail: invalid map - baseUriParameters/Uri1/{require}', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("URI parameter must be a map");
                            expect(line).to.eql("7");
                            done(); 
                        });                     
                    });

                    it('should fail: baseUriParameter - version parameter not allowed here', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("version parameter not allowed here");
                            expect(line).to.eql("7");
                            done(); 
                        });      
                    });

                    it('should fail when no baseUri is defined', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("uri parameters defined when there is no baseUri");
                            expect(line).to.eql("5");
                            done(); 
                        });      
                    });

                    it('should fail: uri parameter unused', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("hola uri parameter unused");
                            expect(line).to.eql("6");
                            done(); 
                        });      
                    });

                }); //baseUriParameters
    
                describe('mediaType',function(){

                    it('should fail: root property already used mediaType', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("root property already used: 'mediaType'");
                            expect(line).to.eql("5");
                            done(); 
                        });   
                    });

                }); //mediaType             

                describe('Documentation',function(){

                    it('should fail: Documentation - unkown property Documentation', function(done){
                        ptor.get(ramlUrl);
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'Documentation:'
                        ].join('\\n');
                        editorHelper.setValue(definition);      
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql("unknown property Documentation");
                            expect(line).to.eql("4");
                            done(); 
                        }); 
                    });

                    it('should fail: documentation must be an array', function(done){
                        ptor.get(ramlUrl);
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: My API',
                            'documentation:'
                        ].join('\\n');
                        editorHelper.setValue(definition);    
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql("documentation must be an array");
                            expect(line).to.eql("4");
                            done(); 
                        }); 
                    });
                    
                    it('should fail: each documentation section must be a map', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("each documentation section must be a map");
                            expect(line).to.eql("5");
                            done(); 
                        });                 
                    });

                    it('should fail: title must be a string', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("title must be a string");
                            expect(line).to.eql("5");
                            done(); 
                        });     
                    });

                    it('should fail: content must be a string', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("content must be a string");
                            expect(line).to.eql("5");
                            done(); 
                        });                     
                    });

                    it('should fail: a documentation entry must have a content property', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("a documentation entry must have content property");
                            expect(line).to.eql("5");
                            done(); 
                        });                     
                    });

                    it('should fail: a documentation entry must have title property', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("a documentation entry must have title property");
                            expect(line).to.eql("5");
                            done(); 
                        });                         
                    });

                    it('should fail: root property already used documentation', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("root property already used: 'documentation'");
                            expect(line).to.eql("7");
                            done(); 
                        });                         
                    });

                    it('should fail: property already used title', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("property already used: 'title'");
                            expect(line).to.eql("6");
                            done(); 
                        });                                             
                    });

                    it('should fail: property already used content', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("property already used: 'content'");
                            expect(line).to.eql("7");
                            done(); 
                        });                                         
                    });

                }); //Documentation

                describe('traits',function(){

                    it('should fail: root property already used traits', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("root property already used: 'traits'");
                            expect(line).to.eql("5");
                            done(); 
                        });
                    });

                     it('should fail: parameter key cannot be used as a trait name', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("parameter key cannot be used as a trait name");
                            expect(line).to.eql("5");
                            done(); 
                        });
                    });

                    it.skip('should fail: array as key - trait - RT-313', function(done){ //RT-313
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("???");
                            expect(line).to.eql("?");
                            done(); 
                        });  
                    });

                }); //traits

                describe('resourceTyoes',function(){

                    it('should fail: root property already used resourceTypes', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("root property already used: 'resourceTypes'");
                            expect(line).to.eql("5");
                            done(); 
                        });
                    });

                    it('should fail: parameter key cannot be used as a resource type name', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("parameter key cannot be used as a resource type name");
                            expect(line).to.eql("5");
                            done(); 
                        });
                    });

                    it('should fail: unused parameter pp_declared on a RT', function(done){ //RT-300
                        ptor.get(ramlUrl);                  
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
                            expect(message).to.eql("unused parameter: pp");
                            expect(line).to.eql("9");
                            done(); 
                        });                         
                    });

                    it('should fail: it must be a mapping_diccionary', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("invalid resourceType definition, it must be a map");
                            expect(line).to.eql("6");
                            done(); 
                        });                                     
                    });

                    it('should fail: it must be a map', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("invalid resourceType definition, it must be a map");
                            expect(line).to.eql("5");
                            done(); 
                        });                                     
                    });

                    it('should fail: circular reference - between resource', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("circular reference of \"rt2\" has been detected: rt1 -> rt2 -> rt2");
                            expect(line).to.eql("8");
                            done(); 
                        });                                     
                    }); 

                }); //resourceTypes

                describe('schemas', function(){

                    it('should fail: schemas property must be an array', function(done){
                        var definition = [
                            '#%RAML 0.8',
                            '---',
                            'title: Test',
                            'schemas: '
                        ].join('\\n');            
                        editorHelper.setValue(definition);                                           
                        editorHelper.getErrorLineMessage().then(function (list){
                            var line = list[0], message = list[1];
                            expect(message).to.eql("schemas property must be an array");
                            expect(line).to.eql("4");
                            done(); 
                        });  
                    });

                    it('should fail: root property already used schemas', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("root property already used: 'schemas'");
                            expect(line).to.eql("5");
                            done(); 
                        });  
                    });

                }); //schemas

                describe('securitySchemes', function(){

                    it('should fail: root property already used securitySchemes', function(done){
                        ptor.get(ramlUrl);
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
                            expect(message).to.eql("root property already used: 'securitySchemes'");
                            expect(line).to.eql("5");
                            done(); 
                        });                 
                    });

                }); //securitySchemes

            }); //describeRootSection 

            describe('Resource', function(){

                describe('Resource attributes', function(){
                    
                    describe('type',function(){

                        it('should fail: unused parameter param1_called from a resource', function(done){ //RT-300
                            ptor.get(ramlUrl);
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
                                expect(message).to.eql("unused parameter: param1");
                                expect(line).to.eql("14");
                                done(); 
                            });                 
                        });

                    }); //type

                }); // Resource Parameters
                    
                describe('Methods', function(){

                    describe('get', function(){

                        it('should fail with displayName property', function(done){
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("property: 'displayName' is invalid in a method");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                        it('should fail: method already declared: get', function(done){
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("method already declared: 'get'");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                    }); //get

                    describe('put',function(){

                        it('should fail with displayName property', function(done){
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("property: 'displayName' is invalid in a method");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                        it('should fail: method already declared: put', function(done){
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("method already declared: 'put'");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                    }); //put

                    describe('head',function(){

                        it('should fail with displayName property', function(done){ //RT-300
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("property: 'displayName' is invalid in a method");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                        it('should fail: method already declared: head', function(done){
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("method already declared: 'head'");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                    }); //head

                    describe('options',function(){

                        it('should fail with displayName property', function(done){ 
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("property: 'displayName' is invalid in a method");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                        it('should fail: method already declared: options', function(done){
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("method already declared: 'options'");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                    }); //options

                    describe('post',function(){

                        it('should fail with displayName property', function(done){
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("property: 'displayName' is invalid in a method");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                        it('should fail: method already declared: post', function(done){
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("method already declared: 'post'");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                    }); //post

                    describe('delete',function(){

                        it('should fail with displayName property', function(done){
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("property: 'displayName' is invalid in a method");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                        it('should fail: method already declared: delete', function(done){
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("method already declared: 'delete'");
                                expect(line).to.eql("6");
                                done(); 
                            });                     
                        });

                    }); //delete

                    describe('patch',function(){

                        it('should fail with displayName property', function(done){ //RT-300
                            ptor.get(ramlUrl);                          
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
                                expect(message).to.eql("property: 'displayName' is invalid in a method");
                                expect(line).to.eql("6");
                                done(); 
                            });
                        });

                        it('should fail: method already declared: patch', function(done){
                            ptor.get(ramlUrl);
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
                                expect(message).to.eql("method already declared: 'patch'");
                                expect(line).to.eql("6");
                                done(); 
                            });
                        });

                    }); //patch

                }); // Methods

            }); //Resource

        }); //Editor Error validation   

});//RAMLeditor - Parser errors validation

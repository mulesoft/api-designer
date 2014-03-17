'use strict';
var EditorHelper = require ('./editor-helper.js').EditorHelper;
var ShelfHelper = require ('./shelf-helper.js').ShelfHelper;
var ConsoleHelper = require ('./console-helper.js').ConsoleHelper;
var webdriver = require('selenium-webdriver');
function AssertsHelper() {}

AssertsHelper.prototype = {};

var editor = new EditorHelper();
var shelf = new ShelfHelper();
var apiConsole = new ConsoleHelper();

//Editor Starts
AssertsHelper.prototype.parserError = function parserError(vLine, vMessage){
  var d = webdriver.promise.defer();
  editor.getErrorLineMessage().then(function (list) {
    var line = list[0], message = list[1];
    expect(message).toEqual(vMessage);
    expect(line).toEqual(vLine);
    d.fulfill();
  });
  return d.promise;
};

AssertsHelper.prototype.checkSyntaxHignlight = function checkSyntaxHignlight(line,pos,text){
  //Line is editor line, pos , text is the highlight class
  line--;
  editor.getSHighlightClass(line,pos).then(function(classe){
    expect(classe).toEqual(text);
  });
};

AssertsHelper.prototype.checkHignlightAndSwimLines = function checkHignlightAndSwimLines(line,pos,text){
  //Line is editor line, pos , text is the highlight class
  line--;
  editor.getSyntaxIndentClassArray(line,pos).then(function(classes){
    expect(classes).toEqual(text);
  });
};

AssertsHelper.prototype.editorCheckFileNameInList = function editorCheckFileNameInList(fileName){
  editor.getFileList().then(function(lista){
    expect(fileName in lista).toEqual(true);
  });
};

AssertsHelper.prototype.editorCheckFileNameNotInList = function editorCheckFileNameInList(fileName){
  editor.getFileList().then(function(lista){
    expect(fileName in lista).toEqual(false);
  });
};

AssertsHelper.prototype.editorCheckNotificationBarIsDisplayed = function editorCheckNotificationBarIsDisplayed(){
  editor.getNotificationBar().then(function(notBar){
//  var notBar = browser.findElements(by.css('[role="notifications"]'));
    console.log('notBar',notBar);
    expect(notBar[0].getAttribute('class')).toEqual('hola');
  });
};
//Editor Ends

//Console Starts
AssertsHelper.prototype.consoleSectionIsHidden= function consoleSectionIsHidden(){
  var consoleApi = new ConsoleHelper();
  expect(browser.$(consoleApi.consoleSection).getAttribute('class')).toEqual('ng-hide');
};

AssertsHelper.prototype.consoleApiTitle= function consoleApiTitle(title){
  var consoleApi = new ConsoleHelper();
  expect($(consoleApi.titleCss).getText()).toEqual(title);
};

AssertsHelper.prototype.consoleResourceGroupCollapsedExpanded = function consoleResourceGroupCollapsedExpanded(collapsedExpanded){

  element.all(by.css('[role="resource-group"]')).then(function(resourcesGroup){
    resourcesGroup.forEach(function(resgroup){
      expect(resgroup.getAttribute('class')).toEqual(collapsedExpanded);
    });
  });
};

AssertsHelper.prototype.consoleResourceGroupCollapsedExpandedArray = function consoleResourceGroupCollapsedExpanded(collapsedExpanded){
  var i = 0;
  element.all(by.css('[role="resource-group"]')).then(function(resourcesGroup){
    resourcesGroup.forEach(function(resgroup){
      var t = i++;
      expect(resgroup.getAttribute('class')).toEqual(collapsedExpanded[t]);
    });
  });
};

AssertsHelper.prototype.consoleValidateBodyMediaTypes = function consoleValidateBodyMediaTypes(expList){
  var i=0;
  var d = webdriver.promise.defer();
  apiConsole.getrequestTabBodyMediaTypeList().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function (element) {
      var t = i++;
      expect(element.getText()).toEqual(expList[t]);
      if (t === list.length){
        d.fulfill();
      }
    });
  });
  return d.promise;
};

AssertsHelper.prototype.consoleMainResources = function consoleMainResources(expList){
  var consoleApi = new ConsoleHelper();
  var i = 0;
  var d = webdriver.promise.defer();
  consoleApi.getListMainResources().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
      if (t === expList.length){
        d.fulfill();
      }
    });
  });
  return d.promise;
};

AssertsHelper.prototype.consoleResources = function consoleResources(expList){
  var consoleApi = new ConsoleHelper();
  var i = 0;
  consoleApi.getListResourcesName().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
    });
  });
};

AssertsHelper.prototype.consoleResourcesDescription = function consoleResourcesDescription(expList){
  var consoleApi = new ConsoleHelper();
  var i = 0;
  consoleApi.getListResourcesDescription().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
    });
  });
};

AssertsHelper.prototype.consoleResourceDescription = function consoleResourceDescription(descriptions){
  var i =0;
  var apiConsole = new ConsoleHelper();
  element.all(by.css(apiConsole.listResourcesCss)).then(function(resources){
    expect(resources.length).toEqual(descriptions.length);
    resources.forEach(function(resource){
      var t = i++;
      resource.findElements(by.css(apiConsole.listResourceDescriptionCss)).then(function(description){
        expect(description.length).toEqual(1);
        expect(description[0].getText()).toEqual(descriptions[t]);
      });
    });
  });
};

AssertsHelper.prototype.consoleValidateMethodDescription = function consoleValidateMethodDescription(description){
  var apiConsole = new ConsoleHelper();
  apiConsole.getMethodDescription().then(function(desc){
    expect(desc[0].getText()).toEqual(description);
  });
};

AssertsHelper.prototype.isResourceCollapsedByPos = function isResourceCollapsedByPos(pos){
  var d = webdriver.promise.defer();
  pos --;
  if(pos ===-1){
    // check that all resources are collapsed
    d.fulfill();
  }else{
    element.all(by.css('[role="api-console"] [role="resource"] [role="resource-summary"] [ng-show="resourceView.expanded"]')).then(function(resources){
      expect(resources[pos].getAttribute('class')).toEqual('trait ng-scope ng-binding ng-hide');
      d.fulfill();
    });
  }
  return d.promise;
};

AssertsHelper.prototype.consoleResourcesMethods = function consoleResourcesMethods(expList){
  var consoleApi = new ConsoleHelper();
  var i=0;
  consoleApi.getListMethods().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
    });
  });
};

AssertsHelper.prototype.consoleResourceName = function consoleResourceName(expList){
  element.all(by.css('[role="resource"]')).then(function(resources){
    var i =0;
    expect(resources.length).toEqual(expList.length);
    resources.forEach(function(resource){
      var t = i++;
      resource.findElements(by.css('h3')).then(function(h3){
        expect(h3.length).toEqual(1);
        expect(h3[0].getText()).toEqual(expList[t]);
      });
    });
  });
};

AssertsHelper.prototype.consoleResourceMethods = function consoleResourceMethods(expList){
  element.all(by.css('[role="resource"]')).then(function(resources){
    var i =0;
    resources.forEach(function(resource){
      var t = i++;
      resource.findElements(by.css('[role="methods"] li')).then(function(methods){
        expect(methods.length).toEqual(expList['r'+t].length);
        var j = 0;
        methods.forEach(function(method){
          expect(method.getText()).toEqual(expList['r'+t][j]);
          j++;
        });
      });
    });
  });
};

AssertsHelper.prototype.consoleResourceResourceType = function consoleResourceResourceType(expList){
  var d = webdriver.promise.defer();
  element.all(by.css('[role="resource"]')).then(function(resources){
    var i =0;
    expect(resources.length).toEqual(expList.length);
    resources.forEach(function(resource){
      var t = i++;
      resource.findElements(by.css('[role="resource-type"]')).then(function(h3){
        expect(h3.length).toEqual(1);
        expect(h3[0].getText()).toEqual(expList[t]);
        if (t === expList.length){
          d.fulfill();
        }
      });
    });
  });

  return d.promise;
};

AssertsHelper.prototype.consoleResourceTraits = function consoleResourceTraits(expList){
  element.all(by.css('[role="resource"]')).then(function(resources){
    var i =0;
    resources.forEach(function(resource){
      var t = i++;
      resource.findElements(by.css('[role="trait"]')).then(function(traits){
        expect(traits.length).toEqual(expList['r'+t].length);
        var j = 0;
        traits.forEach(function(trait){
          expect(trait.getText()).toEqual(expList['r'+t][j]);
          j++;
        });
      });
    });
  });
};

AssertsHelper.prototype.consoleValidateDocumentationSectionPlainText = function consoleValidateDocumentationSectionPlainText(expTitle, expContent){
  var d = webdriver.promise.defer();
  apiConsole.getDocumentationSections().then(function(sections){
    expect(sections.length).toEqual(expTitle.length);
    var i = 0;
    sections.forEach(function(section){
      var p = i++;
      section.findElement(by.css('h2')).then(function(title){
        expect(title.getText()).toEqual(expTitle[p]);
        title.click();
      });
      section.findElement(by.css('p')).then(function(content){
        expect(content.getText()).toEqual(expContent[p]);
      });
      if(p === section.length){
        d.fulfill();
      }
    });
  });
  return d.promise;
};

  // method start
AssertsHelper.prototype.consoleValidateCurrentMethodName = function consoleValidateCurrentMethodName(name){
  apiConsole.getCurrentMethod().getText().then(function(text){
    expect(text).toEqual(name);
  });
};

AssertsHelper.prototype.consoleValidateActiveTab = function consoleValidateActiveTab(activeTabName){
  apiConsole.getActiveTab().getText().then(function(text){
    expect(text).toEqual(activeTabName);
  });
};


AssertsHelper.prototype.consoleMethodValidateAllTabDisable = function consoleMethodValidateAllTabDisable (expList){
//  exp list has the method in apperCase and the tabs disabled
  var apiConsole = new ConsoleHelper();
  var d = webdriver.promise.defer();
  var i = 0;
  element.all(by.css(apiConsole.currentDisabledTabs)).then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
      if(t === expList.length){
        d.fulfill();
      }
    });
  });
  return d.promise;
};

  //request tab
AssertsHelper.prototype.consoleValidateHeadersH2 = function consoleValidateHeadersH2 (option){
  var d = webdriver.promise.defer();

  var dic = {
    'uriParameters' : function(){
      apiConsole.getrequestTabUriParametersh2().getText().then(function(text){
        expect(text).toEqual('URI Parameters');
        d.fulfill();
      });
    },
    'headers': function(){
      apiConsole.getrequestTabHeaderh2().getText().then(function(text){
        expect(text).toEqual('Headers');
        d.fulfill();
      });
    },
    'queryParameters' : function(){
      apiConsole.getrequestTabQueryParametersh2().getText().then(function(text){
        expect(text).toEqual('Query Parameters');
        d.fulfill();
      });
    },
    'Body' : function (){
      apiConsole.getrequestTabBodyh2().getText().then(function(text){
        expect(text).toEqual(option);
        d.fulfill();
      });
    }
  };

  dic[option]();
  return d.promise;
};

AssertsHelper.prototype.consoleValidateHeadersDisplayNameList = function consoleValidateHeadersDisplayNameList (option,expList){
  var d = webdriver.promise.defer();
  var apiConsole = new ConsoleHelper();
  var i = 0;
  var dic = {
    'uriParameters' : function() {
      element.all(by.css(apiConsole.requestTabUriParametersListDisplayName)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    },
    'headers': function() {
      element.all(by.css(apiConsole.requestTabHeadersListDisplayName)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    },
    'queryParameters' : function() {
      element.all(by.css(apiConsole.requestTabQueryParametersListDisplayName)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    },
    'Body' : function(){
      element.all(by.css(apiConsole.requestTabBodyDisplayNameListNP)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    }
  };
  dic[option]();
  return d.promise;
};

AssertsHelper.prototype.consoleValidateHeadersDescription = function consoleValidateHeadersDescription (option,expList){
  var d = webdriver.promise.defer();
  var apiConsole = new ConsoleHelper();
  var i = 0;
  var dic = {
    'uriParameters' : function() {
      element.all(by.css(apiConsole.requestTabUriParametersDescription)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    },
    'headers': function() {
      element.all(by.css(apiConsole.requestTabHeadersDescription)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    },
    'queryParameters' : function() {
      element.all(by.css(apiConsole.requestTabQueryParametersDescription)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    },
    'Body': function(){
      element.all(by.css(apiConsole.requestTabBodyDescriptionNP)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    }
  };
  dic[option]();
  return d.promise;
};

AssertsHelper.prototype.consoleValidateHeadersConstraints = function consoleValidateHeadersConstraints (option,expList){
  var d = webdriver.promise.defer();
  var apiConsole = new ConsoleHelper();
  var i = 0;
  var dic = {
    'uriParameters' : function() {
      element.all(by.css(apiConsole.requestTabUriParametersConstraints)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    },
    'headers': function() {
      element.all(by.css(apiConsole.requestTabHeadersConstraints)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    },
    'queryParameters' : function() {
      element.all(by.css(apiConsole.requestTabQueryParametersConstraints)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    },
    'Body': function(){
      element.all(by.css(apiConsole.requestTabBodyConstraintsNP)).then(function(list){
        expect(list.length).toEqual(expList.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expList[t]);
          if(t === expList.length){
            d.fulfill();
          }
        });
      });
    }
  };
  dic[option]();
  return d.promise;
};

AssertsHelper.prototype.consoleValidaActiveMediaTypeByPos = function consoleValidaActiveMediaTypeByPos (pos){
  browser.all(apiConsole.requestTabBodyMediaTypeListStatus).then(function(list){
    expect(list[pos].getAttribute('class')).toEqual('expanded ng-hide');
  });
};

// response tab

AssertsHelper.prototype.checkResponseNavSubmenuTitle= function consoleApiTitle(title){
  expect($(apiConsole.responseNavSubmenuTitle).getText()).toEqual(title);
};

AssertsHelper.prototype.checkSubNavResponseCodeList = function checkSubNavResponseCodeList(expList){
  var i = 0;
  var d =  webdriver.promise.defer();
  apiConsole.getListOfResponseCode().then(function(list){

    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
      if (t === expList.length){
        d.fulfill();
      }
    });

  });
  return d.promise;
};

AssertsHelper.prototype.checkResponseCodeHeaderList = function checkResponseCodeHeaderList(expList){
//  getListResponseCodeHeader
  var i = 0;
  var d =  webdriver.promise.defer();
  apiConsole.getListResponseCodeHeader().then(function(list){

    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
      if (t === expList.length){
        d.fulfill();
      }
    });

  });
  return d.promise;
};

AssertsHelper.prototype.checkResponseCodeDescriptionList = function checkResponseCodeDescriptionList(expList){
  var i = 0;
  var d =  webdriver.promise.defer();
  apiConsole.getListResponseCodeDescription().then(function(list){

    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
      if (t === expList.length){
        d.fulfill();
      }
    });

  });
  return d.promise;
};

AssertsHelper.prototype.consoleValidateREsponseTabHeadersH2 = function consoleValidateREsponseTabHeadersH2 (option){
  var d = webdriver.promise.defer();
  var i = 0;
  var dic = {
    'headers': function(){
      apiConsole.getresponseCodeHeadersh2List().then(function(list){
        list.forEach(function(elem){
          elem.getText().then(function(text){
            var t = i++;
            expect(text).toEqual('Headers');
            if (t===list.length){
              d.fulfill();
            }
          });
        });
      });
    },
    'Body' : function (){
      apiConsole.getresponseCodeBodyh2List().then(function(list){
        list.forEach(function(elem){
          elem.getText().then(function(text){
            var t = i++;
            expect(text).toEqual(option);
            if (t===list.length){
              d.fulfill();
            }
          });
        });
      });
    },
    'EXAMPLE': function(){
      apiConsole.getBodyExampleh5().then(function(list){
        list.forEach(function(elem){
          elem.getText().then(function(text){
            var t = i++;
            expect(text).toEqual(option);
            if (t===list.length){
              d.fulfill();
            }
          });
        });
      });
    },
    'SCHEMA' : function(){
//      this is displayed after clicking on Show Schema link
      apiConsole.getBodySchemah5().then(function(list){
        list.forEach(function(elem){
          elem.getText().then(function(text){
            var t = i++;
            expect(text).toEqual(option);
            if (t===list.length){
              d.fulfill();
            }
          });
        });
      });
    }

  };

  dic[option]();
  return d.promise;
};

AssertsHelper.prototype.consoleValidateExampleSchemaContent = function consoleValidateExampleSchemaContent (option, expList){
  var d = webdriver.promise.defer();
  var i = 0;
  var dic = {
    'example': function(){
      apiConsole.getBodyExampleContentList().then(function(list){
        list.forEach(function(example){
          var t = i++;
          example.findElements(by.css('pre')).then(function(lines){
            var texto = '';
            var c = 1;
            lines.forEach(function(line){
              line.getText().then(function(ttt){
                var j = c++;
                texto += ttt;
                if(j===lines.length){
                  expect(texto).toEqual(expList[t]);
                  if (t===list.length){
                    d.fulfill();
                  }
                }
              });
            });
          });
        });
      });
    },
    'schema' : function (){
      apiConsole.getBodySchemaContentList().then(function(list){
        list.forEach(function(example){
          var t = i++;
          example.findElements(by.css('pre')).then(function(lines){
            var texto = '';
            var c = 1;
            lines.forEach(function(line){
              line.getText().then(function(ttt){
                var j = c++;
                texto += ttt;
                if(j===lines.length){
                  expect(texto).toEqual(expList[t]);
                  if (t===list.length){
                    d.fulfill();
                  }
                }
              });
            });
          });
        });
      });
    }
  };

  dic[option]();
  return d.promise;
};

AssertsHelper.prototype.consoleCheckSchemaLinksAreHiddenByPos = function consoleCheckSchemaLinksAreHiddenByPos(pos) {
  var d = webdriver.promise.defer();
  pos --;
  var i = 0;

  element.all(by.css(apiConsole.bodySchemaLink)).then(function(list){
    if(pos=== -1){
      list.forEach(function(elem){
        var t = i++;
        expect(elem.getAttribute('class')).toEqual('schema-toggle ng-hide');
        if(t===list.length){
          d.fulfill();
        }
      });

    } else {
      expect(list[pos].getAttribute('class')).toEqual('expanded ng-hide');
      d.fulfill();

    }
  });
  return d.promise;
};

// try it tab

AssertsHelper.prototype.consoleValidateTryPath= function consoleApiTitle(mockServ, path){
//    this is not checking the uriPArameters fields - just the text
  if (mockServ){
    expect($(apiConsole.tryItPath).getText()).toMatch(/http:\/\/mocksvc.mulesoft.com\/mocks\/.*/);
  } else {
    expect($(apiConsole.tryItPath).getText()).toEqual(path);

  }

};

AssertsHelper.prototype.consoleValidateTryItH2 = function consoleValidateTryItH2 (option){
  var d = webdriver.promise.defer();
  var dic = {
    'authentication' : function(){
      apiConsole.getTryItAuthenticationh2().getText().then(function(text){
        expect(text).toEqual('Authentication');
        d.fulfill();
      });
    },
    'uriParameters' : function(){
      apiConsole.getrequestTabUriParametersh2().getText().then(function(text){
        expect(text).toEqual('URI Parameters');
        d.fulfill();
      });
    },
    'headers': function(){
      apiConsole.getTryItHeadersh2().getText().then(function(text){
        expect(text).toEqual('Headers');
        d.fulfill();
      });
    },
    'queryParameters' : function(){
      apiConsole.getTryItQueryParametersh2().getText().then(function(text){
        expect(text).toEqual('Query Parameters');
        d.fulfill();
      });
    },
    'Body' : function (){
      apiConsole.getTryItBodyh2().getText().then(function(text){
        expect(text).toEqual(option);
        d.fulfill();
      });
    }
  };

  dic[option]();
  return d.promise;
};

AssertsHelper.prototype.consoleValidateTryItDisplayNameList = function consoleValidateTryItDisplayNameList(option,expDic){
  var d = webdriver.promise.defer();
  var apiConsole = new ConsoleHelper();
  var i = 0;
  var dic = {
    'headers': function() {
      element.all(by.css(apiConsole.tryItTabHeadersNameList)).then(function(list){
        expect(list.length).toEqual(expDic.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expDic[t].key);
          elem.findElements(by.css('span')).then(function(eleSpan){
            if(eleSpan[0]) {
              expect(eleSpan.length).toEqual(1);
              eleSpan[0].getAttribute('class').then(function(classe){
                expect(classe).toEqual('required ng-scope');
                expect(true).toEqual(expDic[t].required);
              });
            } else {
              expect(eleSpan.length).toEqual(0);
              expect(false).toEqual(expDic[t].required);
            }
          });
          if(t === expDic.length){
            d.fulfill();
          }
        });
      });
    },
    'queryParameters' : function() {
      element.all(by.css(apiConsole.tryItTabQueryParametersNameList)).then(function(list){
        expect(list.length).toEqual(expDic.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expDic[t].key);
          elem.findElements(by.css('span')).then(function(eleSpan){
            if(eleSpan[0]) {
              expect(eleSpan.length).toEqual(1);
              eleSpan[0].getAttribute('class').then(function(classe){
                expect(classe).toEqual('required ng-scope');
                expect(true).toEqual(expDic[t].required);
              });
            } else {
              expect(eleSpan.length).toEqual(0);
              expect(false).toEqual(expDic[t].required);
            }
          });
          if(t === expDic.length){
            d.fulfill();
          }
        });
      });
    },
    'Body' : function(){
      element.all(by.css(apiConsole.tryItTabBodyNameList)).then(function(list){
        expect(list.length).toEqual(expDic.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getText()).toEqual(expDic[t].key);
          elem.findElements(by.css('span')).then(function(eleSpan){
            if(eleSpan[0]) {
              expect(eleSpan.length).toEqual(1);
              eleSpan[0].getAttribute('class').then(function(classe){
                expect(classe).toEqual('required ng-scope');
                expect(true).toEqual(expDic[t].required);
              });
            } else {
              expect(eleSpan.length).toEqual(0);
              expect(false).toEqual(expDic[t].required);
            }
          });
          if(t === expDic.length){
            d.fulfill();
          }
        });
      });
    }
  };
  dic[option]();
  return d.promise;
};

AssertsHelper.prototype.consoleCheckFieldRequired = function consoleCheckFieldRequired(option,expDic){
  var d = webdriver.promise.defer();
  var apiConsole = new ConsoleHelper();
  var i = 0;
  var dic = {
    'headers': function() {
      element.all(by.css(apiConsole.tryItHeadersFieldsList)).then(function(list){
        expect(list.length).toEqual(expDic.length);
        list.forEach(function(elem){
          var t = i++;
          expect(elem.getAttribute('name')).toEqual(expDic[t].inputName);
          if(expDic[t].required){
            console.log('required??? '+ t, expDic[t].required);
            expect(elem.getAttribute('class')).toEqual('ng-valid ng-dirty warning');
          } else {
            console.log('required??? '+ t, expDic[t].required);
            expect(elem.getAttribute('class')).toEqual('ng-scope ng-pristine ng-valid');
          }
          if(t === expDic.length){
            d.fulfill();
          }
        });
      });
    },
    'queryParameters' : function() {
     
    },
    'Body' : function(){

    }
  };
  dic[option]();
  return d.promise;
};

AssertsHelper.prototype.validateValueSetHeaderByPos = function validateValueSetHeaderByPos(pos, value){
  apiConsole.getHeaderFieldList().then(function(list){
    expect(list[pos].getAttribute('value')).toEqual(value);
  });
};

AssertsHelper.prototype.validateValueSetQueParamByPos = function validateValueSetQueParamByPos(pos, value){
  apiConsole.getQuerParamFieldList().then(function(list){
    expect(list[pos].getAttribute('value')).toEqual(value);
  });
};

AssertsHelper.prototype.validateValueSetBodyByPos = function validateValueSetHeaderByPos(pos, value){
  apiConsole.getBodyFieldList().then(function(list){
    expect(list[pos].getAttribute('value')).toEqual(value);
  });
};

    //traits starts
AssertsHelper.prototype.consoleValidateMethodTraits = function consoleValidateMethodTraits(expList){
  var d = webdriver.promise.defer();
  var i =0;
  apiConsole.getMethodsTraits().then(function(traits){
    traits.forEach(function(trait){
      var t=i++;
      trait.getText().then(function(text){
        expect(text).toEqual(expList[t]);
        if (t===expList.length){
          d.fulfill();
        }
      });
    });
  });
  return d.promise;
};
    //traits ends

  // method ends

//Console Ends

//Shelf starts
AssertsHelper.prototype.shelfElementsx = function shelfElementsx(list, expList){
  expect(list.length).toEqual(expList.length);
  list.forEach(function(element){
    element.getText().then(function(text){
      expect(expList).toContain(text);
    });
  });
};

AssertsHelper.prototype.shelfElementsSlow = function shelfElementsSlow(expList){
  shelf = new ShelfHelper();
  shelf.getElements().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(element){
      element.getText().then(function(text){
        expect(expList).toContain(text);
      });
    });
  });
};

AssertsHelper.prototype.shelfElements = function shelfElements(expList){
  shelf = new ShelfHelper();
  var lista = shelf.getElements();
  expect(lista).toEqual(expList);
};

AssertsHelper.prototype.shelfElementsNotDisplayed = function shelfElementsNotDisplayed(list2, expList){
  var that = this;
  list2.forEach(function(element){
    if(element !== '#%RAML 0.8'){
      expList.splice(expList.indexOf(element), 1);
    }
  });
  that.shelfElements(expList);
};

AssertsHelper.prototype.shelfElementsNotDisplayedSlow = function shelfElementsNotDisplayedSlow(list2, expList){
  var that = this;
  list2.forEach(function(element){
    if(element !== '#%RAML 0.8'){
      expList.splice(expList.indexOf(element), 1);
    }
  });
  that.shelfElementsSlow(expList);
};

AssertsHelper.prototype.shelfElementsByGroupSlow = function shelfElementsByGroupSlow(groupInfo, byGroup){
  var that = this ;
  var j, dic1 = {}, dic2 = {} ;
  var d = webdriver.promise.defer();
  var i = 0;
  for (j = 0; j < groupInfo.length; j++) {
    dic1[groupInfo[j]] = false;
  }
  for (j = 0; j < byGroup.length; j++) {
    dic2[byGroup[j]] = false;
  }
  function afterAllThens(){
    var key1, value1, key2, value2;
    for (key1 in dic1) {
      value1 = dic1[key1];
      if (!value1) {
        console.log(JSON.stringify(dic1));
      }
      expect(value1).toEqual(true);
    }
    for (key2 in dic2){
      value2 = dic2[key2];
      if (!value2){
        console.log(JSON.stringify(dic2));
      }
      expect(value2).toEqual(true);
    }
    return d.fulfill();
  }
  shelf.getSections().then(function(sections){
    sections.forEach(function(section){
      var t = i++;
      section.getText().then(function(text){
        dic1[text] = true;
      }).then(function(){
        section.findElements(by.css(shelf.itemsInSection())).then(function(items){
          dic2[byGroup[t]]=true;
          that.shelfElementsx(items, byGroup[t]);
          if (t === sections.length -1){
            afterAllThens();
          }
        });
      });
    });
    expect(sections.length).toEqual(byGroup.length);
  });
};

AssertsHelper.prototype.ShelfElementsByGroup = function ShelfElementsByGroup(textByGroup){
  var text = browser.executeScript(function () {
    var t = $('[role="section"]').text();
    return  t.replace(/\s+/g,' ');
  });
  expect(text).toEqual(textByGroup);
};

AssertsHelper.prototype.shelfWithNoElements = function shelfWithNoElements(){
  shelf.getElements().then(function(list){
    expect(list.length).toEqual(0);
  });
};

AssertsHelper.prototype.shelfIsNotDisplayed = function shelfIsNotDisplayed(){
  element.all(by.css('[role="shelf"]')).then(function(shelf){
    expect(shelf[0].getAttribute('class')).toEqual('expanded ng-hide');
  });
};

AssertsHelper.prototype.shelfIsDisplayed = function shelfIsDisplayed(){
  element.all(by.css('[role="shelf"]')).then(function(shelf){
    expect(shelf[0].getAttribute('class')).toEqual('expanded');
  });
};
//Shelf ends

exports.AssertsHelper = AssertsHelper;

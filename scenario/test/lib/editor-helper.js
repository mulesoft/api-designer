'use strict';
var webdriver = require('selenium-webdriver');

function EditorHelper(){
  this.editorLinesListCssWithCol =  '.CodeMirror-code div[style="position: relative;"]';
  this.editorLinesListCss =  '.CodeMirror-code div[style="position: relative;"] pre';
  this.codeFoldingOpen = '.CodeMirror-foldgutter-open';
//  Syntax highlight
  this.keySHighlight = 'cm-key';
  this.traitTitleSHighlight= 'cm-trait-title';
  this.ramlTagSHighlight = 'cm-raml-tag';
  this.cmMeta = 'cm-meta'; //used for protocols
  this.resourceTypes = 'cm-resource-type-title';
  this.resourceTypeContent = 'cm-resource-type-content';
  this.methodTitle = 'cm-method-title';
  this.methodContent = 'cm-method-content';
  this.newButton = '[role="new-button"]';
  this.saveButton = '[role="save-button"]';
  this.notificationBar = '[role="notifications"]';
}

EditorHelper.prototype = {};
EditorHelper.prototype.getErrorLineMessage = function getErrorLineMessage(){
  var webdriver = require('selenium-webdriver');
  var d = webdriver.promise.defer();
  browser.wait(function () {
    return browser.isElementPresent(by.css('.CodeMirror-lint-marker-error'));
  }).then(function () {
    browser.executeScript(function () {
      var querySelectorMarkerError = document.querySelector('.CodeMirror-lint-marker-error');
      return [
        querySelectorMarkerError.getAttribute('data-marker-line'),
        querySelectorMarkerError.getAttribute('data-marker-message')
      ];
    }).then(function (list) {
        d.fulfill(list);
      });
  });
  return d.promise;
};

EditorHelper.prototype.IsParserErrorDisplayed = function IsParserErrorDisplayed(){
  return browser.isElementPresent(by.css('.CodeMirror-lint-marker-error'));
};

EditorHelper.prototype.getErrorMessage = function getErrorMessage(){
  var webdriver = require('selenium-webdriver');
  var d = webdriver.promise.defer();
  this.getErrorLineMessage().then(function (list) {
    var message = list[1];
    d.fulfill(message);
  });
  return d.promise;
};

EditorHelper.prototype.getErrorLine = function getErrorLine(){
  var webdriver = require('selenium-webdriver');
  var d = webdriver.promise.defer();
  this.getErrorLineMessage().then(function (list) {
    var line = list[0];
    d.fulfill(line);
  });
  return d.promise;
};

EditorHelper.prototype.setLine = function setLine(line, text){
  line --;
  return browser.executeScript('window.editor.replaceRange("' + text + '", { line:' + line + ', ch: 0}, { line:' + line + '})');
};

EditorHelper.prototype.removeLine = function removeLine(line){
  line --;
  return browser.executeScript('window.editor.replaceRange("", { line:' + line + ', ch: 0}, { line:' + line + '})');
};

EditorHelper.prototype.getLine = function getLine(line){
  line --;
  return browser.executeScript('return window.editor.getLine(' + line + ')').then(function (text) {
    return text;
  });
};

EditorHelper.prototype.setValue = function setValue(text){
  return browser.executeScript('window.editor.setValue(\'' + text + '\')');
};

EditorHelper.prototype.getValue = function getValue(){
  return browser.executeScript('return window.editor.getValue()');
};

EditorHelper.prototype.setCursor = function setCursor(line, char){
  line --;
  return browser.executeScript('window.editor.setCursor('+ line +','+ char +')');
};

EditorHelper.prototype.getSHighlightClass = function getSHighlightClass(line, pos){
  var that = this;
  var d = webdriver.promise.defer();
  element.all(by.css(that.editorLinesListCss)).then(function(list){
    list[line].findElements(by.css('span')).then(function(lintext){
      if(lintext[pos]) {
        lintext[pos].getAttribute('class').then(function(classe){
          d.fulfill(classe);
        });
      } else {
        d.fulfill('');
      }
    });
  });
  return d.promise;
};

EditorHelper.prototype.getSyntaxIndentClassArray = function getSyntaxIndentClassArray(line, posi){
  var that = this;
  var d = webdriver.promise.defer();
  var listClase = [] ;
  var i = 0;
  element.all(by.css(that.editorLinesListCss)).then(function(list){
    list[line].findElements(by.css('span')).then(function(lintext){
      posi.forEach(function(pos){
        var t = i ++;
        if(lintext[pos]) {
          lintext[pos].getAttribute('class').then(function(classe){
            listClase[t] = classe;
          }).then(function(){
              if(t ===posi.length-1){
//                console.log('listclase',listClase);
                d.fulfill(listClase);
              }
            });
        } else {
//          console.log('This has not a class');
        }
      });
    });
  });
  return d.promise;
};

EditorHelper.prototype.newFilePopUp = function newFilePopUp(fileName, dismiss){
  var d = webdriver.promise.defer();
  if (dismiss) {
    element(by.css('.modal-body .btn-default')).click()
      .then(function () {
        d.fulfill();
      });
  } else {
    element(by.css('.modal-body #name')).sendKeys(fileName)
      .then(function () {
        element(by.css('.modal-footer .btn-primary')).click()
          .then(function () {
            d.fulfill();
          });
      });
  }

  return d.promise;
};

EditorHelper.prototype.addNewFile = function addNewFile(fileName){
  var self = this;

  return element.all(by.css(this.newButton)).get(0).click().then(function() {
    return self.newFilePopUp(fileName);
  });
};

EditorHelper.prototype.saveFileButton = function saveFileButton(){
  // this save the current file
  element(by.css(this.saveButton)).click();
};


EditorHelper.prototype.dismissAddNewFile = function dismissAddNewFile(){
  $(this.newButton).click();
  var alertDialog = browser.driver.switchTo().alert();
  expect(alertDialog.getText()).toEqual('Choose a name:');
  alertDialog.sendKeys();
  alertDialog.dismiss();
};

EditorHelper.prototype.addNewFileWithExistingName = function addNewFileWithExistingName(fileName, filename1){
  this.addNewFile(fileName);
  var alertDialog = browser.driver.switchTo().alert();
  expect(alertDialog.getText()).toEqual('That filename is already taken.');
  alertDialog.accept();
  this.newFilePopUp(filename1);
};

EditorHelper.prototype.displayFileMenuPromise = function displayFileMenuPromise(pos){
  pos --;
  return browser.executeScript('$(\'.file-list li i\')[' + pos + '].click()');
};

EditorHelper.prototype.selectAFileByPos = function selectAFileByPos(pos){
  var d = webdriver.promise.defer();
  pos --;
  element.all(by.css('.file-list li')).then(function(list){
    list[pos].click().then(function () {
      browser.waitForAngular();
      d.fulfill();
    });
  });
  return d.promise;
};

EditorHelper.prototype.renameFile = function renameFile(pos, fileName){
  var d = webdriver.promise.defer();
  this.displayFileMenuPromise(pos).then(function(){
    element.all(by.css('[role="context-menu"] li')).then(function(list){
      list[2].click().then(function(){
        var alertDialog = browser.driver.switchTo().alert();
        expect(alertDialog.getText()).toEqual('Choose a name:');
        alertDialog.sendKeys(fileName);
        alertDialog.accept();
        d.fulfill();
      });
    });
  });
  return d.promise;
};

EditorHelper.prototype.getNotificationBar = function getNotificationBar(){
  return element.all(by.css(this.notificationBar));
};

EditorHelper.prototype.deleteAFile = function deleteAFile(pos,fileName,last){
  var d = webdriver.promise.defer();
  this.displayFileMenuPromise(pos).then(function(){
    element.all(by.css('[role="context-menu"] li')).then(function(list){
      list[1].click().then(function(){
        var alertDialog = browser.driver.switchTo().alert();
        expect(alertDialog.getText()).toEqual('Are you sure you want to delete "'+fileName+'"?');
        alertDialog.accept();
        if(last){
          browser.sleep(2000);
          alertDialog = browser.driver.switchTo().alert();
          expect(alertDialog.getText()).toEqual('The file browser is empty. Please provide a name for the new file:');
          alertDialog.dismiss();
        }
        browser.sleep(1000);
        d.fulfill();
      });
    });
  });
  return d.promise;
};

EditorHelper.prototype.dismissDeleteAFile = function dismissDeleteAFile(pos,fileName){
  var d = webdriver.promise.defer();
  this.displayFileMenuPromise(pos).then(function(){
    element.all(by.css('[role="context-menu"] li')).then(function(list){
      list[1].click().then(function(){
        var alertDialog = browser.driver.switchTo().alert();
        expect(alertDialog.getText()).toEqual('Are you sure you want to delete "'+fileName+'"?');
        alertDialog.dismiss();
        d.fulfill();
      });
    });
  });
  return d.promise;
};

EditorHelper.prototype.saveFile = function saveFile(pos){
  var d = webdriver.promise.defer();
  this.displayFileMenuPromise(pos).then(function(){
    element.all(by.css('[role="context-menu"] li')).then(function(list){
      list[0].click();
      d.fulfill();
    });
  });
  return d.promise;
};

EditorHelper.prototype.getFileList = function getFileList(){
  return browser.executeScript(function () {
    var dic = {};
    $('.file-list li span').text(function( index,text ) {
      dic[text] =true;
    });
    return dic;
  });
};

EditorHelper.prototype.getFileListArray = function getFileList(){
  return browser.executeScript(function () {
    var list = [];
    $('.file-list li span').text(function( index,text ) {
      list[index] =text;
    });
    return list;
  });
};

EditorHelper.prototype.getFileNameText = function getFileNameText(){
  return browser.executeScript(function(){return $('.menubar li[class="spacer file-absolute-path ng-binding"]').text();});
};

EditorHelper.prototype.foldCodebyPos = function (pos){
  var d = webdriver.promise.defer();
  pos --;
  element.all(by.css(this.codeFoldingOpen)).then(function(fold){
    fold[pos].click();
    d.fulfill();
  });
  return d.promise;
};

EditorHelper.prototype.enableDisableMockingService = function enableDisableMockingService(){
  var d = webdriver.promise.defer();
  browser.executeScript('$(\'[class="menu-item menu-item-fr menu-item-mocking-service ng-scope"] [type="checkbox"]\').click()');
  browser.waitForAngular();
  d.fulfill();
  return d.promise;
};

EditorHelper.prototype.isEnableMockingService = function isEnableMockingService(){
  var d = webdriver.promise.defer();
  browser.executeScript(function () {
    var button = document.querySelector('[class="menu-item menu-item-fr menu-item-mocking-service ng-scope"] [type="checkbox"]');
    return button.getAttribute('checked');
  }).then(function(attribute){
      if(attribute === 'checked'){
        d.fulfill(attribute);
      }else{
        if(attribute === null){
          d.fulfill('unchecked');
        }else{
          console.log('attribute', attribute);
          d.fulfill('unchecked');
        }
      }
    },function(){
      d.fulfill('unchecked');
    });
  return d.promise;
};

EditorHelper.prototype.isMockingServiceHidden = function (){
  var d = webdriver.promise.defer();
  browser.executeScript(function () {
    return  document.querySelector('[class="menu-item menu-item-fr menu-item-mocking-service ng-scope"] [type="checkbox"]');
  }).then(function(button){
      if(button === null){
        d.fulfill('hidden');
      }else{
        d.fulfill('not hidden');
      }
    },function(){
      d.fulfill('error');
    });
  return d.promise;
};

exports.EditorHelper = EditorHelper;

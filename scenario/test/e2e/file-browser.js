'use strict';
var AssertsHelper = require ('../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../lib/editor-helper.js').EditorHelper;
//var ShelfHelper = require('../lib/shelf-helper.js').ShelfHelper;
//var ConsoleHelper = require('../lib/console-helper.js').ConsoleHelper;
describe('file_browser ',function(){
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();
//  var shelf = new ShelfHelper();
//  var consoleDesigner = new ConsoleHelper();

  describe('delete files', function(){

    it('delete file - only one created', function(){
      expect(editor.getLine(1)).toEqual('#%RAML 0.8');
      expect(editor.getLine(2)).toEqual('title:');
      designerAsserts.consoleApiTitle('');
      browser.wait(function(){
        return editor.getFileList().then(function(dic){
          return Object.keys(dic).length === 1;
        });
      }).then(function(){
        editor.deleteAFile(1,'example.raml',true);
        designerAsserts.editorCheckFileNameNotInList('example.raml');
        designerAsserts.editorCheckFileNameInList('Untitled-1.raml');
      });
    });

    xit('delete current file', function(){
//   https://www.pivotaltracker.com/story/show/64933904
      var fileName = 'example.raml';
      editor.addNewFile(fileName);
      var definition = [
        '#%RAML 0.8',
        'title: My  API'
      ].join('\\n');
      editor.setValue(definition);
      editor.selectAFileByPos(2).then(function(){
        editor.deleteAFile(2,'Untitled-1.raml',true);
        designerAsserts.editorCheckFileNameNotInList('Untitled-1.raml');
        designerAsserts.editorCheckFileNameInList('example.raml');
      });
      designerAsserts.consoleApiTitle('My API');
    });

    xit('delete current file - saved', function(){
//   https://www.pivotaltracker.com/story/show/64933904
      var fileName = 'example.raml';
      editor.addNewFile(fileName);
      var definition = [
        '#%RAML 0.8',
        'title: My  API'
      ].join('\\n');
      editor.setValue(definition);
      editor.saveFile(1);
      expect(editor.getFileNameText()).toEqual('/example.raml');
      editor.selectAFileByPos(2).then(function(){
        editor.saveFile(2);
        editor.deleteAFile(2,'Untitled-1.raml',true);
        designerAsserts.editorCheckFileNameNotInList('Untitled-1.raml');
        designerAsserts.editorCheckFileNameInList('example.raml');
      });
      designerAsserts.consoleApiTitle('My API');
    });

    xit('delete not current file', function(){
//      https://www.pivotaltracker.com/story/show/64933904
      var fileName = 'example3.raml';
      editor.addNewFile(fileName);
      var definition = [
        '#%RAML 0.8',
        'title: My  API example 3'
      ].join('\\n');
      editor.setValue(definition);
      editor.saveFile(1);
      designerAsserts.editorCheckFileNameInList('example3.raml');
      expect(editor.getFileNameText()).toEqual('/example3.raml');
      var fileName1 = 'example4.raml';
      editor.addNewFile(fileName1);
      var definition2 = [
        '#%RAML 0.8',
        'title: My  API example 4'
      ].join('\\n');
      editor.setValue(definition2);
      editor.saveFile(2);
      editor.selectAFileByPos(1).then(function(){
        editor.deleteAFile(1,'example3.raml',true);
        designerAsserts.editorCheckFileNameNotInList('example3.raml');
      });
      designerAsserts.consoleApiTitle('My API example 4');
    });

    xit('attempt to delete the current  file but then cancel it', function(){
      //check that the file is not deleted
      //check file name
      // check theconsole
    });

    xit('attempt to delete not the current file', function(){

    });
  }); // delete files

  describe('new file', function(){

    it('add a new file', function(){
      var fileName = 'presentation.raml';
      editor.addNewFile(fileName);
      designerAsserts.editorCheckFileNameInList(fileName);
      designerAsserts.shelfIsDisplayed();
    });

    it('stub raml is added for a new .raml file', function(){
      expect(editor.getLine(1)).toEqual('#%RAML 0.8');
      expect(editor.getLine(2)).toEqual('title:');
      designerAsserts.consoleApiTitle('');
    });

    it('new file is created as unsaved', function(){
      expect(editor.getFileNameText()).toEqual('* /presentation.raml');
    });

    it('create new file with an existing file name', function(){
      var fileName = 'presentation.raml';
      var fileName2 = 'unNuevoRAML.name';
      editor.addNewFileWithExistingName(fileName,fileName2);
      designerAsserts.editorCheckFileNameInList(fileName2);
    });

    describe('not a raml file', function(){

      it('create the non raml file', function(){
        var fileName = 'notraml.txt';
        editor.addNewFile(fileName);
        designerAsserts.editorCheckFileNameInList(fileName);
      });

      it('editor is displayed empty', function(){
        expect(editor.getLine(1)).toEqual('');
        designerAsserts.consoleApiTitle('');
      });

      it('shelf is not displayed', function(){
        designerAsserts.shelfIsNotDisplayed();
      });

      it('add some text', function(){
        editor.setValue('This is some text to be added on this non raml filel');
        expect(editor.getLine(1)).toEqual('This is some text to be added on this non raml filel');
      });

      it('console is not displayed', function(){
        designerAsserts.consoleSectionIsHidden();
      });


    }); //not a raml file

  }); // new file


  describe('rename not a save file', function(){

    it('Add new file', function(){
      var fileName = 'personal.raml';
      editor.addNewFile(fileName);
      designerAsserts.editorCheckFileNameInList(fileName);
    });

    it('rename file', function(){
      expect(editor.getFileNameText()).toEqual('* /personal.raml');
      editor.renameFile(2,'otroName.raml').then(function(){
        designerAsserts.editorCheckFileNameInList('otroName.raml');
      });
    });

    it('check file name from renamed file', function(){
      expect(editor.getFileNameText()).toEqual('* /otroName.raml');
    });

  }); //rename not a save file

  describe('rename a saved file', function(){

    it('Add new file', function(){
      var fileName = 'aNewfile.raml';
      editor.addNewFile(fileName);
      designerAsserts.editorCheckFileNameInList(fileName);
    });

    it('add an invalid raml', function(){
      var definition = [
        '#%RAML 0.8',
        'title: my api',
        'resourceTypes:'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('3','invalid resourceTypes definition, it must be an array');
    });

    it('save the file',function(){
      expect(editor.getFileNameText()).toEqual('* /aNewfile.raml');
      editor.saveFile(1);
      browser.wait(function(){
        return editor.getFileNameText().then(function(text){
          return text === '/aNewfile.raml';
        });
      }).then(function(){
        expect(editor.getFileNameText()).toEqual('/aNewfile.raml');
      });
    });


    it('change to another file', function(){
      editor.selectAFileByPos(2);
      expect(editor.getLine(1)).toEqual('This is some text to be added on this non raml filel');
    });

    it('go back to the previous file', function(){
//      browser.get('/tree/file_browser_bar/');
      editor.selectAFileByPos(1).then(function(){
        expect(editor.getLine(1)).toEqual('#%RAML 0.8');
        designerAsserts.parserError('3','invalid resourceTypes definition, it must be an array');
        designerAsserts.consoleApiTitle('');
      });

    });

    it('rename file', function(){
      editor.renameFile(1,'ahola.raml');
      browser.wait(function(){
        return editor.getFileNameText().then(function(text){
          return text === '/ahola.raml';
        });
      }).then(function(){
          expect(editor.getFileNameText()).toEqual('/ahola.raml');
          designerAsserts.editorCheckFileNameInList('ahola.raml');
        });
    });

  }); //rename a saved file

  describe('save a file using save btn', function(){
    it('Add new file', function(){
      var fileName = 'resources.raml';
      editor.addNewFile(fileName);
      designerAsserts.editorCheckFileNameInList(fileName);
    });

    it('save the file',function(){
      expect(editor.getFileNameText()).toEqual('* /resources.raml');
      editor.saveFileButton();
      browser.wait(function(){
        return editor.getFileNameText().then(function(text){
          return text === '/resources.raml';
        });
      }).then(function(){
          expect(editor.getFileNameText()).toEqual('/resources.raml');
        });
    });

  }); //save a file from using save btn

  describe('file browser list', function(){

    it('alphabetically ordered', function(){
      editor.getFileListArray().then(function(fileList){
        expect(fileList).toEqual(fileList.sort());
      });
    });

  }); // file browser list

}); // file_browser
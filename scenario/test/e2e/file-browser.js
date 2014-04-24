'use strict';
var AssertsHelper = require ('../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../lib/editor-helper.js').EditorHelper;
describe('file_browser ',function(){
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();

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

    it('delete current file', function(){
      var fileName = 'example1.raml';
      editor.addNewFile(fileName);
      var definition = [
        '#%RAML 0.8',
        'title: My API new example'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('My API new example');

      editor.selectAFileByPos(2).then(function(){
        designerAsserts.consoleApiTitle('');
        editor.deleteAFile(2,'Untitled-1.raml',false).then(function(){
          designerAsserts.editorCheckFileNameNotInList('Untitled-1.raml');
          designerAsserts.editorCheckFileNameInList('example1.raml');
        });
      });
    });

    it('delete current file - saved', function(){
      var fileName = 'example.raml';
      editor.addNewFile(fileName);
      var definition = [
        '#%RAML 0.8',
        'title: My  API example1'
      ].join('\\n');
      editor.setValue(definition);
      editor.saveFile(1);
      browser.wait(function(){
        return editor.getFileNameText().then(function(text){
          return text === '/example.raml';
        });
      }).then(function(){
          expect(editor.getFileNameText()).toEqual('/example.raml');
        });
      editor.selectAFileByPos(1).then(function(){
        editor.saveFile(1);
        editor.deleteAFile(1,'example.raml',false);
        designerAsserts.editorCheckFileNameNotInList('example.raml');
        designerAsserts.editorCheckFileNameInList('example1.raml');
      });
      designerAsserts.consoleApiTitle('My API new example');
    });

    it('delete not current file', function(){
      var fileName = 'example3.raml';
      editor.addNewFile(fileName);
      var definition = [
        '#%RAML 0.8',
        'title: My  API example 3'
      ].join('\\n');
      editor.setValue(definition);
      expect(editor.getFileNameText()).toEqual('* /example3.raml');
      editor.selectAFileByPos(2).then(function(){
        editor.deleteAFile(2,'example3.raml',false);
        designerAsserts.editorCheckFileNameNotInList('example3.raml');
      });
      designerAsserts.consoleApiTitle('My API new example');
    });

    it('attempt to delete the current  file but then cancel it', function(){
      editor.dismissDeleteAFile(1,'example1.raml');
      designerAsserts.editorCheckFileNameInList('example1.raml');
      designerAsserts.consoleApiTitle('My API new example');
    });

    it('attempt to delete not the current file', function(){
      var fileName = 'example5.raml';
      editor.addNewFile(fileName);
      var definition = [
        '#%RAML 0.8',
        'title: My  API example 5'
      ].join('\\n');
      editor.setValue(definition);
      expect(editor.getFileNameText()).toEqual('* /example5.raml');
      designerAsserts.consoleApiTitle('My API example 5');
      editor.dismissDeleteAFile(1,'example1.raml');
      designerAsserts.editorCheckFileNameInList('example1.raml');
      designerAsserts.editorCheckFileNameInList('example5.raml');
      editor.selectAFileByPos(1).then(function(){
        editor.deleteAFile(1,'example1.raml',false);
        designerAsserts.editorCheckFileNameNotInList('example1.raml');
      });
      editor.selectAFileByPos(1).then(function(){
        editor.deleteAFile(1,'example5.raml',true);
        designerAsserts.editorCheckFileNameNotInList('example5.raml');
      });
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
        var fileName = 'notraml.yaml';
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

      it('mocking-service is not displayed', function(){
        editor.isMockingServiceHidden().then(function(text){
          expect(text).toEqual('hidden');
        });
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
      editor.selectAFileByPos(1).then(function(){
        browser.wait(function(){
          return editor.getLine(1).then(function(text){
            return  text === '#%RAML 0.8';
          });
        }).then(function(){
            expect(editor.getLine(1)).toEqual('#%RAML 0.8');
            designerAsserts.parserError('3','invalid resourceTypes definition, it must be an array');
            designerAsserts.consoleApiTitle('');
          });
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

  describe('add a file and then reload the page', function(){
    var ram = [
      '#%RAML 0.8',
      'title: this is one example',
      '/refdsds:',
      '         '
    ].join('\\n');

    it('add new file and add some content', function(){
      var fileName = 'untest.raml';
      editor.addNewFile(fileName);
      designerAsserts.editorCheckFileNameInList(fileName);

      editor.setValue(ram);
      editor.saveFileButton();
      browser.wait(function(){
        return editor.getFileNameText().then(function(text){
          return text === '/untest.raml';
        });
      }).then(function(){
          expect(editor.getFileNameText()).toEqual('/untest.raml');
        });
    });
    it('validate file content and reload the page', function(){
      editor.getValue().then(function(newraml){
        expect(newraml).toMatch(ram);
        browser.get('/');
      });
    });

    it('validate editor content after reload', function(){
      browser.wait(function(){
        return editor.getLine(1).then(function(text){
          return  text === '#%RAML 0.8';
        });
      }).then(function(){
        editor.getValue().then(function(otrraml){
          expect(otrraml).toMatch(ram);
        });
      });
    });

  });

  describe('file browser list', function(){

    it('alphabetically ordered', function(){
      editor.getFileListArray().then(function(fileList){
        expect(fileList).toEqual(fileList.sort());
      });
    });

  }); // file browser list

}); // file_browser

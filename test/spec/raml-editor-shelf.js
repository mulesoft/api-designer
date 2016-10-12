'use strict';

describe('Shelf controller', function () {
  var codeMirror;
  var applySuggestion;
  var ramlRepository;

  angular.module('editorShelfTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('editorShelfTest'));

  beforeEach(inject(function ($rootScope, $injector) {
    codeMirror      = $injector.get('codeMirror');
    ramlRepository  = $injector.get('ramlRepository');
    applySuggestion = $injector.get('applySuggestion');
  }));

  describe('updateSuggestions', function () {
    var newSuggestions;

    beforeEach(inject(function ($injector) {
      newSuggestions = $injector.get('newSuggestions');
    }));

    it('should provide suggestions for root without "title"', function (done) {
      var contentLines = ['#%RAML 1.0', 'title: Nice Title', ''];
      var editor = getEditor(codeMirror,
        contentLines,
        { line: 2, ch: 0 } // Cursor
      );

      var file = createMockFile('api.raml', {root: true, doc: editor, contents: contentLines.join('')});
      ramlRepository.children = [file];
      ramlRepository.loadDirectory();


      newSuggestions(ramlRepository.rootDirectory, file, editor)
        .then(function(model) {
          var keys = model.categories
            .map(function (category) { return category.items; })
            .reduce(function (result, value) { return result.concat(value); }, [])
            .map(function (s) { return s.title; });
          keys.should.not.include('title');
          keys.should.include('schemas');
          keys.should.include('uses');
          keys.should.include('types');
          keys.should.include('traits');
          keys.should.include('resourceTypes');
          keys.should.include('annotationTypes');
          keys.should.include('securitySchemes');
          keys.should.include('description');
          keys.should.include('version');
          keys.should.include('baseUri');
          keys.should.include('baseUriParameters');
          keys.should.include('protocols');
          keys.should.include('mediaType');
          keys.should.include('securedBy');
          keys.should.include('documentation');

          done();
        });
    });
  });

  describe('applySuggestion', function () {
    it('should add a new line and move the cursor to this line', function () {
      var versionLine = 'version: v2.4';
      var descriptionLine = 'description: ';
      var emptyLine = '  ';

      var editor = getEditor(codeMirror,
        ['#%RAML 1.0', 'title: Nice Title', '', versionLine],
        {line: 2, ch: 0}
      );

      applySuggestion(editor, {key: descriptionLine + '\n' + emptyLine});
      editor.getLine(2).should.be.equal(descriptionLine);
      editor.getLine(3).should.be.equal(emptyLine);
      editor.getLine(4).should.be.equal(versionLine);
      editor.getCursor().line.should.be.equal(3);
      editor.getCursor().ch.should.be.equal(2);
    });


    it('should replace RAML version', function () {
      var editor = getEditor(codeMirror,
        ['#%RAML 1.0', 'title: Nice Title', ''],
        {line: 0, ch: 7}
      );

      applySuggestion(editor, { key: '0.8', replacementPrefix: ''});
      editor.getLine(0).should.be.equal('#%RAML 0.8');
      editor.getCursor().line.should.be.equal(0);
      editor.getCursor().ch.should.be.equal(10);
    });
    //endregion
  });

  //--------- Utility functions


  function createMockFile(name, options) {
    options = options || {};

    return {
      name:         name,
      path:         '/' + name,
      isDirectory:  false,
      loaded:       options.contents,
      contents:     options.contents,
      doc:          options.doc
    };
  }
});

'use strict';

// Util Functions

function range(start, stop) {
  var result = new Array(stop - start + 1);
  for (var i = start; i <= stop; i++) {
    result[i - start] = i;
  }

  return result;
}

// end Util Functions

var FSResolver = function (homeDirectory, ramlRepository) {
  this.parsePath = function (path) {
    return path.split('/')
      .filter(function (pathMember) { return pathMember && pathMember !== ''; });
  };

  this.getElement = function (path) {
    var pathMembers = this.parsePath(path);
    return this.getElementFromPath(pathMembers, 0, homeDirectory);
  };

  this.getElementFromPath = function (pathMembers, index, element) {
    if (pathMembers.length === index) { return element; }
    if (!element.isDirectory) { return undefined; }

    var child = this.getChild(element, pathMembers[index]);
    if (!child) { return child; }

    return this.getElementFromPath(pathMembers, index + 1, child);
  };

  this.getChild = function (directory, childName) {
    return directory.children
      .find(function(child) { return child.name === childName; });
  };

  this.getFileContentAsync = function (file) {
    if (file.loaded) {
      if (file.doc) { return Promise.resolve(file.doc.getValue()); }
      if (file.contents) { return Promise.resolve(file.contents); }
    }

    var getFileContent = function (file) { return file.contents; };
    return ramlRepository.loadFile(file, true)
      .then(getFileContent);
  };

  this.contentAsync = function (path) {
    var element = this.getElement(path);
    if (!element || element.isDirectory) { return Promise.resolve(''); }
    return this.getFileContentAsync(element);
  };

  this.list = function (path) {
    var element = this.getElement(path);
    if (!element || !element.isDirectory) { return []; }

    return element.children
      .map(function (child) { return child.name; });
  };

  this.listAsync = function(path){ return Promise.resolve(this.list(path)); };

  this.exists = function(path) { return !!this.getElement(path); };

  this.existsAsync = function(path) { return Promise.resolve(this.exists(path)); };

  this.dirname = function (path) {
    var element = this.getElement(path);
    if (!element) { return ''; }
    if (element.isDirectory) { return element.path; }
    var result = path.substring(0, path.lastIndexOf('/') + 1);
    return result || '';
  };

  this.resolve = function (contextPath, relativePath) {
    if (relativePath.startsWith('/')) { return relativePath; }

    var pathBeginning = contextPath.endsWith('/') ? contextPath : contextPath + '/';
    return pathBeginning + relativePath;
  };

  this.extname = function (path) {
    var element = this.getElement(path);
    if (!element || element.isDirectory) { return ''; }

    var nameParts = element.name.split('.');
    if (nameParts.length <= 1) { return ''; }
    return nameParts[nameParts.length - 1];
  };

  this.isDirectory = function (path) {
    var element = this.getElement(path);
    return !!(element && element.isDirectory);
  };

  this.isDirectoryAsync = function (path) { return Promise.resolve(this.isDirectory(path)); };
};

var EditorStateProvider = function (fsResolver, path, editor) {
  function sum(total, size){ return total + size; }

  this.getText = function () { return editor.getValue(); };

  this.getPath = function () { return path; };

  this.getBaseName = function () {
    var element = fsResolver.getElement(path);
    return element ? element.name : '';
  };

  var calcOffset = function (editor) {
    var cursor = editor.getCursor();
    var allPreviewsLinesSize = range(0, cursor.line - 1)
      .map(function (index) { return editor.getLine(index).length + 1; })
      .reduce(sum, 0);

    return allPreviewsLinesSize + cursor.ch;
  };

  this.offset = calcOffset(editor);

  this.getOffset = function () { return this.offset; };
};

angular.module('ramlEditorApp')
  .factory('ramlSuggest', function (ramlRepository, ramlEditorMainHelpers) {

    this.FSResolver = FSResolver;

    this.EditorStateProvider = EditorStateProvider;

    function codemirrorHint(editor, suggestions) {
      var separator = /:?(:|\s|\.|\[|]|-)+|!/;
      var currentPrefix = function(line, ch){
        if (!line) { return ''; }
        var split = line.slice(0, ch).split(separator);
        return split[split.length - 1];
      };

      var currentSufix = function(line, ch){
        if (!line) { return ''; }
        var split = line.slice(ch).split(separator);
        return split[0];
      };

      var render = function (element, self, data) {
        element.innerHTML = ['<div>', data.displayText, '</div>', '<div class="category">', data.category,'</div>']
            .join('');
      };

      var codemirrorSuggestion = function(suggestion) {
        return {
          displayText: suggestion.displayText || suggestion.text,
          text: suggestion.text,
          category: suggestion.category,
          render: render
        };
      };

      function isWordPartOfTheSuggestion(word, suggestion) {
        if (!word) { return true; }
        var lowerCaseText = suggestion.text.toLowerCase();
        return lowerCaseText.startsWith(word) && lowerCaseText !== word;
      }

      var cursor = editor.getCursor();
      var line = editor.getLine(cursor.line);
      var ch = cursor.ch;
      var prefix = currentPrefix(line, ch) || '';
      var suffix = currentSufix(line, ch) ;
      var word = prefix + suffix;
      var lowerCaseWord = word.toLowerCase();
      var toCh = editor.getLine(cursor.line).length;
      var fromCh = ch - prefix.length;


      var codeMirrorSuggestions = suggestions
        .filter(function (suggestion) { return isWordPartOfTheSuggestion(lowerCaseWord, suggestion); })
        .map(codemirrorSuggestion);

      return {
        word: word,
        list: codeMirrorSuggestions,
        from: CodeMirror.Pos(cursor.line, fromCh),
        to: CodeMirror.Pos(cursor.line, toCh)
      };
    }

    function beautifyCategoryName(suggestion) {
      if(suggestion.category === undefined || suggestion.category.toLowerCase() === 'unknown') {
        suggestion.category = 'others';
      }
      return suggestion;
    }

    function ensureTextFieldNotUndefined(suggestion) {
      suggestion.text = suggestion.text || suggestion.displayText || '';
      return suggestion;
    }

    function addTextSnippets(editor, suggestions) {
      var ch = editor.getCursor().ch;
      var addNewResource = suggestions.length > 0 && (ch === 0 || suggestions.find(function (s) {
          return s.category === 'methods' ? s : null;
        }));

      if (addNewResource && ramlEditorMainHelpers.isApiDefinition(editor.getValue())) {
        var prefix = addNewResource.replacementPrefix || '';
        var spaces = '\n' + new Array(ch - prefix.length + 1).join(' ') + '  ';
        return suggestions.concat({
          text: '/newResource:' + spaces + 'displayName: resourceName' + spaces,
          displayText: 'New Resource',
          category: 'resources',
          replacementPrefix: prefix
        });
      }

      return suggestions;
    }

    this.getSuggestions = function(homeDirectory, currentFile, editor) {
      var ramlSuggestions = RAML.Suggestions;
      var fsResolver = new FSResolver(homeDirectory, ramlRepository);

      var contentProvider = ramlSuggestions.getContentProvider(fsResolver);
      var editorStateProvider = new EditorStateProvider(fsResolver, currentFile.path, editor);

      return ramlSuggestions.suggestAsync(editorStateProvider, contentProvider)
        .then(
          function (result) { return Array.isArray(result)? result: []; },
          function () { return []; }
        )
        .then(function (suggestions) { return suggestions.map(beautifyCategoryName); })
        .then(function (suggestions) { return suggestions.map(ensureTextFieldNotUndefined); })
        .then(function (suggestions) { return addTextSnippets(editor, suggestions); });
    };

    // class methods

    this.suggest = function (homeDirectory, currentFile, editor) {
      return this.getSuggestions(homeDirectory, currentFile, editor);
    };

    this.autocompleteHelper = function (editor, callback, options, homeDirectory, currentFile) {
      if (!homeDirectory || !currentFile) {
        var $scope = angular.element(editor.getInputField()).scope();
        homeDirectory = homeDirectory || $scope.homeDirectory;
        currentFile = currentFile || $scope.fileBrowser.selectedFile;
      }

      this.getSuggestions(homeDirectory, currentFile, editor)
        .then(function(suggestions) { return codemirrorHint(editor, suggestions); })
        .then(function(codemirrorHint) { callback(codemirrorHint); });
    };

    return this;
  });

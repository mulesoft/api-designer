describe('ramlEditorExportMenu', function() {
  'use strict';

  var scope, el, repository, swaggerConverter;

  function compileExportMenu() {
    el = compileTemplate('<raml-editor-export-menu></raml-editor-export-menu>', scope);
  }

  function exportZip() {
    // return angular.element(el[0].children[0]).triggerHandler('click');
    return angular.element(el[0].children[1].children[0]).triggerHandler('click');
  }

  function exportJson() {
    return angular.element(el[0].children[1].children[1]).triggerHandler('click');
  }

  function exportYaml() {
    return angular.element(el[0].children[1].children[2]).triggerHandler('click');
  }

  angular.module('exportMenuTest', ['ramlEditorApp', 'testFs', 'utils']);
  beforeEach(module('exportMenuTest'));

  beforeEach(inject(function($rootScope, ramlRepository, ramlToSwagger) {
    scope = $rootScope.$new();
    scope.xOasExport = true;
    scope.fileBrowser = {};
    scope.fileBrowser.currentTarget = {
      path: '/mockFile.raml'
    };
    repository = ramlRepository;
    swaggerConverter = ramlToSwagger;
    compileExportMenu();
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope  = undefined;
  });

  describe('export', function() {
    var zip, json, yaml;

    beforeEach(function() {
      zip = sinon.spy(repository, 'exportFiles');
      json = sinon.spy(swaggerConverter, 'json');
      yaml = sinon.spy(swaggerConverter, 'yaml');
    });

    it('export to zip', function() {
      exportZip();
      zip.should.have.been.called;
    });

    it('export to JSON', function() {
      exportJson();
      json.should.have.been.called;
    });

    it('export to YAML', function() {
      exportYaml();
      yaml.should.have.been.called;
    });
  });
});

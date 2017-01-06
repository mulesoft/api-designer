(function(scope) {
  'use strict';
  scope.file = undefined;
  scope.noEntryPoint = false;
  scope.multipleEntryPoints = false;
  scope.entryPoints = [];
  scope.working = false;
  scope.hasData = false;
  scope.api = undefined;
  scope.errors = [];
  scope.selectedOutput = 0;
  scope.ramlFileUrl =
    'https://raw.githubusercontent.com/advanced-rest-client/raml-example-api/master/api.raml';
  scope.fileListChanged = function() {
    scope.hasData = false;
    scope.noEntryPoint = false;
    scope.multipleEntryPoints = false;
    scope.entryPoints = [];
    scope.api = undefined;
  };
  scope.entryFound = function(e) {
    console.log(e.detail);
    var file = e.detail.entry;
    if (!file) {
      scope.noEntryPoint = true;
      return;
    }
    if (file instanceof Array) {
      scope.multipleEntryPoints = true;
      scope.entryPoints = file;
    } else {
      scope.parseRaml(file);
    }
  };

  scope._useEntryPoint = function(e) {
    var item = e.model.get('item');
    scope.multipleEntryPoints = false;
    scope.entryPoints = [];
    scope.parseRaml(item);
  };

  scope.parseRaml = function(item) {
    scope.working = true;

    var detail = {
      'file': item.entry,
      'files': scope.file
    };
    var event = scope.fire('parse-raml-file', detail);
    if (!event.detail.raml) {
      console.error('Event did not contained raml property.');
      return;
    }

    event.detail.raml
      .then(function(result) {
        scope.handleParseResult(result);
      })
      .catch(function(e) {
        console.warn('API error', e);
        scope.working = false;
      });
  };

  scope._highlightApiJson = function() {
    window.setTimeout(function() {
      var obj = scope.api.expand(true).toJSON({
        dumpSchemaContents: true,
        rootNodeDetails: true,
        serializeMetadata: true
      });
      var txt = JSON.stringify(obj);
      var event = scope.fire('syntax-highlight', {
        code: txt,
        lang: 'js'
      });
      scope.$.out.innerHTML = event.detail.code;
      scope.working = false;
      scope.hasData = true;
    }, 1);
  };

  scope._displayApiStructure = function() {
    window.setTimeout(function() {
      var txt = '';
      scope.api.allResources().forEach(function(resource) {
        var rName = resource.displayName();
        var rUri = resource.absoluteUri();
        txt += rName + ' <small>' + rUri + '</small>\n';
        resource.methods().forEach(function(method) {
          var mName = method.displayName ? method.displayName() : null;
          var mMethod = method.method ? method.method() : 'unknown';
          var mDesc = method.description ? method.description() : null;
          if (mDesc) {
            mDesc = mDesc.value();
          }
          if (mName) {
            txt += '  ' + mName + ' <small>' + mMethod + '</small>\n';
          } else {
            txt += '  ' + mMethod + '\n';
          }
          txt += '  <small>' + mDesc + '</small>\n';
        });
      });
      scope.$.outStruct.innerHTML = txt;
      scope.working = false;
      scope.hasData = true;
    }, 2);
  };

  scope.toggleJson = function() {
    scope.$.jsonOutput.toggle();
  };
  scope.toggleStruct = function() {
    scope.$.structureOutput.toggle();
  };

  scope._downloadRaml = function() {
    var url = scope.ramlFileUrl;
    if (!url) {
      console.error('The URL is not set');
      return;
    }
    scope.working = true;

    var detail = {
      'url': url
    };
    var event = scope.fire('parse-raml-url', detail);
    if (!event.detail.raml) {
      console.error('The event did not handled the RAML property.');
      scope.working = false;
      return;
    }

    event.detail.raml
      .then(function(result) {
        scope.handleParseResult(result);
      })
      .catch(function(e) {
        console.warn('API error', e);
        scope.working = false;
      });
  };

  scope.handleParseResult = function(result) {
    scope.api = result[0];
    scope._displayApiStructure(result[1].specification);
    scope.errors = result[1].errors;
    console.log(result[1].specification);
  };

  // window.addEventListener('WebComponentsReady', function() {
  //
  // });

  scope._parserReady = function() {
    scope._downloadRaml();
  };

})(document.querySelector('#app'));

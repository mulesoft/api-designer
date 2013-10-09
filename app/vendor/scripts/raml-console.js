RAML.Inspector = (function() {
  var exports = {};

  var extractResources = function(basePathSegments, api) {
    var resources = [];

    api.resources.forEach(function(resource) {
      var pathSegments = basePathSegments.concat(resource.relativeUri);

      resources.push(exports.resourceOverviewSource(pathSegments, resource));
      if (resource.resources) {
        extracted = extractResources(pathSegments, resource);
        extracted.forEach(function(resource) {
          resources.push(resource);
        });
      }
    });

    return resources;
  };

  exports.resourceOverviewSource = function(pathSegments, resource) {
    return {
      pathSegments: pathSegments,
      name: resource.displayName,
      methods: (resource.methods || []),
      traits: resource.is,
      resourceType: resource.type,
      uriParameters: resource.uriParameters
    }
  };

  exports.create = function(api) {
    api.resources = extractResources([], api);
    return api;
  };

  return exports;
})();

(function () {
  'use strict';

  var templateMatcher = /\{(.*)\}/;

  var PathSegment = function(pathSegment) {
    this.text = pathSegment;

    var match = pathSegment.match(templateMatcher);
    this.templated = !!match;
    if (match) {
      this.parameterName = match[1];
    }
  }

  PathSegment.prototype.toString = function() {
    return this.text;
  }

  PathSegment.prototype.replaceWith = function(value) {
     if (this.templated) {
       return "/" + value;
     } else {
       return this.toString();
     }
  }

  function convertPathSegment(pathSegment) {
    return new PathSegment(pathSegment);
  }

  function createTemplate(pathSegments) {
    var template = function(context) {
      context = context || {};

      return pathSegments.map(function(pathSegment) {
        return pathSegment.replaceWith(context[pathSegment.parameterName]);
      }).join("");
    }

    template.segments = pathSegments;

    return template
  }

  RAML.Inspector.PathBuilder = {
    create: function(pathSegments) {
      return createTemplate(pathSegments.map(convertPathSegment));
    }
  }
})();

(function() {
  RAML.Controllers = {};
})();

(function() {

  var controller = function($scope) {
    this.tabs = $scope.tabs = [];
    $scope.tabset = this;
  };

  controller.prototype.select = function(tab) {
    if (tab.disabled) {
      return;
    }
    this.tabs.forEach(function(tab) {
      tab.active = false;
    });
    tab.active = true;
  };

  controller.prototype.addTab = function(tab) {
    if (this.tabs.every(function(tab) { return tab.disabled }) || tab.active) {
      this.select(tab);
    }
    this.tabs.push(tab);
  };

  RAML.Controllers.tabset = controller;

})();

(function() {
  var FORM_URLENCODED = 'application/x-www-form-urlencoded';
  var FORM_DATA = 'multipart/form-data';

  function isEmpty(object) {
    return Object.keys(object || {}).length == 0;
  }

  TryIt = function($scope, $http) {
    this.baseUri = $scope.api.baseUri || '';
    this.pathBuilder = $scope.method.pathBuilder;

    this.http = $http;
    this.httpMethod = $scope.method.method;
    this.headers = {};
    this.queryParameters = {};
    this.formParameters = {};
    this.supportsCustomBody = this.supportsFormUrlencoded = this.supportsFormData = false;
    for (mediaType in $scope.method.body) {
      this.supportsMediaType = true;

      if (mediaType == FORM_URLENCODED) {
        this.supportsFormUrlencoded = true;
      } else if (mediaType == FORM_DATA) {
        this.supportsFormData = true;
      } else {
        this.supportsCustomBody = true;
      }
    }

    $scope.apiClient = this;
  };

  TryIt.prototype.showBody = function() {
    return this.supportsCustomBody && !this.showUrlencodedForm() && !this.showMultipartForm();
  }

  TryIt.prototype.showUrlencodedForm = function() {
    if (this.mediaType) {
      return this.mediaType == FORM_URLENCODED;
    } else {
      return (!this.supportsCustomBody && this.supportsFormUrlencoded);
    }
  }

  TryIt.prototype.showMultipartForm = function() {
    if (this.mediaType) {
      return this.mediaType == FORM_DATA
    } else  {
      return (!this.suppoprtsCustomBody && !this.supportsFormUrlencoded && this.supportsFormData);
    }
  }

  TryIt.prototype.execute = function() {
    var url = this.baseUri + this.pathBuilder(this.pathBuilder);
    var response = this.response = {};
    var requestOptions = { url: url, method: this.httpMethod }

    if (!isEmpty(this.queryParameters)) {
      requestOptions.params = this.queryParameters;
    }

    if (!isEmpty(this.formParameters)) {
      requestOptions.data = this.formParameters;
    }

    if (!isEmpty(this.headers)) {
      requestOptions.headers = this.headers;
    }

    if (this.mediaType) {
      requestOptions.headers = requestOptions || {};
      requestOptions.headers['Content-Type'] = this.mediaType;
      requestOptions.data = this.body;
    }

    this.http(requestOptions).then(function(httpResponse) {
      response.body = httpResponse.data;
      response.requestUrl = url,
      response.status = httpResponse.status,
      response.headers = httpResponse.headers();
      if (response.headers['content-type']) {
        response.contentType = response.headers['content-type'].split(';')[0];
      }
    });
  };

  RAML.Controllers.tryIt = TryIt;
})();

(function() {
  RAML.Directives = {};
})();

(function() {
  'use strict';

  var formatters = {
    "application/json" : function(code) {
      return vkbeautify.json(code);
    },
    "text/xml" : function(code) {
      return vkbeautify.xml(code);
    },
    "default" : function(code) {
      return code;
    }
  };

  function sanitize(options) {
    var code = options.code || '',
        formatter = formatters[options.mode] || formatters.default;

    try {
      options.code = formatter(code);
    } catch(e) {}
  }

  var Controller = function($scope, $element) {
    sanitize($scope);

    this.editor = CodeMirror($element[0], {
      mode: $scope.mode,
      readOnly: "nocursor",
      value: $scope.code,
      lineNumbers: true,
      indentUnit: 4
    });

    this.editor.setSize("100%", "100%");
  };

  Controller.prototype.refresh = function(options) {
    sanitize(options);
    this.editor.setOption("mode", options.mode);
    this.editor.setValue(options.code);

    this.editor.refresh();
  };

  var link = function(scope, element, attrs, editor) {
    scope.$watch('visible', function(visible) {
      if (visible) {
        editor.refresh(scope);
      }
    });
  };

  RAML.Directives.codeMirror = function() {
    return {
      link: link,
      restrict: 'A',
      replace: true,
      controller: Controller,
      scope: {
        code: "=codeMirror",
        visible: "=",
        mode: "@?"
      }
    }
  }

  RAML.Directives.codeMirror.Controller = Controller;
})();

(function() {
  'use strict';

  // NOTE: This directive relies on the collapsible content
  // and collapsible toggle to live in the same scope.

  var Controller = function() {};

  RAML.Directives.collapsible = function() {
    return {
      controller: Controller,
      restrict: 'EA',
      scope: true,
      link: {
        pre: function(scope, element, attrs) {
          if (attrs.hasOwnProperty('collapsed')) {
            scope.collapsed = true;
          }
        }
      }
    }
  };

  RAML.Directives.collapsibleToggle = function() {
    return {
      require: '^collapsible',
      restrict: 'EA',
      link: function(scope, element, attrs, controller) {
        element.bind('click', function() {
          scope.$apply(function() {
            scope.collapsed = !scope.collapsed;
          });
        });
      }
    }
  };

  RAML.Directives.collapsibleContent = function() {
    return {
      require: '^collapsible',
      restrict: 'EA',
      link: function(scope, element, attrs) {
        scope.$watch('collapsed', function(collapsed) {
          element.css("display", collapsed ? "none" : "block");
          element.parent().removeClass("collapsed expanded");
          element.parent().addClass(collapsed ? "collapsed" : "expanded");
        });
      }
    }
  };

})();

(function() {
  'use strict';

  function isEmpty(object) {
    return Object.keys(object || {}).length == 0;
  }

  var controller = function($scope) {
    $scope.documentation = this;

    this.hasParameterDocumentation = $scope.resource.uriParameters || $scope.method.queryParameters || $scope.method.headers;
    this.hasRequestDocumentation = !isEmpty($scope.method.body);
    this.hasResponseDocumentation = !isEmpty($scope.method.responses);
  };

  RAML.Directives.documentation = function() {
    return {
      controller: controller,
      restrict: 'E',
      templateUrl: 'views/documentation.tmpl.html',
      replace: true
    }
  }
})();

(function() {
  'use strict';

  RAML.Directives.markdown = function($sanitize) {
    var converter = new Showdown.converter();

    var link = function($scope, $element, $attrs) {
      var result = converter.makeHtml($scope.markdown || '');

      $element.html($sanitize(result));
    };

    return {
      restrict: 'A',
      link: link,
      scope: {
        markdown: '='
      }
    }
  };
})();

(function() {
  'use strict';

  var controller = function($scope) {
    $scope.methodView = this;
    this.currentTab = 'documentation';
  };

  controller.prototype.toggleExpansion = function() {
    this.expanded = !this.expanded;
  };

  controller.prototype.openTab = function(tab, $event) {
    if (this.expanded)
      $event.stopPropagation();

    this.currentTab = tab;
  };

  RAML.Directives.method = function() {
    return {
      controller: controller,
      restrict: 'E',
      templateUrl: 'views/method.tmpl.html',
      replace: true
    }
  }
})();

(function() {
  RAML.Directives.namedParameters = function() {
    return {
      restrict: 'E',
      link: function() {},
      templateUrl: 'views/named_parameters.tmpl.html',
      replace: true,
      scope: {
        heading: '@',
        parameters: '=',
        requestData: '='
      }
    }
  }
})();

(function() {
  'use strict';

  RAML.Directives.parameterTable = function() {

    var link = function($scope, $element, $attrs) {
    }

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'views/parameter_table.tmpl.html',
      replace: true,
      scope: {
        heading: '@',
        parameters: '='
      }
    }
  }
})();

(function() {
  'use strict';

  var Controller = function($scope) {
    $scope.pathBuilder = $scope.method.pathBuilder = new RAML.Inspector.PathBuilder.create($scope.resource.pathSegments);
  }

  RAML.Directives.pathBuilder = function() {

    var link = function($scope, $element, $attrs) { }

    return {
      restrict: 'E',
      link: link,
      controller: Controller,
      templateUrl: 'views/path_builder.tmpl.html',
      replace: true
    }
  }
})();

(function() {
  'use strict';

  var Controller = function($scope, $attrs, ramlParser) {
    $scope.ramlConsole = this;

    if ($attrs.hasOwnProperty('withRootDocumentation')) {
      this.withRootDocumentation = true;
    }

    var success = function(raml) {
      $scope.api = this.api = RAML.Inspector.create(raml);
      $scope.$apply();
    }

    var error = function(error) {
      $scope.parseError = error;
      $scope.$apply();
    }

    if ($scope.src) {
      ramlParser.loadFile($scope.src).then(success.bind(this), error);
    }
  };

  Controller.prototype.gotoView = function(view) {
    this.view = view;
  };

  Controller.prototype.showRootDocumentation = function() {
    return this.withRootDocumentation && this.api && this.api.documentation && this.api.documentation.length > 0;
  };

  RAML.Directives.ramlConsole = function(ramlParser) {

    var link = function ($scope, $el, $attrs, controller) {
      // FIXME: move this to the app on module('ramlConsoleApp').run...
      $scope.$on('event:raml-parsed', function(e, raml) {
        $scope.api = controller.api = RAML.Inspector.create(raml);
      });
    }

    return {
      restrict: 'E',
      templateUrl: 'views/raml-console.tmpl.html',
      controller: Controller,
      scope: {
        src: '@'
      },
      link: link
    }
  };
})();

(function() {
  'use strict';

  RAML.Directives.ramlConsoleInitializer = function() {
    var controller = function($scope) {
      $scope.consoleLoader = this;
    }

    controller.prototype.load = function() {
      this.locationSet = true;
    };

    var link = function($scope, $element, $attrs, controller) {
      if (document.location.search.indexOf("?raml=") != -1) {
        controller.location = document.location.search.replace("?raml=", '');
        controller.locationSet = true;
      }
    }

    return { restrict: 'E', controller: controller, link: link }
  }
})();

(function() {
  'use strict';

  var controller = function($scope) {
    $scope.resourceSummary = this;
    this.resource = $scope.resource;
  };

  controller.prototype.type = function() {
    if (angular.isObject(this.resource.resourceType)) {
      return Object.keys(this.resource.resourceType)[0];
    } else {
      return this.resource.resourceType;
    }
  };

  RAML.Directives.resourceSummary = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/resource_summary.tmpl.html',
      replace: true,
      controller: controller
    }
  }
})();

(function() {
  'use strict';

  ////////////
  // tabset
  ////////////

  RAML.Directives.tabset = function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      controller: RAML.Controllers.tabset,
      templateUrl: 'views/tabset.tmpl.html'
    }
  };

  ////////////////
  // tabs
  ///////////////

  var link = function($scope, $element, $attrs, tabsetCtrl) {
    tabsetCtrl.addTab($scope)
  };

  RAML.Directives.tab = function() {

    return {
      restrict: 'E',
      require: '^tabset',
      replace: true,
      transclude: true,
      link: link,
      templateUrl: 'views/tab.tmpl.html',
      scope: {
        heading: '@',
        active: '=?',
        disabled: '=?'
      }
    }

  };
})();

(function() {
  'use strict';

  RAML.Directives.tryIt = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/try_it.tmpl.html',
      replace: true,
      controller: RAML.Controllers.tryIt
    }
  }
})();

RAML.Filters = {};

(function() {
  'use strict';

  RAML.Filters.yesNo = function() {
    return function(input) {
      return input ? 'Yes' : 'No';
    };
  }
})();

'use strict';

angular.module('raml', []).factory('ramlParser', function () {
  return RAML.Parser;
});

var module = angular.module('ramlConsoleApp', ['raml', 'ngSanitize']);

module.directive('codeMirror', RAML.Directives.codeMirror);
module.directive('collapsible', RAML.Directives.collapsible);
module.directive('collapsibleContent', RAML.Directives.collapsibleContent);
module.directive('collapsibleToggle', RAML.Directives.collapsibleToggle);
module.directive('documentation', RAML.Directives.documentation);
module.directive('markdown', RAML.Directives.markdown);
module.directive('method', RAML.Directives.method);
module.directive('namedParameters', RAML.Directives.namedParameters);
module.directive('parameterTable', RAML.Directives.parameterTable);
module.directive('pathBuilder', RAML.Directives.pathBuilder);
module.directive('ramlConsole', RAML.Directives.ramlConsole);
module.directive('ramlConsoleInitializer', RAML.Directives.ramlConsoleInitializer);
module.directive('resourceSummary', RAML.Directives.resourceSummary);
module.directive('tab', RAML.Directives.tab);
module.directive('tabset', RAML.Directives.tabset);
module.directive('tryIt', RAML.Directives.tryIt);

module.controller('TryItController', RAML.Controllers.tryIt);

module.filter('yesNo', RAML.Filters.yesNo);

angular.module("ramlConsoleApp").run(["$templateCache", function($templateCache) {

  $templateCache.put("views/api_resources.tmpl.html",
    "<div class='accordion' role=\"resources\">\n" +
    "  <div ng-class=\"{expanded: resource.isOpen}\" class='accordion-group' role=\"resource\" ng-repeat=\"resource in api.resources\">\n" +
    "    <resource-summary class='accordion-heading accordion-toggle' ng-click='resource.isOpen = !resource.isOpen'></resource-summary>\n" +
    "    <div class='accordion-body' ng-show='resource.isOpen'>\n" +
    "      <div class='accordion-inner'>\n" +
    "        <div class='accordion' role=\"methods\">\n" +
    "          <method ng-repeat=\"method in resource.methods\"></method>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("views/documentation.tmpl.html",
    "<section role='documentation'>\n" +
    "  <p ng-show=\"method.description\">Description: {{method.description}}</p>\n" +
    "\n" +
    "  <tabset>\n" +
    "    <tab role='documentation-parameters' heading=\"Parameters\" disabled=\"!documentation.hasParameterDocumentation\">\n" +
    "      <parameter-table heading='Headers' role='headers' parameters='method.headers'></parameter-table>\n" +
    "      <parameter-table heading='URI Parameters' role='uri-parameters' parameters='resource.uriParameters'></parameter-table>\n" +
    "      <parameter-table heading='Query Parameters' role='query-parameters' parameters='method.queryParameters'></parameter-table>\n" +
    "      <parameter-table heading='Form Parameters' role='form-parameters' parameters='method.body[\"application/x-www-form-urlencoded\"].formParameters'></parameter-table>\n" +
    "      <parameter-table heading='Multipart Form Parameters' role='multipart-form-parameters' parameters='method.body[\"multipart/form-data\"].formParameters'></parameter-table>\n" +
    "\n" +
    "    </tab>\n" +
    "    <tab role='documentation-requests' heading=\"Requests\" active='documentation.requestsActive' disabled=\"!documentation.hasRequestDocumentation\">\n" +
    "      <div ng-repeat=\"(mediaType, definition) in method.body track by mediaType\">\n" +
    "        <h2>{{mediaType}}</h2>\n" +
    "        <div ng-if=\"definition.schema\">\n" +
    "          <h3>Request Schema</h3>\n" +
    "          <div class=\"code\" code-mirror=\"definition.schema\" mode=\"{{mediaType}}\" visible=\"methodView.expanded && documentation.requestsActive\"></div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"definition.example\">\n" +
    "          <h3>Example Request</h3>\n" +
    "          <div class=\"code\" code-mirror=\"definition.example\" mode=\"{{mediaType}}\" visible=\"methodView.expanded && documentation.requestsActive\"></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </tab>\n" +
    "    <tab role='documentation-responses' heading=\"Responses\" active='documentation.responsesActive' disabled='!documentation.hasResponseDocumentation'>\n" +
    "      <h2>Responses</h2>\n" +
    "      <div ng-repeat='(responseCode, response) in method.responses'>\n" +
    "        <div collapsible>\n" +
    "          <div collapsible-toggle>\n" +
    "            <h3>\n" +
    "              <a href=\"\">\n" +
    "                <i ng-class=\"{'icon-caret-right': collapsed, 'icon-caret-down': !collapsed}\"></i>\n" +
    "                {{responseCode}}\n" +
    "              </a>\n" +
    "            </h3>\n" +
    "          </div>\n" +
    "        <div collapsible-content>\n" +
    "          <section role='response'>\n" +
    "            <p markdown='response.description'></p>\n" +
    "            <div ng-repeat=\"(mediaType, definition) in response.body track by mediaType\">\n" +
    "              <h2>{{mediaType}}</h2>\n" +
    "              <div ng-if=\"definition.schema\">\n" +
    "                <h3>Response Schema</h3>\n" +
    "                <div class=\"code\" mode='{{mediaType}}' code-mirror=\"definition.schema\" visible=\"methodView.expanded && documentation.responsesActive\"></div>\n" +
    "              </div>\n" +
    "              <div ng-if=\"definition.example\">\n" +
    "                <h3>Example Response</h3>\n" +
    "                <div class=\"code\" mode='{{mediaType}}' code-mirror=\"definition.example\" visible=\"methodView.expanded && documentation.responsesActive\"></div>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </section>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </tab>\n" +
    "  </tabset>\n" +
    "</section>\n"
  );

  $templateCache.put("views/method.tmpl.html",
    "<div class='accordion-group' role=\"method\">\n" +
    "  <div class='accordion-heading accordion-toggle' role=\"methodSummary\" ng-class=\"{expanded: methodView.expanded}\" ng-click='methodView.toggleExpansion()'>\n" +
    "    <i ng-class=\"{'icon-caret-right': !methodView.expanded, 'icon-caret-down': methodView.expanded}\"></i>\n" +
    "    <span role=\"verb\">{{method.method}}:</span>\n" +
    "    <path-builder></path-builder>\n" +
    "    <div class=\"pull-right actions\">\n" +
    "      <button role=\"try-it-tab\" class=\"btn\" ng-click=\"methodView.openTab('tryIt', $event)\">Try It</button>\n" +
    "      <i class=\"icon-file-alt documentation\" ng-click=\"methodView.openTab('documentation', $event)\"></i>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class='accordion-body' ng-show='methodView.expanded'>\n" +
    "    <div class='accordion-inner'>\n" +
    "      <documentation ng-show=\"methodView.currentTab == 'documentation'\"></documentation>\n" +
    "\n" +
    "      <try-it ng-show=\"methodView.currentTab == 'tryIt'\"></try-it>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("views/named_parameters.tmpl.html",
    "<fieldset class='labelled-inline' ng-show=\"parameters\">\n" +
    "  <legend>{{heading}}</legend>\n" +
    "  <div class=\"control-group\" ng-repeat=\"(parameterName, parameter) in parameters track by parameterName\">\n" +
    "    <label for=\"{{paremeterName}}\">{{parameter.displayName}}</label>\n" +
    "    <input type=\"text\" name=\"{{parameterName}}\" ng-model='requestData[parameterName]'/>\n" +
    "  </div>\n" +
    "</fieldset>\n"
  );

  $templateCache.put("views/parameter_table.tmpl.html",
    "<section class='parameterTable' ng-show='parameters'>\n" +
    "  <h3>{{heading}}</h3>\n" +
    "  <table>\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th>Param</th>\n" +
    "        <th>Type</th>\n" +
    "        <th>Description</th>\n" +
    "        <th>Example</th>\n" +
    "        <th>Repeatable</th>\n" +
    "        <th>Default</th>\n" +
    "        <th>Required</th>\n" +
    "        <th>Minimum</th>\n" +
    "        <th>Maximum</th>\n" +
    "        <th>Minimum Length</th>\n" +
    "        <th>Maximum Length</th>\n" +
    "        <th>Valid Values</th>\n" +
    "        <th>Pattern</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr role='parameter' ng-repeat='param in parameters'>\n" +
    "        <td><strong>{{param.displayName}}</strong></td>\n" +
    "        <td><em>{{param.type}}</em></td>\n" +
    "        <td>{{param.description}}</td>\n" +
    "        <td>{{param.example}}</td>\n" +
    "        <td>{{param.repeat | yesNo}}</td>\n" +
    "        <td>{{param.default}}</td>\n" +
    "        <td>{{param.required | yesNo}}</td>\n" +
    "        <td>{{param.minimum}}</td>\n" +
    "        <td>{{param.maximum}}</td>\n" +
    "        <td>{{param.minLength}}</td>\n" +
    "        <td>{{param.maxLength}}</td>\n" +
    "        <td>{{param.enum}}</td>\n" +
    "        <td>{{param.pattern}}</td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</section>\n"
  );

  $templateCache.put("views/path_builder.tmpl.html",
    "<span role=\"path\">\n" +
    "  <span role='segment' ng-repeat='segment in pathBuilder.segments'>\n" +
    "    <input ng-if='segment.templated' ng-click=\"$event.stopPropagation();\" ng-model=\"pathBuilder[segment.parameterName]\" type=\"text\" placeholder=\"{{segment.toString()}}\" />\n" +
    "    <span  ng-if='!segment.templated'>{{segment.toString()}}</span>\n" +
    "  </span>\n" +
    "</span>\n"
  );

  $templateCache.put("views/raml-console.tmpl.html",
    "<article role=\"api-console\">\n" +
    "  <section role=\"error\" ng-if=\"parseError\">\n" +
    "    {{parseError}}\n" +
    "  </section>\n" +
    "\n" +
    "  <h1 id=\"api-title\">{{api.title}}</h1>\n" +
    "\n" +
    "  <nav id=\"main-nav\" ng-if='ramlConsole.showRootDocumentation()' ng-switch='ramlConsole.view'>\n" +
    "    <a class=\"btn inverted\" ng-switch-when='rootDocumentation' role=\"view-api-reference\" ng-click='ramlConsole.gotoView(\"apiReference\")'>&larr; API Reference</a>\n" +
    "    <a class=\"btn inverted\" ng-switch-default role=\"view-root-documentation\" ng-click='ramlConsole.gotoView(\"rootDocumentation\")'>Documentation &rarr;</a>\n" +
    "  </nav>\n" +
    "\n" +
    "  <div id=\"content\" ng-switch='ramlConsole.view'>\n" +
    "    <ng-include ng-switch-when='rootDocumentation' src=\"'views/root_documentation.tmpl.html'\"></ng-include>\n" +
    "    <ng-include ng-switch-default src=\"'views/api_resources.tmpl.html'\"></ng-include>\n" +
    "  </div>\n" +
    "</article>\n"
  );

  $templateCache.put("views/resource_summary.tmpl.html",
    "<div role='resourceSummary'>\n" +
    "  <ul role=\"traits\">\n" +
    "    <li role=\"trait\" ng-repeat=\"trait in resource.traits\">{{trait}}</li>\n" +
    "  </ul>\n" +
    "  <h2>\n" +
    "    <span role='segment' ng-repeat='segment in resource.pathSegments'>{{segment}}</span>\n" +
    "  </h2>\n" +
    "\n" +
    "  <ul class='byline'>\n" +
    "    <li ng-show='resource.name'>\n" +
    "      \"{{resource.name}}\"\n" +
    "    </li>\n" +
    "    <li ng-if='resource.resourceType'>\n" +
    "      Type: <span role=\"resourceType\">{{resourceSummary.type()}}</span>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <ul role=\"methods\" ng-class=\"{hidden: resource.isOpen}\">\n" +
    "    <li role=\"{{method}}\" ng-repeat=\"method in resource.methods\">{{method.method}}</li>\n" +
    "  </ul>\n" +
    "</div>\n"
  );

  $templateCache.put("views/root_documentation.tmpl.html",
    "<div role=\"root-documentation\">\n" +
    "  <section collapsible collapsed ng-repeat=\"document in api.documentation\">\n" +
    "    <h2 collapsible-toggle>{{document.title}}</h2>\n" +
    "    <div collapsible-content class=\"content\">\n" +
    "      <div markdown='document.content'></div>\n" +
    "    </div>\n" +
    "  </section>\n" +
    "</div>\n"
  );

  $templateCache.put("views/tab.tmpl.html",
    "<div class=\"tab-pane\" ng-class=\"{active: active, disabled: disabled}\" ng-show=\"active\" ng-transclude>\n" +
    "\n" +
    "</div>\n"
  );

  $templateCache.put("views/tabset.tmpl.html",
    "<div class=\"tabbable\">\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ng-repeat=\"tab in tabs\" ng-class=\"{active: tab.active, disabled: tab.disabled}\">\n" +
    "      <a ng-click=\"tabset.select(tab)\">{{tab.heading}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\" ng-transclude></div>\n" +
    "</div>\n"
  );

  $templateCache.put("views/try_it.tmpl.html",
    "<section class=\"try-it\">\n" +
    "\n" +
    "  <form>\n" +
    "    <named-parameters heading=\"Headers\" parameters=\"method.headers\" request-data=\"apiClient.headers\"></named-parameters>\n" +
    "    <named-parameters heading=\"Query Parameters\" parameters=\"method.queryParameters\" request-data=\"apiClient.queryParameters\"></named-parameters>\n" +
    "\n" +
    "    <fieldset class=\"media-types\" ng-show=\"apiClient.supportsMediaType\">\n" +
    "      <span class=\"radio-group-label\">Content Type</span>\n" +
    "      <label class=\"radio\" ng-repeat=\"(mediaType, _) in method.body track by mediaType\">\n" +
    "        <input type=\"radio\" name=\"media-type\" value=\"{{mediaType}}\" ng-model=\"apiClient.mediaType\">\n" +
    "        {{mediaType}}\n" +
    "      </label>\n" +
    "    </fieldset>\n" +
    "    <div class=\"request-body\" ng-show=\"method.body\">\n" +
    "      <fieldset ng-show=\"apiClient.showBody()\">\n" +
    "        <legend>Body</legend>\n" +
    "        <textarea name=\"body\" ng-model='apiClient.body' ng-model=\"apiClient.body\"></textarea>\n" +
    "      </fieldset>\n" +
    "      <named-parameters heading='Form Parameters' parameters='method.body[\"application/x-www-form-urlencoded\"].formParameters' request-data=\"apiClient.formParameters\" ng-if=\"apiClient.showUrlencodedForm()\"></named-parameters>\n" +
    "      <named-parameters heading='Form Parameters' parameters='method.body[\"multipart/form-data\"].formParameters' request-data=\"apiClient.formParameters\" ng-if=\"apiClient.showMultipartForm()\"></named-parameters>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-actions\">\n" +
    "      <button role=\"try-it\" class=\"btn inverted\" ng-click=\"apiClient.execute()\">\n" +
    "        Try It\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "\n" +
    "  <div class=\"response\" ng-if=\"apiClient.response\">\n" +
    "    <h3>Response</h3>\n" +
    "    <div class=\"request-url\">\n" +
    "      <h4>Request URL</h4>\n" +
    "      <span class=\"response-value\">{{apiClient.response.requestUrl}}</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"status\">\n" +
    "      <h4>Status</h4>\n" +
    "      <span class=\"response-value\">{{apiClient.response.status}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"headers\">\n" +
    "      <h4>Headers</h4>\n" +
    "      <ul class=\"response-value\">\n" +
    "        <li ng-repeat=\"(header, value) in apiClient.response.headers\">\n" +
    "          <span class=\"header-key\">{{header}}:</span>\n" +
    "          <span class=\"header-value\">{{value}}</span>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "    <div class=\"body\">\n" +
    "      <h4>Body</h4>\n" +
    "      <div class=\"response-value\">\n" +
    "        <div class=\"code\" mode='{{apiClient.response.contentType}}' code-mirror=\"apiClient.response.body\" visible=\"apiClient.response.body\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</section>\n"
  );

}]);

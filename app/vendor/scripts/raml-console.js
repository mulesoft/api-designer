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

  exports.methodOverviewSource = function(method) {
    return {
      verb: method.method,
      description: method.description,
      queryParameters: method.queryParameters,
      body: method.body
    }
  };

  exports.resourceOverviewSource = function(pathSegments, resource) {
    return {
      pathSegments: pathSegments,
      name: resource.displayName,
      methods: (resource.methods || []).map(exports.methodOverviewSource),
      traits: resource.is,
      resourceType: resource.type,
      uriParameters: resource.uriParameters
    }
  };

  exports.create = function(api) {
    var resources = extractResources([], api)
    return {
      title: api.title,
      resources: resources,
      baseUri: api.baseUri
    }
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
  function isEmpty(object) {
    return Object.keys(object || {}).length == 0;
  }

  TryIt = function($scope, $http) {
    this.baseUri = $scope.api.baseUri || "";
    this.pathBuilder = $scope.method.pathBuilder;
    this.method = $scope.method;

    this.httpMethod = $http[$scope.method.verb];
    this.queryParameters = {};
    this.supportsMediaType = !isEmpty($scope.method.body);

    $scope.apiClient = this;
  };

  TryIt.prototype.hasQueryParameters = function() {
    return this.method.queryParameters && Object.keys(this.method.queryParameters).length > 0;
  };

  TryIt.prototype.execute = function() {
    var url = this.baseUri + this.pathBuilder(this.pathBuilder);
    var response = this.response = {};
    var requestOptions = {};

    if (!isEmpty(this.queryParameters)) {
      requestOptions.params = this.queryParameters;
    }

    if (this.mediaType) {
      requestOptions.headers = { 'Content-Type': this.mediaType };
      requestOptions.data = this.body;
    }

    this.httpMethod(url, requestOptions).then(function(httpResponse) {
      response.body = httpResponse.data,
      response.status = httpResponse.status,
      response.headers = httpResponse.headers()
    });
  };

  RAML.Controllers.TryIt = TryIt;
})();

(function() {
  RAML.Directives = {};
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

  RAML.Directives.ramlConsole = function(ramlParser) {
    var importAndParseRaml = function(src) {
      return ramlParser.loadFile(src).then(function (raml) {
        return raml;
      });
    }

    var link = function ($scope, $el, $attrs) {
      var success = function(raml) {
        $scope.api = RAML.Inspector.create(raml);
        $scope.$apply();
      }

      var error = function(error) {
        $scope.parseError = error;
        $scope.$apply();
      }

      // FIXME: move to a controller
      if ($scope.src) {
        importAndParseRaml($scope.src).then(success, error);
      }

      // FIXME: move this to the app on module('ramlConsoleApp').run...
      $scope.$on('event:raml-parsed', function(e, raml) {
        $scope.api = RAML.Inspector.create(raml);
      });
    }

    return {
      restrict: 'E',
      templateUrl: 'views/raml-console.tmpl.html',
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

  RAML.Directives.tryIt = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/try_it.tmpl.html',
      replace: true,
      controller: RAML.Controllers.TryIt
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

var module = angular.module('ramlConsoleApp', ['raml']);

module.directive('method', RAML.Directives.method);
module.directive('parameterTable', RAML.Directives.parameterTable);
module.directive('pathBuilder', RAML.Directives.pathBuilder);
module.directive('ramlConsole', RAML.Directives.ramlConsole);
module.directive('ramlConsoleInitializer', RAML.Directives.ramlConsoleInitializer);
module.directive('resourceSummary', RAML.Directives.resourceSummary);
module.directive('tryIt', RAML.Directives.tryIt);

module.controller('TryItController', RAML.Controllers.TryIt);

module.filter('yesNo', RAML.Filters.yesNo);

angular.module("ramlConsoleApp").run(["$templateCache", function($templateCache) {

  $templateCache.put("views/method.tmpl.html",
    "<div class='accordion-group' role=\"method\">\n" +
    "  <div class='accordion-heading accordion-toggle' role=\"methodSummary\" ng-class=\"{expanded: methodView.expanded}\" ng-click='methodView.toggleExpansion()'>\n" +
    "    <i ng-class=\"{'icon-caret-right': !methodView.expanded, 'icon-caret-down': methodView.expanded}\"></i>\n" +
    "    <span role=\"verb\">{{method.verb}}:</span>\n" +
    "    <path-builder></path-builder>\n" +
    "    <div class=\"pull-right actions\">\n" +
    "      <button role=\"try-it-tab\" class=\"btn\" ng-click=\"methodView.openTab('tryIt', $event)\">Try It</button>\n" +
    "      <i class=\"icon-file-alt documentation\" ng-click=\"methodView.openTab('documentation', $event)\"></i>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class='accordion-body' ng-show='methodView.expanded'>\n" +
    "    <div class='accordion-inner'>\n" +
    "      <section role='documentation' ng-show=\"methodView.currentTab == 'documentation'\">\n" +
    "        <p ng-show=\"method.description\">Description: {{method.description}}</p>\n" +
    "\n" +
    "        <parameter-table heading='URI Parameters' role='uri-parameters' parameters='resource.uriParameters'></parameter-table>\n" +
    "        <parameter-table heading='Query Parameters' role='query-parameters' parameters='method.queryParameters'></parameter-table>\n" +
    "      </section>\n" +
    "\n" +
    "      <try-it ng-show=\"methodView.currentTab == 'tryIt'\"></try-it>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
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
    "  <h1>{{api.title}}</h1>\n" +
    "\n" +
    "  <div class='accordion' role=\"resources\">\n" +
    "    <div ng-class=\"{expanded: resource.isOpen}\" class='accordion-group' role=\"resource\" ng-repeat=\"resource in api.resources\">\n" +
    "      <resource-summary class='accordion-heading accordion-toggle' ng-click='resource.isOpen = !resource.isOpen'></resource-summary>\n" +
    "      <div class='accordion-body' ng-show='resource.isOpen'>\n" +
    "        <div class='accordion-inner'>\n" +
    "          <div class='accordion' role=\"methods\">\n" +
    "            <method ng-repeat=\"method in resource.methods\"></method>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
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
    "    <li role=\"{{method}}\" ng-repeat=\"method in resource.methods\">{{method.verb}}</li>\n" +
    "  </ul>\n" +
    "</div>\n"
  );

  $templateCache.put("views/try_it.tmpl.html",
    "<section class=\"try-it\">\n" +
    "\n" +
    "  <form>\n" +
    "    <fieldset class='labelled-inline'>\n" +
    "      <legend ng-show='apiClient.hasQueryParameters()'>Query Parameters</legend>\n" +
    "      <div class=\"control-group\" ng-repeat=\"(paramName,paramParameters) in method.queryParameters track by paramName\">\n" +
    "        <label for=\"{{paramName}}\">{{paramParameters.displayName}}</label>\n" +
    "        <input type=\"text\" name=\"{{paramName}}\" ng-model='apiClient.queryParameters[paramName]'/>\n" +
    "      </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "    <fieldset>\n" +
    "      <legend>Body</legend>\n" +
    "      <fieldset class=\"media-types\" ng-show=\"apiClient.supportsMediaType\">\n" +
    "        <span class=\"radio-group-label\">Content Type</span>\n" +
    "        <label class=\"radio\" ng-repeat=\"(mediaType, _) in method.body track by mediaType\">\n" +
    "          <input type=\"radio\" name=\"media-type\" value=\"{{mediaType}}\" ng-model=\"apiClient.mediaType\">\n" +
    "          {{mediaType}}\n" +
    "        </label>\n" +
    "      </fieldset>\n" +
    "      <textarea name=\"body\" ng-model='apiClient.body' ng-model=\"apiClient.body\"></textarea>\n" +
    "    </fieldset>\n" +
    "\n" +
    "    <div class=\"form-actions\">\n" +
    "      <button role=\"try-it\" class=\"btn inverted\" ng-click=\"apiClient.execute()\">\n" +
    "        Try It\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "\n" +
    "  <div class=\"response\" ng-show=\"apiClient.response\">\n" +
    "    <h3>Response</h3>\n" +
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
    "        {{apiClient.response.body}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</section>\n"
  );

}]);

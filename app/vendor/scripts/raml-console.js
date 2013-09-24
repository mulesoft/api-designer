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
      description: method.description
    }
  };

  exports.resourceOverviewSource = function(pathSegments, resource) {
    return {
      pathSegments: pathSegments,
      name: resource.displayName,
      methods: (resource.methods || []).map(exports.methodOverviewSource),
      traits: resource.is,
      resourceType: resource.type
    }
  };

  exports.create = function(api) {
    var resources = extractResources([], api)
    return {
      title: api.title,
      resources: resources
    }
  };

  return exports;
})();

RAML.Directives = {};

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

'use strict';

angular.module('raml', []).factory('ramlParser', function () {
  return RAML.Parser;
});

var module = angular.module('ramlConsoleApp', ['raml', 'ui.bootstrap']);
module.directive('ramlConsole', RAML.Directives.ramlConsole);
module.directive('ramlConsoleInitializer', RAML.Directives.ramlConsoleInitializer);

angular.module("ramlConsoleApp").run(["$templateCache", function($templateCache) {

  $templateCache.put("views/raml-console.tmpl.html",
    "<article role=\"api-console\">\n" +
    "  <section role=\"error\" ng-if=\"parseError\">\n" +
    "    {{parseError}}\n" +
    "  </section>\n" +
    "\n" +
    "  <h1>{{api.title}}</h1>\n" +
    "\n" +
    "  <accordion role=\"resources\" close-others=\"false\">\n" +
    "    <accordion-group role=\"resource\" ng-repeat=\"resource in api.resources\" is-open=\"resource.isOpen\">\n" +
    "      <accordion-heading>\n" +
    "        <ul role=\"traits\">\n" +
    "          <li role=\"trait\" ng-repeat=\"trait in resource.traits\">{{trait}}</li>\n" +
    "        </ul>\n" +
    "        <h2>\n" +
    "          <span role='segment' ng-repeat='segment in resource.pathSegments'>{{segment}}</span>\n" +
    "        </h2>\n" +
    "\n" +
    "        <span role=\"displayName\" ng-show='resource.name'>\n" +
    "          \"{{resource.name}}\"\n" +
    "          <span ng-show='resource.resourceType'>\n" +
    "            |\n" +
    "          </span>\n" +
    "        </span>\n" +
    "        <span role=\"resourceType\" ng-show='resource.resourceType'>\n" +
    "          Type: <span>{{resource.resourceType}}</span>\n" +
    "        </span>\n" +
    "\n" +
    "        <ul role=\"methods\" ng-class=\"{'hidden': resource.isOpen}\">\n" +
    "          <li role=\"{{method}}\" ng-repeat=\"method in resource.methods\">{{method.verb}}</li>\n" +
    "        </ul>\n" +
    "      </accordion-heading>\n" +
    "      <accordion role=\"methodSummaries\" close-others=\"false\">\n" +
    "        <accordion-group role=\"methodSummary\" ng-repeat=\"method in resource.methods\" is-open=\"method.isOpen\">\n" +
    "          <accordion-heading>\n" +
    "            <i ng-class=\"{'icon-caret-right': !method.isOpen, 'icon-caret-down': method.isOpen}\"></i>\n" +
    "            <span role=\"method\">{{method.verb}}</span>\n" +
    "            <span role=\"path\">\n" +
    "              <span role='segment' ng-repeat='segment in resource.pathSegments'>{{segment}}</span>\n" +
    "            </span>\n" +
    "            <div class=\"pull-right\">\n" +
    "              <button role=\"try-it\" class=\"btn\">Try It</button>\n" +
    "              <i class=\"icon-file-alt\"></i>\n" +
    "            </div>\n" +
    "          </accordion-heading>\n" +
    "          <h3 role='description'>Description: {{method.description}}</h3>\n" +
    "        </accordion-group>\n" +
    "      </accordion>\n" +
    "    </accordion-group>\n" +
    "  </accordion>\n" +
    "</article>\n"
  );

}]);

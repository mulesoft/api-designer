/**
* vkBeautify - javascript plugin to pretty-print or minify text in XML, JSON, CSS and SQL formats.
*  
* Version - 0.99.00.beta 
* Copyright (c) 2012 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/vkbeautify/
* 
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*   Pretty print
*
*        vkbeautify.xml(text [,indent_pattern]);
*        vkbeautify.json(text [,indent_pattern]);
*        vkbeautify.css(text [,indent_pattern]);
*        vkbeautify.sql(text [,indent_pattern]);
*
*        @text - String; text to beatufy;
*        @indent_pattern - Integer | String;
*                Integer:  number of white spaces;
*                String:   character string to visualize indentation ( can also be a set of white spaces )
*   Minify
*
*        vkbeautify.xmlmin(text [,preserve_comments]);
*        vkbeautify.jsonmin(text);
*        vkbeautify.cssmin(text [,preserve_comments]);
*        vkbeautify.sqlmin(text);
*
*        @text - String; text to minify;
*        @preserve_comments - Bool; [optional];
*                Set this flag to true to prevent removing comments from @text ( minxml and mincss functions only. )
*
*   Examples:
*        vkbeautify.xml(text); // pretty print XML
*        vkbeautify.json(text, 4 ); // pretty print JSON
*        vkbeautify.css(text, '. . . .'); // pretty print CSS
*        vkbeautify.sql(text, '----'); // pretty print SQL
*
*        vkbeautify.xmlmin(text, true);// minify XML, preserve comments
*        vkbeautify.jsonmin(text);// minify JSON
*        vkbeautify.cssmin(text);// minify CSS, remove comments ( default )
*        vkbeautify.sqlmin(text);// minify SQL
*
*/

(function() {

function createShiftArr(step) {

	var space = '    ';
	
	if ( isNaN(parseInt(step)) ) {  // argument is string
		space = step;
	} else { // argument is integer
		switch(step) {
			case 1: space = ' '; break;
			case 2: space = '  '; break;
			case 3: space = '   '; break;
			case 4: space = '    '; break;
			case 5: space = '     '; break;
			case 6: space = '      '; break;
			case 7: space = '       '; break;
			case 8: space = '        '; break;
			case 9: space = '         '; break;
			case 10: space = '          '; break;
			case 11: space = '           '; break;
			case 12: space = '            '; break;
		}
	}

	var shift = ['\n']; // array of shifts
	for(ix=0;ix<100;ix++){
		shift.push(shift[ix]+space); 
	}
	return shift;
}

function vkbeautify(){
	this.step = '    '; // 4 spaces
	this.shift = createShiftArr(this.step);
};

vkbeautify.prototype.xml = function(text,step) {

	var ar = text.replace(/>\s{0,}</g,"><")
				 .replace(/</g,"~::~<")
				 .replace(/\s*xmlns\:/g,"~::~xmlns:")
				 .replace(/\s*xmlns\=/g,"~::~xmlns=")
				 .split('~::~'),
		len = ar.length,
		inComment = false,
		deep = 0,
		str = '',
		ix = 0,
		shift = step ? createShiftArr(step) : this.shift;

		for(ix=0;ix<len;ix++) {
			// start comment or <![CDATA[...]]> or <!DOCTYPE //
			if(ar[ix].search(/<!/) > -1) { 
				str += shift[deep]+ar[ix];
				inComment = true; 
				// end comment  or <![CDATA[...]]> //
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) { 
					inComment = false; 
				}
			} else 
			// end comment  or <![CDATA[...]]> //
			if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) { 
				str += ar[ix];
				inComment = false; 
			} else 
			// <elm></elm> //
			if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
				/^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) { 
				str += ar[ix];
				if(!inComment) deep--;
			} else
			 // <elm> //
			if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
				str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
			} else 
			 // <elm>...</elm> //
			if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			} else 
			// </elm> //
			if(ar[ix].search(/<\//) > -1) { 
				str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
			} else 
			// <elm/> //
			if(ar[ix].search(/\/>/) > -1 ) { 
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			} else 
			// <? xml ... ?> //
			if(ar[ix].search(/<\?/) > -1) { 
				str += shift[deep]+ar[ix];
			} else 
			// xmlns //
			if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) { 
				str += shift[deep]+ar[ix];
			} 
			
			else {
				str += ar[ix];
			}
		}
		
	return  (str[0] == '\n') ? str.slice(1) : str;
}

vkbeautify.prototype.json = function(text,step) {

	var step = step ? step : this.step;
	
	if (typeof JSON === 'undefined' ) return text; 
	
	if ( typeof text === "string" ) return JSON.stringify(JSON.parse(text), null, step);
	if ( typeof text === "object" ) return JSON.stringify(text, null, step);
		
	return text; // text is not string nor object
}

vkbeautify.prototype.css = function(text, step) {

	var ar = text.replace(/\s{1,}/g,' ')
				.replace(/\{/g,"{~::~")
				.replace(/\}/g,"~::~}~::~")
				.replace(/\;/g,";~::~")
				.replace(/\/\*/g,"~::~/*")
				.replace(/\*\//g,"*/~::~")
				.replace(/~::~\s{0,}~::~/g,"~::~")
				.split('~::~'),
		len = ar.length,
		deep = 0,
		str = '',
		ix = 0,
		shift = step ? createShiftArr(step) : this.shift;
		
		for(ix=0;ix<len;ix++) {

			if( /\{/.exec(ar[ix]))  { 
				str += shift[deep++]+ar[ix];
			} else 
			if( /\}/.exec(ar[ix]))  { 
				str += shift[--deep]+ar[ix];
			} else
			if( /\*\\/.exec(ar[ix]))  { 
				str += shift[deep]+ar[ix];
			}
			else {
				str += shift[deep]+ar[ix];
			}
		}
		return str.replace(/^\n{1,}/,'');
}

//----------------------------------------------------------------------------

function isSubquery(str, parenthesisLevel) {
	return  parenthesisLevel - (str.replace(/\(/g,'').length - str.replace(/\)/g,'').length )
}

function split_sql(str, tab) {

	return str.replace(/\s{1,}/g," ")

				.replace(/ AND /ig,"~::~"+tab+tab+"AND ")
				.replace(/ BETWEEN /ig,"~::~"+tab+"BETWEEN ")
				.replace(/ CASE /ig,"~::~"+tab+"CASE ")
				.replace(/ ELSE /ig,"~::~"+tab+"ELSE ")
				.replace(/ END /ig,"~::~"+tab+"END ")
				.replace(/ FROM /ig,"~::~FROM ")
				.replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ")
				.replace(/ HAVING /ig,"~::~HAVING ")
				//.replace(/ SET /ig," SET~::~")
				.replace(/ IN /ig," IN ")
				
				.replace(/ JOIN /ig,"~::~JOIN ")
				.replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ")
				.replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ")
				.replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ")
				.replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ")
				
				.replace(/ ON /ig,"~::~"+tab+"ON ")
				.replace(/ OR /ig,"~::~"+tab+tab+"OR ")
				.replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ")
				.replace(/ OVER /ig,"~::~"+tab+"OVER ")

				.replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ")
				.replace(/\)\s{0,}SELECT /ig,")~::~SELECT ")
				
				.replace(/ THEN /ig," THEN~::~"+tab+"")
				.replace(/ UNION /ig,"~::~UNION~::~")
				.replace(/ USING /ig,"~::~USING ")
				.replace(/ WHEN /ig,"~::~"+tab+"WHEN ")
				.replace(/ WHERE /ig,"~::~WHERE ")
				.replace(/ WITH /ig,"~::~WITH ")
				
				//.replace(/\,\s{0,}\(/ig,",~::~( ")
				//.replace(/\,/ig,",~::~"+tab+tab+"")

				.replace(/ ALL /ig," ALL ")
				.replace(/ AS /ig," AS ")
				.replace(/ ASC /ig," ASC ")	
				.replace(/ DESC /ig," DESC ")	
				.replace(/ DISTINCT /ig," DISTINCT ")
				.replace(/ EXISTS /ig," EXISTS ")
				.replace(/ NOT /ig," NOT ")
				.replace(/ NULL /ig," NULL ")
				.replace(/ LIKE /ig," LIKE ")
				.replace(/\s{0,}SELECT /ig,"SELECT ")
				.replace(/\s{0,}UPDATE /ig,"UPDATE ")
				.replace(/ SET /ig," SET ")
							
				.replace(/~::~{1,}/g,"~::~")
				.split('~::~');
}

vkbeautify.prototype.sql = function(text,step) {

	var ar_by_quote = text.replace(/\s{1,}/g," ")
							.replace(/\'/ig,"~::~\'")
							.split('~::~'),
		len = ar_by_quote.length,
		ar = [],
		deep = 0,
		tab = this.step,//+this.step,
		inComment = true,
		inQuote = false,
		parenthesisLevel = 0,
		str = '',
		ix = 0,
		shift = step ? createShiftArr(step) : this.shift;;

		for(ix=0;ix<len;ix++) {
			if(ix%2) {
				ar = ar.concat(ar_by_quote[ix]);
			} else {
				ar = ar.concat(split_sql(ar_by_quote[ix], tab) );
			}
		}
		
		len = ar.length;
		for(ix=0;ix<len;ix++) {
			
			parenthesisLevel = isSubquery(ar[ix], parenthesisLevel);
			
			if( /\s{0,}\s{0,}SELECT\s{0,}/.exec(ar[ix]))  { 
				ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"")
			} 
			
			if( /\s{0,}\s{0,}SET\s{0,}/.exec(ar[ix]))  { 
				ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"")
			} 
			
			if( /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(ar[ix]))  { 
				deep++;
				str += shift[deep]+ar[ix];
			} else 
			if( /\'/.exec(ar[ix]) )  { 
				if(parenthesisLevel<1 && deep) {
					deep--;
				}
				str += ar[ix];
			}
			else  { 
				str += shift[deep]+ar[ix];
				if(parenthesisLevel<1 && deep) {
					deep--;
				}
			} 
			var junk = 0;
		}

		str = str.replace(/^\n{1,}/,'').replace(/\n{1,}/g,"\n");
		return str;
}


vkbeautify.prototype.xmlmin = function(text, preserveComments) {

	var str = preserveComments ? text
							   : text.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"")
									 .replace(/[ \r\n\t]{1,}xmlns/g, ' xmlns');
	return  str.replace(/>\s{0,}</g,"><"); 
}

vkbeautify.prototype.jsonmin = function(text) {

	if (typeof JSON === 'undefined' ) return text; 
	
	return JSON.stringify(JSON.parse(text), null, 0); 
				
}

vkbeautify.prototype.cssmin = function(text, preserveComments) {
	
	var str = preserveComments ? text
							   : text.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"") ;

	return str.replace(/\s{1,}/g,' ')
			  .replace(/\{\s{1,}/g,"{")
			  .replace(/\}\s{1,}/g,"}")
			  .replace(/\;\s{1,}/g,";")
			  .replace(/\/\*\s{1,}/g,"/*")
			  .replace(/\*\/\s{1,}/g,"*/");
}

vkbeautify.prototype.sqlmin = function(text) {
	return text.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")");
}

window.vkbeautify = new vkbeautify();

})();


RAML.Inspector = (function() {
  var exports = {};

  function extendMethod(api, method) {
    method.requiresBasicAuthentication = function() {
      var required = false,
          securitySchemes = api.securitySchemes || [],
          securedBy = this.securedBy || [];

      securitySchemes.forEach(function(scheme) {
        securedBy.forEach(function(type) {
          if (scheme[type] && scheme[type].type === "Basic Authentication") {
            required = true;
          }
        });
      });

      return required;
    }
  }

  function extractResources(basePathSegments, api) {
    var resources = [];

    api.resources.forEach(function(resource) {
      var pathSegments = basePathSegments.concat(resource.relativeUri);
      var overview = exports.resourceOverviewSource(pathSegments, resource);
      overview.methods.forEach(function(method) {
        extendMethod(api, method);
      });

      resources.push(overview);

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
    var methods = (resource.methods || []);

    return {
      pathSegments: pathSegments,
      name: resource.displayName,
      methods: methods,
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
    return this.templated ? this.text.replace(/[\/{}]/g, '') : this.text;
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

  TryIt = function($scope, $http, Base64) {
    this.baseUri = $scope.api.baseUri || '';
    this.pathBuilder = $scope.method.pathBuilder;

    this.http = $http;
    this.encoder = Base64;
    this.httpMethod = $scope.method.method;
    this.headers = {};
    this.queryParameters = {};
    this.formParameters = {};
    this.supportsCustomBody = this.supportsFormUrlencoded = this.supportsFormData = false;

    if ($scope.method.requiresBasicAuthentication()) {
      this.basicauth = {};
    }

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
    var response = this.response = {};
    var url = this.response.requestUrl = this.baseUri + this.pathBuilder(this.pathBuilder);
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
      requestOptions.headers = requestOptions.headers || {};
      requestOptions.headers['Content-Type'] = this.mediaType;
      requestOptions.data = this.body;
    }

    if (this.basicauth) {
      var encoded = this.encoder.encode(this.basicauth.username + ":" + this.basicauth.password);
      requestOptions.headers = requestOptions.headers || {};
      requestOptions.headers['Authorization'] = "Basic " + encoded;
    }

    this.http(requestOptions).then(
      this.handleResponse.bind(this), this.handleResponse.bind(this)
    );
  };

  TryIt.prototype.handleResponse = function(httpResponse) {
    this.response.body = httpResponse.data,
      this.response.status = httpResponse.status,
      this.response.headers = httpResponse.headers();

    if (this.response.headers['content-type']) {
      this.response.contentType = this.response.headers['content-type'].split(';')[0];
    }
  }

  RAML.Controllers.tryIt = TryIt;
})();

(function() {
  RAML.Directives = {};
})();

(function() {
  RAML.Directives.basicAuth = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/basic_auth.tmpl.html',
      replace: true
    }
  }
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
  };

  controller.prototype.toggleExpansion = function() {
    this.expanded = !this.expanded;
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

(function() {
  var module = angular.module('raml', [])

  module.factory('ramlParser', function () {
    return RAML.Parser;
  });

  module.factory('Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';

    return {
      encode: function (input) {
       var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
      },

      decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
      }
    };
  });
})();

var module = angular.module('ramlConsoleApp', ['raml', 'ngSanitize']);

module.directive('basicAuth', RAML.Directives.basicAuth);
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

  $templateCache.put("views/basic_auth.tmpl.html",
    "<div>\n" +
    "  <fieldset class=\"labelled-inline\" ng-if=\"method.requiresBasicAuthentication()\">\n" +
    "    <legend>Basic Authentication</legend>\n" +
    "    <div class=\"control-group\">\n" +
    "      <label for=\"username\">username</label>\n" +
    "      <input type=\"text\" name=\"username\" ng-model='apiClient.basicauth.password'/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"control-group\">\n" +
    "      <label for=\"password\">password</label>\n" +
    "      <input type=\"text\" name=\"password\" ng-model='apiClient.basicauth.username'/>\n" +
    "    </div>\n" +
    "  </fieldset>\n" +
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
    "          <div collapsible-content>\n" +
    "            <section role='response'>\n" +
    "              <p markdown='response.description'></p>\n" +
    "              <div ng-repeat=\"(mediaType, definition) in response.body track by mediaType\">\n" +
    "                <h2>{{mediaType}}</h2>\n" +
    "                <div ng-if=\"definition.schema\">\n" +
    "                  <h3>Response Schema</h3>\n" +
    "                  <div class=\"code\" mode='{{mediaType}}' code-mirror=\"definition.schema\" visible=\"methodView.expanded && documentation.responsesActive\"></div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"definition.example\">\n" +
    "                  <h3>Example Response</h3>\n" +
    "                  <div class=\"code\" mode='{{mediaType}}' code-mirror=\"definition.example\" visible=\"methodView.expanded && documentation.responsesActive\"></div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "            </section>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </tab>\n" +
    "    <tab heading=\"Try It\" active=\"documentation.tryItActive\">\n" +
    "      <try-it></try-it>\n" +
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
    "  </div>\n" +
    "  <div class='accordion-body' ng-show='methodView.expanded'>\n" +
    "    <div class='accordion-inner'>\n" +
    "      <documentation></documentation>\n" +
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
    "  <div role='parameter' ng-repeat='param in parameters'>\n" +
    "    <h4>\n" +
    "      <span role=\"display-name\">{{param.displayName}}</span>\n" +
    "    <span class=\"constraints\">\n" +
    "      <span role=\"required\" ng-if=\"param.required\">required, </span><!--\n" +
    "      --><span role=\"enum\" ng-if=\"param.enum\">\n" +
    "        one of\n" +
    "        (<span ng-repeat=\"option in param.enum\"><!--\n" +
    "          -->{{option}}<span ng-if=\"!$last\">, </span><!--\n" +
    "        --></span>)<!--\n" +
    "      --></span><!--\n" +
    "      --><span ng-if=\"!param.enum\" role=\"type\">{{param.type}}</span><!--\n" +
    "      --><span role=\"pattern\" ng-if=\"param.pattern\"> matching {{param.pattern}}</span><!--\n" +
    "      --><span role=\"length\" ng-if=\"param.minLength && param.maxLength\">, {{param.minLength}}-{{param.maxLength}} characters</span><!--\n" +
    "      --><span role=\"length\" ng-if=\"param.minLength && !param.maxLength\">, at least {{param.minLength}} characters</span><!--\n" +
    "      --><span role=\"length\" ng-if=\"param.maxLength && !param.minLength\">, at most {{param.maxLength}} characters</span><!--\n" +
    "\n" +
    "      --><span role=\"range\" ng-if=\"param.minimum && param.maximum\"> between {{param.minimum}}-{{param.maximum}}</span><!--\n" +
    "      --><span role=\"range\" ng-if=\"param.minimum && !param.maximum\"> ≥ {{param.minimum}}</span><!--\n" +
    "      --><span role=\"range\" ng-if=\"param.maximum && !param.minimum\"> ≤ {{param.maximum}}</span><!--\n" +
    "      --><span role=\"repeat\" ng-if=\"param.repeat\">, repeatable</span><!--\n" +
    "      --><span ng-if=\"param.default\">, default: <span role=\"default\">{{param.default}}</span></span>\n" +
    "\n" +
    "    </span>\n" +
    "    </h4>\n" +
    "\n" +
    "    <div class=\"info\">\n" +
    "      <div role=\"description\" markdown=\"param.description\"></div>\n" +
    "      <div ng-if=\"param.example\"><span class=\"label\">Example</span> <span role=\"example\">{{param.example}}</span></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <!--     <h4>\n" +
    "      {{param.displayName}}\n" +
    "      —\n" +
    "      {{param.required}},\n" +
    "      {{param.type}},\n" +
    "      {{param.integerRange}},\n" +
    "      {{param.characterRange}},\n" +
    "      {{param.pattern}},\n" +
    "      {{param.repeatable}}\n" +
    "    </h4>\n" +
    "    <div>Description: {{param.description}}</div>\n" +
    "    <div>Possible values: {{param.enum}}</div>\n" +
    "    <div>Example: {{param.example}}</div>\n" +
    "    <div>Default: {{param.default}}</div>\n" +
    "  </div> -->\n" +
    "\n" +
    "    <!-- <h4>\n" +
    "      {{param.displayName}}\n" +
    "      —\n" +
    "      {{param.type}},\n" +
    "      <ng-if=\"param.minimum && param.maximum\">{{param.minimum}}-{{param.maximum}},</ng-if>\n" +
    "      <ng-if=\"param.minLength\">{{param.minLength}}-{{param.maxLength}} characters,</ng-if>\n" +
    "      <ng-if=\"param.pattern\">{{param.pattern}}</ng-if>\n" +
    "    </h4>\n" +
    "    <div>Description: {{param.description}}</div>\n" +
    "    <div>Possible values: {{param.enum}}</div>\n" +
    "    <div>Example: {{param.example}}</div>\n" +
    "  </div>\n" +
    "\n" +
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
    "  </table> -->\n" +
    "</section>\n"
  );

  $templateCache.put("views/path_builder.tmpl.html",
    "<span role=\"path\">\n" +
    "  <span role='segment' ng-repeat='segment in pathBuilder.segments'>\n" +
    "    <span ng-if='segment.templated'>/<input ng-if='segment.templated' ng-click=\"$event.stopPropagation();\" ng-model=\"pathBuilder[segment.parameterName]\" type=\"text\" placeholder=\"{{segment.toString()}}\" /></span>\n" +
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
    "    <li ng-repeat=\"method in resource.methods\">{{method.method}}</li>\n" +
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
    "    <basic-auth></basic-auth>\n" +
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

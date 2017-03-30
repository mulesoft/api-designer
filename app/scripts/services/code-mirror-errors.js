(function () {
  'use strict';

  angular.module('codeMirror')
    .factory('codeMirrorErrors', function (codeMirror, $timeout) {
      var CodeMirror = codeMirror.CodeMirror;
      var GUTTER_ID = 'CodeMirror-lint-markers';
      var SEVERITIES = /^(?:error|warning)$/;
      var service = {};

      function showTooltip (content, node) {
        var tt = document.createElement('div');
        tt.className = 'CodeMirror-lint-tooltip';
        tt.appendChild(content.cloneNode(true));

        // need to append element to DOM to get its height
        tt.style.visibility = 'hidden';
        document.body.appendChild(tt);

        var offset = $(node).offset();

        tt.style.top = Math.max(0, offset.top - tt.offsetHeight) + 'px';
        tt.style.left = (offset.left + 20) + 'px';

        if (tt.style.opacity !== null) {
          tt.style.opacity = 1;
        }

        tt.style.visibility = 'visible';

        return tt;
      }

      function rm (elt) {
        if (elt.parentNode) {
          elt.parentNode.removeChild(elt);
        }
      }

      function hideTooltip (tt) {
        if (!tt.parentNode) {
          return;
        }
        if (tt.style.opacity === null) {
          rm(tt);
        }
        tt.style.opacity = 0;
        $timeout(function () { rm(tt); }, 200);
      }

      function showTooltipFor (content, node) {
        var tooltip = showTooltip(content, node);
        var errorNode = node;

        var openTrace = function(event){
          hide(tooltip);
          var path = event.target.dataset.path;
          if (path) {
            var $scope = angular.element(errorNode).scope();
            $scope.$emit('event:raml-editor-file-select', path);
          }
        };

        function isMouseOverElement(element, e) {
          if (!e) {
            return false;
          }

          var left = $(element).offset().left;
          var right = left + $(element).outerWidth();
          var mouseOverX = left <= e.clientX && e.clientX <= right + 5;

          var top = $(element).offset().top;
          var bottom = top + $(element).outerHeight();
          var mouseOverY = top <= e.clientY && e.clientY <= bottom;

          return mouseOverX && mouseOverY;
        }

        function hide (e) {
          if (tooltip) {
            var mouseOverError = isMouseOverElement(errorNode, e);
            var mouseOverTooltip = isMouseOverElement(tooltip, e);
            if (!(mouseOverTooltip || mouseOverError)) {
              CodeMirror.off(tooltip, 'mousedown', openTrace);
              CodeMirror.off(document, 'mousemove', hide);

              hideTooltip(tooltip);
              tooltip = null;
            }
          }
        }

        var poll = setInterval(function () {
          if (tooltip) {
            for (var n = node;; n = n.parentNode) {
              if (n === document.body) {
                return;
              }
              if (!n) {
                hide();
                break;
              }
            }
          } else {
            return clearInterval(poll);
          }
        }, 400);

        CodeMirror.on(tooltip, 'mousedown', openTrace);
        CodeMirror.on(document, 'mousemove', hide);
      }

      function clearMarks (cm) {
        cm.clearGutter(GUTTER_ID);
      }

      function getMaxSeverity(a, b) {
        return a === 'error' ? a : b;
      }

      function groupByLine (annotations) {
        var lines = [];
        for (var i = 0, len = annotations.length; i < len; ++i) {
          var annotation = annotations[i], line = annotation.line || 1;
          (lines[line] || (lines[line] = [])).push(annotation);
        }
        return lines;
      }

      function annotationTooltip (annotation) {
        var severity = annotation.severity;
        if (!SEVERITIES.test(severity)) {
          severity = 'error';
        }
        var tip = document.createElement('div');
        tip.className = 'CodeMirror-lint-message-' + severity;

        var message = annotation.message;

        // if error belongs to different file, add tracing information to message
        if (annotation.path) {
          message += ' at line ' + annotation.tracingLine + ' col ' + annotation.tracingColumn + ' in ' +
            '<a href="javascript:" data-path="/'+annotation.path+'">'+annotation.path+'</a>';
        }

        tip.innerHTML = '<p class=CodeMirror-tag-' + severity + '>' + severity + '</p>' +
                        '<p class="CodeMirror-message">' + message + '</p>';
        return tip;
      }

      function makeMarker (labels, severity, multiple, tooltips, annotations) {
        var marker = document.createElement('div');
        var inner = marker;

        marker.className = 'CodeMirror-lint-marker-' + severity;

        if (multiple) {
          inner = marker.appendChild(document.createElement('div'));
          inner.className = 'CodeMirror-lint-marker-multiple';
        }

        if (tooltips !== false) {
          CodeMirror.on(inner, 'mouseenter', function () {
            showTooltipFor(labels, inner);
          });
        }

        //For testing automation purposes
        marker.setAttribute('data-marker-line', annotations[0].line);
        marker.setAttribute('data-marker-message', annotations[0].message);

        return marker;
      }

      service.displayAnnotations = function (annotationsNotSorted, editor) {
        editor = editor || codeMirror.getEditor();
        clearMarks(editor);

        var annotations = groupByLine(annotationsNotSorted);
        for (var line = 0; line < annotations.length; ++line) {
          var anns = annotations[line];
          if (!anns) {
            continue;
          }
          var maxSeverity = null;
          var tipLabel = document.createDocumentFragment();

          for (var i = 0; i < anns.length; ++i) {
            var ann = anns[i];
            var severity = ann.severity;

            if (!SEVERITIES.test(severity)) {
              severity = 'error';
            }

            maxSeverity = getMaxSeverity(maxSeverity, severity);

            tipLabel.appendChild(annotationTooltip(ann));
          }
          editor.setGutterMarker(line - 1, GUTTER_ID, makeMarker(tipLabel, maxSeverity, anns.length > 1, true, anns));
        }
      };

      service.clearAnnotations = function () {
        clearMarks(codeMirror.getEditor());
      };

      return service;
    })
  ;
})();

'use strict';

angular.module('codeMirror')
  .factory('codeMirrorErrors', function (codeMirror, $timeout) {
    var CodeMirror = codeMirror.CodeMirror;
    var GUTTER_ID = 'CodeMirror-lint-markers';
    var SEVERITIES = /^(?:error|warning)$/;
    var service = {};

    function showTooltip (e, content) {
      var tt = document.createElement('div');
      tt.className = 'CodeMirror-lint-tooltip';
      tt.appendChild(content.cloneNode(true));
      document.body.appendChild(tt);

      function position (e) {
        if (!tt.parentNode) {
          return CodeMirror.off(document, 'mousemove', position);
        }
        tt.style.top = Math.max(0, e.clientY - tt.offsetHeight - 5) + 'px';
        tt.style.left = (e.clientX + 5) + 'px';
      }

      CodeMirror.on(document, 'mousemove', position);
      position(e);
      if (tt.style.opacity !== null) {
        tt.style.opacity = 1;
      }
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

    function showTooltipFor (e, content, node) {
      var tooltip = showTooltip(e, content);

      function hide () {
        CodeMirror.off(node, 'mouseout', hide);
        if (tooltip) {
          hideTooltip(tooltip);
          tooltip = null;
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

      CodeMirror.on(node, 'mouseout', hide);
    }

    function clearMarks (cm) {
      cm.clearGutter(GUTTER_ID);
    }

    function getMaxSeverity(a, b) {
      return a === 'error' ? a : b;
    }

    function groupByLine (annotations) {
      var lines = [];
      for (var i = 0; i < annotations.length; ++i) {
        var ann = annotations[i], line = ann.line;
        (lines[line] || (lines[line] = [])).push(ann);
      }
      return lines;
    }

    function annotationTooltip (ann) {
      var severity = ann.severity;
      if (!SEVERITIES.test(severity)) {
        severity = 'error';
      }
      var tip = document.createElement('div');
      tip.className = 'CodeMirror-lint-message-' + severity;
      tip.appendChild(document.createTextNode(ann.message));
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
        CodeMirror.on(inner, 'mouseover', function (e) {
          showTooltipFor(e, labels, inner);
        });
      }

      //For testing automation purposes
      marker.setAttribute('data-marker-line', annotations[0].line);
      marker.setAttribute('data-marker-message', annotations[0].message);

      return marker;
    }

    service.displayAnnotations = function (annotationsNotSorted) {
      var editor = codeMirror.getEditor();
      var annotations = groupByLine(annotationsNotSorted);

      this.clearAnnotations();

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
      var editor = codeMirror.getEditor();
      clearMarks(editor);
    };

    return service;
  });

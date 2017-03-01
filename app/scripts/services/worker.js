'use strict';

angular.module('ramlEditorApp')
  .factory('ramlWorker', function (ramlRepository, ramlParser, $q, $window) {

    // default parse method on same thread
    var ramlParse = function oldParse(data) {
      return ramlParser.loadPath(data.path, function contentAsync(path) {
        return ramlRepository.getContentByPath(path);
      });
    };

    // use worker if available
    var worker = $window.RAML.worker;
    if (worker) {
      var currentParse = null;
      var parsingPending = null;

      ramlParse = function ramlParse(data) {
        var deferred = $q.defer();
        var path = data.path;

        if (currentParse) {
          // if we already have a parse request pending, reject it as aborted
          if (parsingPending) {
            parsingPending.deferred.reject('aborted');
          }

          // leave the parser request as pending
          parsingPending = {deferred: deferred, data: data};
        } else {
          currentParse = data;
          _postAndExpect('ramlParse', data).then(function parseOk(result) {
            result.path = path;
            deferred.resolve(result);
            parsePending();
          }).catch(function parseFail(error) {
            error.path = path;
            deferred.reject(error);
            parsePending();
          });
        }
        return deferred.promise;
      };

      var parsePending = function parsePending() {
        currentParse = null;
        if (parsingPending) {
          ramlParse(parsingPending.data).then(parsingPending.deferred.resolve).catch(parsingPending.deferred.reject);
          parsingPending = null;
        }
      };

      var _listen = function _listen(type, fn) {
        worker.addEventListener('message', function workerMessage(e) {
          if (e.data.type === type) {
            fn(e.data.payload);
          }
        }, false);
      };

      var _post = function _post(type, payload) {
        try {
          worker.postMessage({type: type, payload: payload});
        } catch (e) {
          console.error('Error when trying to post to worker', e);
          worker.postMessage({type: type}); // send just the type, so the flow can continue
        }
      };

      var _postAndExpect = function _postAndExpect(type, payload) {
        var deferred = $q.defer();

        const listener = function postListener(e) {
          if (e.data.type === type + '-resolve') {
            worker.removeEventListener('message', listener, false);
            deferred.resolve(e.data.payload);
          }
          else if (e.data.type === type + '-reject') {
            worker.removeEventListener('message', listener, false);
            deferred.reject(e.data.payload);
          }
        };
        worker.addEventListener('message', listener, false);
        _post(type, payload);
        return deferred.promise;
      };

      _listen('requestFile', function requestFile(request) {
        if (request.path === currentParse.path) {
          _post('requestFile', {path: request.path, content: currentParse.contents});
        } else {
          ramlRepository.getContentByPath(request.path, true).then(function (contents) {
            _post('requestFile', {path: request.path, content: contents});
          }).catch(function (err) {
            //console.error('requestFile failed', err);
            var message = typeof err === 'string' ? err : err.message || ('File not found ' + request.path);
            _post('requestFile', {path: request.path, error: message});
          });
        }
      });
    }

    return {
      ramlParse: ramlParse
    };
  });
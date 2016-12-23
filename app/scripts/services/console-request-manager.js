'use strict';
window.addEventListener('api-console-request', function(event) {
  event.url = '/proxy/' + event.url;
  // event.preventDefault();

  var xhr = new XMLHttpRequest();
  var request = document.getElementById('request');

  xhr.addEventListener('error', function() {
    console.log(xhr.response);
    console.log(xhr.status);
  }.bind(this));

  xhr.addEventListener('timeout', function() {
    request._internalResponseErrorHandler('timeout');
  }.bind(this));

  xhr.addEventListener('abort', function() {
    request._internalResponseErrorHandler('abort');
  }.bind(this));

  // Called after all of the above.
  xhr.addEventListener('loadend', function(e) {
    request._internalResponseHandler({
      data: e.target.response,
      status: e.target.status,
      statusText: e.target.statusText,
      headers: e.target.getAllResponseHeaders()
    });
  }.bind(this));

  try {
    xhr.open(event.method, event.url, true);
  } catch (e) {
    request._internalResponseErrorHandler('run-error');
    return;
  }

  if (event.headers) {
    var headers = event.headers.split('\n').map(function(line) {
      var _parts = line.split(':');
      var _name = _parts[0];
      var _value = _parts[1];
      _name = _name ? _name.trim() : null;
      _value = _value ? _value.trim() : null;
      if (!_name || !_value) {
        return null;
      }
      return {
        name: _name,
        value: _value
      };
    }).filter(function(item) {
      return !!item;
    });

    headers.forEach(function(item) {
      // Iven if error occur the loop will continue.
      xhr.setRequestHeader(item.name, item.value);
    });
  }

  xhr.timeout = 60000;
  xhr.withCredentials = this.withCredentials; // TODO ask: can't do it? Ask pawel to add to component?

  if (['GET', 'HEAD'].indexOf(event.method) !== -1) {
    event.payload = undefined;
  }

  try {
    xhr.send(event.payload);
  } catch (e) {
    request._internalResponseErrorHandler('run-error');
  }
});

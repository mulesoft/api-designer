(function() {
  'use strict';
  var React = window.React;
  var ReactDOM = window.ReactDOM;

  if (!React || !ReactDOM)  { return; }

  window.ApiDesigner = React.createClass({
    displayName: 'ApiDesigner',
    componentDidMount: function componentDidMount() {
      var fileSystem = this.props.fileSystem;
      if (fileSystem) {
        angular.module('fs')
          .config(function(fileSystemProvider) {
            fileSystemProvider.setFileSystemFactory(function () { return fileSystem; });
          });
      }

      var $this = $(ReactDOM.findDOMNode(this));
      angular.bootstrap($this, ['ramlEditorApp']);
      angular.element($this).scope().$root.rootNode = $this.get(0);
      // set el height and width etc.
    },
    shouldComponentUpdate: function () {
      return false;
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement('raml-editor', null)
      );
    }
  });
})();


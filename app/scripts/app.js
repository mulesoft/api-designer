(function () {
  'use strict';

  (function () {
    angular.module('raml', [])
      .factory('ramlParser', function () {
        return RAML.Parser;
      });

    RAML.Settings = RAML.Settings || {};
  })();

  angular.module('ramlEditorApp', [
    // angular-ui
    'ui.bootstrap.modal',
    'ui.bootstrap.tpls',
    'ui.tree',
    // project
    'codeMirror',
    'fs',
    'raml',
    'stringFilters',
    'utils',
    'lightweightDOM',
    'splitter',
    'validate',
    'autoFocus',
    'rightClick',
    'dragAndDrop',
    'cfp.hotkeys',
    'firebase'
  ])
    .run(function ($window, hotkeys) {
      // Adding proxy settings for api console
      $window.RAML.Settings.proxy    = '/proxy/';
      $window.RAML.Settings.firebase = false;

      hotkeys.add({
        combo: 'mod+S',
        description: 'Save current file'
      });
      hotkeys.add({
        combo: 'shift+mod+S',
        description: 'Save All'
      });
      hotkeys.add({
        combo: 'mod+E',
        description: 'Extract to'
      });
      hotkeys.add({
        combo: 'mod + p',
        description: 'Show global search'
      });
      hotkeys.add({
        combo: 'Ctrl+Space',
        description: 'Start autocomplete'
      });
      hotkeys.add({
        combo: 'mod+/',
        description: 'Toggle Comment'
      });
      hotkeys.add({
        combo: 'shift+mod+A',
        description: 'Select Resource'
      });
      hotkeys.add({
        combo: 'mod+Ctrl+down',
        description: 'Swap line down'
      });
      hotkeys.add({
        combo: 'mod+Ctrl+up',
        description: 'Swap line up'
      });
      hotkeys.add({
        combo: 'mod+D',
        description: 'Select next occurrence'
      });
      hotkeys.add({
        combo: 'mod+K mod+K',
        description: 'Delete line right'
      });
      hotkeys.add({
        combo: 'mod+K mod+L',
        description: 'Down case at cursor'
      });
      hotkeys.add({
        combo: 'mod+K mod+U',
        description: 'Up case at cursor'
      });
      hotkeys.add({
        combo: 'mod+L',
        description: 'Select line'
      });
      // hotkeys.add({
      //   combo: 'shift+Alt+down',
      //   description: 'Select lines downward'
      // });
      // hotkeys.add({
      //   combo: 'shift+Alt+up',
      //   description: 'Select lines upward'
      // });
      hotkeys.add({
        combo: 'shift+mod+D',
        description: 'Duplicate line'
      });
      // hotkeys.add({
      //   combo: 'shift + Ctrl + T',
      //   description: 'toggleTheme'
      // });
      hotkeys.add({
        combo: 'shift+Tab',
        description: 'Indent less'
      });

      hotkeys.del('?');
    })
    .config(function(hotkeysProvider) {
      hotkeysProvider.templateTitle = 'Keyboard Shortcuts';

      var template = [
        '<div class="cfp-container" ng-class="{in: helpVisible}" style="display: none;">',
        '  <h4 class="cfp-hotkeys-title" ng-if="!header">{{ title }}</h4>',
        '  <div ng-bind-html="header" ng-if="header"></div>',
        '  <div>',
        '    <table>',
        '      <tbody>',
        '        <tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\' }">',
        '          <td class="cfp-hotkeys-keys">',
        '            <span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key">{{ key }}</span>',
        '          </td>',
        '          <td class="cfp-hotkeys-text">{{ hotkey.description }}</td>',
        '        </tr>',
        '      </tbody>',
        '    </table>',
        '  </div>',
        '</div>',
        '<div class="cfp-overlay" ng-class="{in: helpVisible}" style="display: none;"></div>'
      ];

      hotkeysProvider.template = template.join('\n');
    })
  ;
})();

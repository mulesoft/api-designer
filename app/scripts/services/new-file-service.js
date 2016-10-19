(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('newFileService', function newFolderService(
      ramlRepository,
      newNameModal,
      $rootScope,
      generateName) {

      var self = this;
      var specUrl = 'https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#';
      self.files = {
        '0.8': {
          'spec': {
            label: '',
            name: 'API Spec',
            description: 'RAML 0.8 API Spec',
            spec: 'https://github.com/raml-org/raml-spec/blob/master/versions/raml-08/raml-08.md'
          }
        },
        '1.0': {
          'spec': {
            label: '',
            name: 'API Spec',
            description: 'RAML 1.0 API Spec',
            spec: specUrl + 'the-root-of-the-document'
          },
          'Trait': {
            label: 'Trait',
            name: 'Trait',
            description: 'Provides reusability for common characteristics that can then be applied to multiple methods.',
            spec: specUrl + 'resource-types-and-traits'
          },
          'ResourceType': {
            label: 'ResourceType',
            name: 'Resource Type',
            description: 'Provides reusability for common characteristics that can then be applied to multiple resources.',
            spec: specUrl + 'resource-types-and-traits'
          },
          'Library': {
            label: 'Library',
            name: 'Library',
            description: 'Combine any collection of data type declarations, resource type declarations, trait declarations, and security scheme declarations into modular, externalized, reusable groups.',
            spec: specUrl + 'libraries'
          },
          'Overlay': {
            label: 'Overlay',
            name: 'Overlay',
            description: 'Add or overrides nodes of a RAML API definition while preserving its behavioral, functional aspects.',
            spec: specUrl + 'overlays'
          },
          'Extension': {
            label: 'Extension',
            name: 'Extension',
            description: 'Broaden a RAML API definition by adding to, or modifying aspects of its behavior and other functionality.',
            spec: specUrl + 'extensions'
          },
          'DataType': {
            label: 'DataType',
            name: 'Type',
            description: 'Data type declaration where the type node may be used.',
            spec: specUrl + '#raml-data-types'
          },
          'DocumentationItem': {
            label: 'DocumentationItem',
            name: 'User Documentation',
            description: 'An item in the collection of items that is the value of the root-level documentation node.',
            spec: specUrl + 'user-documentation'
          },
          'NamedExample': {
            label: 'NamedExample',
            name: 'Example',
            description: 'An examples facet, whose key is a name of an example and whose value describes the example.',
            spec: specUrl + 'defining-examples-in-raml'
          },
          'AnnotationTypeDeclaration': {
            label: 'AnnotationTypeDeclaration',
            name: 'Annotation',
            description: 'Extend the API specification with metadata beyond the metadata already defined in the RAML specification.',
            spec: specUrl + 'annotations'
          },
          'SecurityScheme': {
            label: 'SecurityScheme',
            name: 'Security Scheme',
            description: 'Define one or more mechanisms to secure data access, identify requests, and determine access level and data visibility.',
            spec: specUrl + 'security-schemes'
          }
        }
      };

      function findFragment(version, fragmentLabel) {
        var files = self.files[version];
        for (var file in files) {
          if (files.hasOwnProperty(file)) {
            var currentFragment = files[file];
            if (currentFragment.label === fragmentLabel) {
              return currentFragment;
            }
          }
        }
      }

      function nameSuggestion(target, fragment, fragmentLabel) {
        var names = [];
        target.children.forEach(function (file) {
          names.push(file.name);
        });

        var defaultName = (fragment.label !== '' ? fragmentLabel : 'api') + '-';
        return generateName(names, defaultName, 'raml');
      }

      self.prompt = function prompt(target, ramlVersion, fragmentLabel) {
        var parent = target.isDirectory ? target : ramlRepository.getParent(target);
        var label = fragmentLabel ? fragmentLabel : '';
        var fragment = findFragment(ramlVersion, label);

        var validations = [
          {
            message: 'That file name is already taken.',
            validate: function (input) {
              var path = ramlRepository.join(parent.path, input);

              return !ramlRepository.getByPath(path);
            }
          }
        ];

        var suggestedName = nameSuggestion(target, fragment, fragmentLabel);
        var title = 'Add new ' + fragment.name + ' file';

        return newNameModal.open(fragment.description, suggestedName, validations, title, fragment.spec)
          .then(function (name) {
            // Need to catch errors from `generateFile`, otherwise
            // `newNameModel.open` will error random modal close strings.
            return ramlRepository.generateFile(parent, name, ramlVersion, label)
              .catch(function (err) {
                return $rootScope.$broadcast('event:notification', {
                  message: err.message,
                  expires: true,
                  level: 'error'
                });
              });
          });
      };

      self.newFragmentFile = function newFragmentFile(homeDirectory, fragmentType) {
        if (fragmentType === '') {
          return self.prompt(homeDirectory, '1.0');
        }

        return self.prompt(homeDirectory, '1.0', fragmentType);
      };

      self.newFile = function newFile(homeDirectory, version) {
        return self.prompt(homeDirectory, version);
      };

      return self;
    })
  ;
})();

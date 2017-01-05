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
          '': {
            label: '',
            name: 'API Spec',
            description: 'RAML 0.8 API Spec.',
            spec: 'https://github.com/raml-org/raml-spec/blob/master/versions/raml-08/raml-08.md'
          }
        },
        '1.0': {
          '': {
            label: '',
            name: 'API Spec',
            description: 'RAML 1.0 API Spec.',
            spec: specUrl + 'the-root-of-the-document'
          },
          'Trait': {
            label: 'Trait',
            name: 'Trait',
            description: 'Define a single trait with common characteristics for methods.',
            spec: specUrl + 'resource-types-and-traits'
          },
          'ResourceType': {
            label: 'ResourceType',
            name: 'Resource Type',
            description: 'Define a single resource type with common characteristics for resources.',
            spec: specUrl + 'resource-types-and-traits'
          },
          'Library': {
            label: 'Library',
            name: 'Library',
            description: 'Define a collection of data type declarations, resource type declarations, trait declarations, and security scheme declarations into modular, externalized, reusable groups.',
            spec: specUrl + 'libraries'
          },
          'Overlay': {
            label: 'Overlay',
            name: 'Overlay',
            description: 'Define an overlay that adds or overrides nodes of a RAML API definition while preserving its behavioral, functional aspects.',
            spec: specUrl + 'overlays'
          },
          'Extension': {
            label: 'Extension',
            name: 'Extension',
            description: 'Define an extension that adds or modifies nodes of a RAML API definition.',
            spec: specUrl + 'extensions'
          },
          'DataType': {
            label: 'DataType',
            name: 'Type',
            description: 'Define a single data type declaration.',
            spec: specUrl + 'raml-data-types'
          },
          'DocumentationItem': {
            label: 'DocumentationItem',
            name: 'User Documentation',
            description: 'Define a single page documentation item.',
            spec: specUrl + 'user-documentation'
          },
          'NamedExample': {
            label: 'NamedExample',
            name: 'Example',
            description: 'Define a single example for a given data type.',
            spec: specUrl + 'defining-examples-in-raml'
          },
          'AnnotationTypeDeclaration': {
            label: 'AnnotationTypeDeclaration',
            name: 'Annotation',
            description: 'Define a single annotation type declaration that describes additional metadata that can be applied to any RAML node.',
            spec: specUrl + 'annotations'
          },
          'SecurityScheme': {
            label: 'SecurityScheme',
            name: 'Security Scheme',
            description: 'Define a single security scheme that describes the mechanism to secure data access, identify requests, and determine access level and data visibility.',
            spec: specUrl + 'security-schemes'
          }
        }
      };

      function nameSuggestion(target, fragment, fragmentLabel) {
        var names = target.children.map(function (file) {
          return file.name;
        });

        var defaultName = (fragment.label !== '' ? fragmentLabel : 'api') + '-';
        return generateName(names, defaultName, 'raml');
      }

      self.prompt = function prompt(target, ramlVersion, fragmentLabel) {
        var parent = target.isDirectory ? target : ramlRepository.getParent(target);

        var validations = [
          {
            message: 'That file name is already taken.',
            validate: function (input) {
              var path = ramlRepository.join(parent.path, input);

              return !ramlRepository.getByPath(path);
            }
          }
        ];

        var label = fragmentLabel ? fragmentLabel : '';
        var fragment = self.files[ramlVersion][label];
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

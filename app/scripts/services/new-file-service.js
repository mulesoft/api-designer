(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('newFileService', function newFolderService(
      ramlRepository,
      newNameModal,
      $rootScope
    ) {
      var self = this;

      self.prompt = function prompt (target) {
        var parent = target.isDirectory ? target : ramlRepository.getParent(target);
        var title  = 'Add a new file';

        var message = [
          'For a new RAML spec, be sure to name your file <something>.raml; ',
          'For files to be !included, feel free to use an extension or not.'
        ].join('');

        var validations = [
          {
            message: 'That file name is already taken.',
            validate: function (input) {
              var path = ramlRepository.join(parent.path, input);

              return !ramlRepository.getByPath(path);
            }
          }
        ];

        return newNameModal.open(message, '', validations, title)
          .then(function (name) {
            // Need to catch errors from `generateFile`, otherwise
            // `newNameModel.open` will error random modal close strings.
            return ramlRepository.generateFile(parent, name)
              .catch(function (err) {
                return $rootScope.$broadcast('event:notification', {
                  message: err.message,
                  expires: true,
                  level: 'error'
                });
              });
          });
      };

      return self;
    })
  ;
})();

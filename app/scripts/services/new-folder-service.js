(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('newFolderService', function newFolderService(
      ramlRepository,
      newNameModal
    ) {
      var self = this;

      self.prompt = function prompt (target) {
        var parent  = target.isDirectory ? target : ramlRepository.getParent(target);
        var message = 'Input a name for your new folder:';
        var title   = 'Add a new folder';

        var validations = [
          {
            message: 'That folder name is already taken.',
            validate: function(input) {
              var path = ramlRepository.join(parent.path, input);

              return !ramlRepository.getByPath(path);
            }
          }
        ];

        return newNameModal.open(message, '', validations, title)
          .then(function (name) {
            return ramlRepository.generateDirectory(parent, name);
          });
      };

      return self;
    })
  ;
})();

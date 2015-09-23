(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('newFileService', function newFolderService(
      ramlRepository,
      newNameModal,
      eventEmitter
    ) {
      var self = this;

      self.prompt = function prompt (target, prompTitle, proptMessage, contents, filename, stopPropagation) {
        var parent = target.isDirectory ? target : ramlRepository.getParent(target);
        var title  = prompTitle || 'Add a new file';

        var message = proptMessage || 'Enter the path for the new file';

        var validations = [
          {
            message: 'That file name is already taken.',
            validate: function (input) {
              var path = ramlRepository.join(parent.path, input);

              return !ramlRepository.getByPath(path);
            }
          }
        ];

        return newNameModal.open(message, filename || '', validations, title)
          .then(function (name) {
            // Need to catch errors from `generateFile`, otherwise
            // `newNameModel.open` will error random modal close strings.
            return ramlRepository.generateFile(parent, name, contents, stopPropagation)
              .then(function (file) {
                eventEmitter.publish('event:editor:new:file', {file:file});
                return file;
              })
              .catch(function (err) {
                return eventEmitter.publish('event:notification', {
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

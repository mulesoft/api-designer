describe('ramlEditorFilenamePrompt', function() {
  'use strict';

  var sandbox, fileList, newFilePrompt, digest;

  function createMockFile(name, options) {
    options = options || {};

    return {
      name: name,
      dirty: !!options.dirty,
      contents: options.contents
    };
  }

  angular.module('fileBrowserTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('fileBrowserTest'));

  beforeEach(inject(function($rootScope, $injector, ramlEditorFilenamePrompt) {
    digest = function() { $rootScope.$digest(); };

    sandbox = sinon.sandbox.create();
    fileList = $injector.get('fileList');
    newFilePrompt = ramlEditorFilenamePrompt;
  }));

  afterEach(function() {
    fileList = newFilePrompt = undefined;
    sandbox.restore();
  });

  describe('by default', function() {
    var promptSpy;

    beforeEach(function() {
      promptSpy = sandbox.stub(window, 'prompt');
      fileList.files = [createMockFile('file1'), createMockFile('file2')];
    });

    it('prompts user for filename', function() {
      newFilePrompt.open();

      promptSpy.should.have.been.calledWith('Choose a name:');
    });

    it('allows the suggested name to be overridden', function() {
      newFilePrompt.open('MyName.raml');

      promptSpy.should.have.been.calledWith('Choose a name:', 'MyName.raml');
    });

    describe('upon choosing a name', function() {
      beforeEach(function() {
        promptSpy.returns('MyFile.raml');
      });

      it('resolves the promise with the chosen file name', function(done) {
        var promise = newFilePrompt.open();

        promise.then(function(chosenName) {
          chosenName.should.equal('MyFile.raml');
          done();
        });
        digest();
      });

      describe('when the name is already taken (case-insensitive)', function() {
        var alertSpy, promise;

        beforeEach(function() {
          alertSpy = sandbox.stub(window, 'alert');
          fileList.files.push(createMockFile('MYFILE.raml', { contents: 'my content' }));

          promise = newFilePrompt.open();
        });

        it('alerts the user', function() {
          alertSpy.should.have.been.calledWith('That filename is already taken.');
        });

        it('rejects the promise', function(done) {
          promise.then(undefined, function() {
            done();
          });
          digest();
        });
      });
    });

    describe('upon cancellation', function() {
      var promise;

      beforeEach(function() {
        promptSpy.returns(null);

        promise = newFilePrompt.open();
      });

      it('rejects the promise', function(done) {
        promise.then(undefined, function() {
          done();
        });
        digest();
      });
    });

    describe('suggested filename', function() {
      it('defaults to Untitled-1.raml first', function() {
        newFilePrompt.open();
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
      });

      it('does not increment the filename if you cancel', function() {
        promptSpy.returns(null);
        newFilePrompt.open();
        newFilePrompt.open();
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
      });

      describe('with an existing Untitled-1.raml', function() {
        beforeEach(function() {
          fileList.files = [createMockFile('Untitled-1.raml')];
        });

        it('defaults to Untitled-2.raml second', function() {
          promptSpy.returns('the-name-i-actually-give-the-second-file.raml');
          newFilePrompt.open();
          promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-2.raml');
        });
      });


      describe('given an existing Untitled-6.raml', function() {
        beforeEach(function() {
          fileList.files = [createMockFile('file2'), createMockFile('Untitled-6.raml'), createMockFile('Zebras')];
        });

        it('it defaults to Untitled-7.raml', function() {
          newFilePrompt.open();
          promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-7.raml');
        });
      });
    });
  });
});

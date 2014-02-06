describe('ramlEditorFilenamePrompt', function() {
  'use strict';

  var sandbox, ramlRepository, newFilePrompt, digest;

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
    ramlRepository = $injector.get('ramlRepository');
    newFilePrompt = ramlEditorFilenamePrompt;
  }));

  afterEach(function() {
    ramlRepository = newFilePrompt = undefined;
    sandbox.restore();
  });

  describe('by default', function() {
    var promptSpy;
    var promptSpyReturns;

    beforeEach(function() {
      promptSpyReturns = ['MyFile.raml', 'Untaken.raml'];
      promptSpy = sandbox.stub(window, 'prompt', function() {
        return promptSpyReturns.shift();
      });

      ramlRepository.files = [createMockFile('file1'), createMockFile('file2')];
    });

    it('prompts user for filename', function() {
      newFilePrompt.open(ramlRepository);

      promptSpy.should.have.been.calledWith('Choose a name:');
    });

    it('allows the suggested name to be overridden', function() {
      newFilePrompt.open(ramlRepository, 'MyName.raml');

      promptSpy.should.have.been.calledWith('Choose a name:', 'MyName.raml');
    });

    describe('upon choosing a name', function() {
      it('resolves the promise with the chosen file name', function(done) {
        var promise = newFilePrompt.open(ramlRepository);

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
          ramlRepository.files.push(createMockFile('MYFILE.raml', { contents: 'my content' }));

          promise = newFilePrompt.open(ramlRepository);
        });

        it('alerts the user', function() {
          alertSpy.should.have.been.calledWith('That filename is already taken.');
        });

        it('re-prompts the user for a unique filename', function() {
          promptSpy.should.have.been.calledTwice;
        });

        it('returns the final unique filename', function(done) {
          promise.then(function(chosenName) {
            chosenName.should.equal('Untaken.raml');
            done();
          });
          digest();
        });
      });
    });

    describe('upon cancellation', function() {
      var promise;

      beforeEach(function() {
        promptSpyReturns = [null];

        promise = newFilePrompt.open(ramlRepository);
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
        newFilePrompt.open(ramlRepository);
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
      });

      it('does not increment the filename if you cancel', function() {
        promptSpyReturns = [null];
        newFilePrompt.open(ramlRepository);
        newFilePrompt.open(ramlRepository);
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
      });

      describe('with an existing Untitled-1.raml', function() {
        beforeEach(function() {
          ramlRepository.files = [createMockFile('Untitled-1.raml')];
        });

        it('defaults to Untitled-2.raml second', function() {
          promptSpyReturns = ['the-name-i-actually-give-the-second-file.raml'];
          newFilePrompt.open(ramlRepository);
          promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-2.raml');
        });
      });


      describe('given an existing Untitled-6.raml', function() {
        beforeEach(function() {
          ramlRepository.files = [createMockFile('file2'), createMockFile('Untitled-6.raml'), createMockFile('Zebras')];
        });

        it('it defaults to Untitled-7.raml', function() {
          newFilePrompt.open(ramlRepository);
          promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-7.raml');
        });
      });
    });
  });
});

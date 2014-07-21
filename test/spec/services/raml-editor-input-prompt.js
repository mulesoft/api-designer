describe('ramlEditorInputPrompt', function() {
  'use strict';

  var sandbox, newInputPrompt, digest;

  angular.module('PromptTest', ['ramlEditorApp']);
  beforeEach(module('PromptTest'));

  beforeEach(inject(function($rootScope, ramlEditorInputPrompt) {
    sandbox = sinon.sandbox.create();
    newInputPrompt = ramlEditorInputPrompt;
    digest = function() { $rootScope.$digest(); };
  }));

  afterEach(function() {
    newInputPrompt = undefined;
    sandbox.restore();
  });

  describe('by default', function() {
    var promptSpy;
    var promptSpyReturns;

    beforeEach(function() {
      promptSpyReturns = ['MyFile.raml'];
      promptSpy = sandbox.stub(window, 'prompt', function() {
        return promptSpyReturns.shift();
      });
    });

    it('prompts user for a name', function() {
      newInputPrompt.open('message');

      promptSpy.should.have.been.calledWith('message');
    });

    it('allows a suggested name to be provided', function() {
      newInputPrompt.open('message', 'anothername');

      promptSpy.should.have.been.calledWith('message', 'anothername');
    });

    describe('upon choosing a name', function() {
      var validations;
      var validationFn;
      var promise;
      var alertSpy;

      beforeEach(function() {
        promptSpyReturns = ['MyFile.raml', 'Untaken.raml'];
        validationFn = sinon.stub();
        validationFn.onCall(0).returns(false);
        validationFn.returns(true);
        validations = [{message:'message', validate: validationFn}];
        alertSpy = sandbox.stub(window, 'alert');

        promise = newInputPrompt.open('', '', validations);
      });

      it('goes through the validation process', function() {
        validationFn.should.have.been.calledTwice;
      });

      it('alerts the user when validation fails', function() {
        alertSpy.should.have.been.calledWith('message');
      });

      it('re-prompts the user for a unique filename', function() {
        promptSpy.should.have.been.calledTwice;
      });

      it('returns the final unique filename', function(done) {
        promise.then(function(name) {
          name.should.equal('Untaken.raml');
          done();
        });
        digest();
      });
    });

    describe('upon cancellation', function() {
      var promise;

      beforeEach(function() {
        promptSpyReturns = [null];
        promise = newInputPrompt.open('', '', []);
      });

      it('invokes the cancelled function', function(done) {
        promise.then(undefined, done);
        digest();
      });
    });
  });
});

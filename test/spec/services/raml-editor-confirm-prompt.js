describe('ramlEditorConfirmPrompt', function() {
  'use strict';

  var sandbox, confirmPrompt, digest;

  angular.module('PromptTest', ['ramlEditorApp']);
  beforeEach(module('PromptTest'));

  beforeEach(inject(function($rootScope, ramlEditorConfirmPrompt) {
    sandbox = sinon.sandbox.create();
    confirmPrompt = ramlEditorConfirmPrompt;
    digest = function() { $rootScope.$digest(); };
  }));

  afterEach(function() {
    confirmPrompt =  undefined;
    sandbox.restore();
  });

  describe('by default', function() {
    var confirmSpy;

    beforeEach(function() {
      confirmSpy = sandbox.stub(window, 'confirm');
    });

    it('prompts user to confirm a message', function() {
      confirmSpy.returns(true);

      confirmPrompt.open('message');
      confirmSpy.should.have.been.calledWith('message');
    });


    describe('upon confirmation', function() {
      var promise;

      beforeEach(function() {
        confirmSpy.returns(true);
        promise = confirmPrompt.open('message');
      });

      it('resolves the promise', function(done) {
        promise.then(done);
        digest();
      });
    });

    describe('upon cancellation', function() {
      var promise;

      beforeEach(function() {
        confirmSpy.returns(false);
        promise = confirmPrompt.open('message');
      });

      it('rejects the promise', function(done) {
        promise.then(undefined, done);
        digest();
      });
    });
  });
});

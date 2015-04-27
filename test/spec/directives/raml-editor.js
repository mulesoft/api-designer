describe('ramlEditor', function() {
  'use strict';

  var scope;
  var el;
  var noMock = true;

  beforeEach(function () {
    module('ramlEditorApp');

    inject(function ($rootScope, $compile) {
      $rootScope.noMock = noMock;
      scope             = $rootScope.$new();
      el                = $compile('<raml-editor mocking-service-disabled="noMock"></raml-editor>')(scope);

      document.body.appendChild(el[0]);
      $rootScope.$digest();
    });
  });

  it('should bind mockingServiceDisabled', function () {
    el.isolateScope().mockingServiceDisabled.should.equal(noMock);
  });
});

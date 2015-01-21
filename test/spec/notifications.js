'use strict';

describe('notifications', function () {
  var $rootScope;
  var $timeout;
  var scope;

  beforeEach(module('ramlEditorApp'));
  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $timeout   = $injector.get('$timeout');

    $injector.get('$controller')('notifications', {
      $scope: scope = $rootScope.$new()
    });
  }));

  afterEach(function () {
    $timeout.verifyNoPendingTasks();
  });

  it('should process notification when event:notification is broadcasted', function () {
    var args = broadcast();
    scope.should.have.property('message', args.message);
    scope.should.have.property('level',   'info');
    scope.should.have.property('shouldDisplayNotifications', true);
  });

  it('should expire notification when requested', function () {
    var args = broadcast({
      expires: true
    });

    scope.should.have.property('expires', args.expires);
    scope.should.have.property('shouldDisplayNotifications', true);

    $timeout.flush();

    scope.should.have.property('shouldDisplayNotifications', false);
  });

  // ---

  function broadcast(args) {
    $rootScope.$broadcast('event:notification', args = angular.extend({message: '' + Date.now()}, args));
    $rootScope.$apply();

    return args;
  }
});

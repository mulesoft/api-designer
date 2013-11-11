'use strict';

describe('Notifications', function () {

  var notifications, params, $controller, eventServiceMock, eventService, scope, $timeout;

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function ($injector) {
    var $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $timeout = $injector.get('$timeout');
    eventService  = $injector.get('eventService');

    scope = $rootScope.$new();

    eventServiceMock = sinon.mock(eventService);

    params = {
      $scope: scope,
      eventService: eventService
    };
  }));

  afterEach(function () {
    eventServiceMock.verify();
    $timeout.verifyNoPendingTasks();
  });

  it('should correctly receive the "event:notification" event and act', function () {
    // Arrange
    var message = 'My Message';
    eventServiceMock.expects('on').once().callsArgWith(1, {}, {message: message, expires: false});

    // Act
    notifications = $controller('notifications', params);

    // Assert
    scope.shouldDisplayNotifications.should.be.equal(true);
    scope.message.should.be.equal(message);
    scope.expires.should.be.equal(false);
  });

  it('should hide notifications when called "hideNotifications"', function () {
    // Arrange
    eventServiceMock.expects('on').once().callsArgWith(1, {}, {message: 'My Message'});

    // Act
    notifications = $controller('notifications', params);
    scope.hideNotifications();

    // Assert
    scope.shouldDisplayNotifications.should.be.equal(false);

  });

  it('should expire the notifications correctly', function () {
    // Arrange
    var message = 'My message',
        displayedNotifications;
    eventServiceMock.expects('on').once().callsArgWith(1, {}, {message: message, expires: true});

    // Act
    notifications = $controller('notifications', params);
    displayedNotifications = scope.shouldDisplayNotifications;
    $timeout.flush();

    // Assert
    displayedNotifications.should.be.equal(true);
    scope.shouldDisplayNotifications.should.be.equal(false);
    scope.message.should.be.equal(message);
    scope.expires.should.be.equal(true);

  });
});


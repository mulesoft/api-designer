'use strict';

describe('Utils module', function () {
  beforeEach(module('utils'));

  describe('generateSpaces', function () {
    var generateSpaces;

    beforeEach(inject(function ($injector) {
      generateSpaces = $injector.get('generateSpaces');
    }));

    it('should not generate spaces when using 0 as input', function () {
      generateSpaces(0).should.be.equal('');
    });

    it('should generate the required spaces', function () {
      generateSpaces(3).should.be.equal('   ');
    });

    it('should assume undefined and null as 0', function () {
      generateSpaces(undefined).should.be.equal('');
      generateSpaces(null).should.be.equal('');
    });
  });

  describe('generateTabs', function () {
    var generateTabs;

    beforeEach(inject(function($injector) {
      generateTabs = $injector.get('generateTabs');
    }));

    it('should generate no tabs when input is 0, undefined or null', function () {
      generateTabs(undefined).should.be.equal('');
      generateTabs(null).should.be.equal('');
      generateTabs(0).should.be.equal('');
    });

    it('should generate the right amount of tabs', function () {
      generateTabs(3).should.be.equal('      ');
    });
  });

  describe('generateName', function () {
    var generateName;

    beforeEach(inject(function($injector) {
      generateName = $injector.get('generateName');
    }));

    it('should generate next default name for raml file', function () {
      generateName(['Untitled-1.raml', 'test.raml'], 'Untitled-', 'raml').should.be.equal('Untitled-2.raml');
      generateName(['Untitled-1.raml', 'Untitled-2.raml', 'test.raml'], 'Untitled-', 'raml').should.be.equal('Untitled-3.raml');
    });
  });

  describe('safeApplyWrapper', function () {
    var safeApplyWrapper;
    beforeEach(inject(function ($injector) {
      safeApplyWrapper = $injector.get('safeApplyWrapper');
    }));

    it('should call wrapped function', function () {
      var wrapped = sinon.stub();
      safeApplyWrapper(null, wrapped)();

      wrapped.called.should.be.true;
    });

    it('should pass arguments to wrapped function', function () {
      var wrapped = sinon.stub();
      safeApplyWrapper(null, wrapped)(1, '2', true);

      wrapped.calledWith(1, '2', true).should.be.true;
    });
  });

  describe('safeApply', function () {
    var safeApply;
    var exceptionHandler;
    var rootScope;
    var sandbox;

    function createMockedRoot (phase) {
      return {
        $$phase: phase
      };
    }

    function createMockedScope (mockedRoot, phase) {
      return {
        $eval: sandbox.stub(),
        $root: mockedRoot,
        $$phase: phase,
        $apply: sandbox.stub()
      };
    }

    beforeEach(inject(function ($injector) {
      sandbox = sinon.sandbox.create();
      safeApply = $injector.get('safeApply');
      rootScope = $injector.get('$rootScope');
      exceptionHandler = $injector.get('$exceptionHandler');
    }));

    afterEach(function() {
      sandbox.restore();
    });

    it('should eval expression during apply phase', function () {
      //Arrange
      var root = createMockedRoot('$apply');
      var scope = createMockedScope(root);
      var expression = sinon.stub();

      //Act
      safeApply(scope, expression);

      //Assert
      scope.$eval.calledWith(expression).should.be.true;
      scope.$apply.called.should.be.false;
    });

    it('should eval expression during digest phase', function () {
      //Arrange
      var root = createMockedRoot('$digest');
      var scope = createMockedScope(root);
      var expression = sinon.stub();

      //Act
      safeApply(scope, expression);

      //Assert
      scope.$eval.calledWith(expression).should.be.true;
      scope.$apply.called.should.be.false;
    });

    it('should apply expression while not during digest or apply phase', function () {
      //Arrange
      var root = createMockedRoot('$idk');
      var scope = createMockedScope(root);
      var expression = sinon.stub();

      //Act
      safeApply(scope, expression);

      //Assert
      scope.$apply.calledWith(expression).should.be.true;
      scope.$eval.called.should.be.false;
    });

    it('should NOT fail if $root is null during apply phase', function () {
      //Arrange
      var scope = createMockedScope(null, '$apply');
      var expression = sinon.stub();

      //Act
      safeApply(scope, expression);

      //Assert
      scope.$eval.calledWith(expression).should.be.true;
      scope.$apply.called.should.be.false;
    });

    it('should NOT fail if $root is null during digest phase', function () {
      //Arrange
      var scope = createMockedScope(null, '$digest');
      var expression = sinon.stub();

      //Act
      safeApply(scope, expression);

      //Assert
      scope.$eval.calledWith(expression).should.be.true;
      scope.$apply.called.should.be.false;
    });

    it('should NOT fail if $root is null while not in digest or apply phase', function () {
      //Arrange
      var scope = createMockedScope();
      var expression = sinon.stub();

      //Act
      safeApply(scope, expression);

      //Assert
      scope.$apply.calledWith(expression).should.be.true;
      scope.$eval.called.should.be.false;
    });

  });

  describe('resolveUri', function () {
    var $window;
    var resolveUri;

    beforeEach(inject(function ($injector) {
      $window    = $injector.get('$window');
      resolveUri = $injector.get('resolveUri');
    }));

    it('should return same value when it is URI (starts with scheme + ://)', function () {
      resolveUri('http://1.2.3.4/test').should.be.equal('http://1.2.3.4/test');
    });

    it('should append origin to value when it is root-absolute path (starts with /)', function () {
      resolveUri('/test').should.be.equal($window.location.origin + '/test');
    });

    it('should append origin and pathname to value when it is relative path (not URI nor starts with /)', function () {
      resolveUri('test').should.be.equal($window.location.origin + '/test');
    });
  });
});

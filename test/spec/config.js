'use strict';


var describe = window.describe, beforeEach = window.beforeEach, it = window.it,
  inject = window.inject, should = window.should, config;


describe('RAML Config Service', function () {

  beforeEach(module('raml'));

  beforeEach(function () {

    inject(function ($injector) {
      config = $injector.get('config');
      delete localStorage.config;
    });

  });

  it('should obtain value from localStorage', function () {
    localStorage.config = JSON.stringify({a: 5, b: 7});

    config.loadFromLocalStorage();

    config.get('a').should.be.equal(5);
    config.get('b').should.be.equal(7);
    should.not.exist(config.get('c'));
  });

  it('should retrieve a previously stored value correctly', function () {
    config.set('a', 19);
    config.get('a').should.be.equal(19);
  });

  it('should use get default value when no value associated', function () {
    config.get('x', 99).should.be.equal(99);
  });

  it('should ignore default when value previously set', function () {
    config.set('y', 9);
    config.get('y', 18).should.be.equal(9);
  });

  it('should correctly persist the configuration to localStorage', function () {
    var previousLocalStorageConfig = localStorage.config;
    should.not.exist(previousLocalStorageConfig);

    config.set('t', 87);
    config.set('8', 123);

    config.save();

    var currentLocalStorageConfig = JSON.parse(localStorage.config);

    currentLocalStorageConfig.t.should.be.equal(87);
    currentLocalStorageConfig[8].should.be.equal(123);
  });

});

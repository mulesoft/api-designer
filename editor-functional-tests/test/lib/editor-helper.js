var webdriver = require('selenium-webdriver'),
    protractor = require('../../node_modules/protractor/lib/protractor.js');

function EditorHelper (ptor, driver) {
    this.ptor = ptor;
    this.driver = driver;
}

EditorHelper.prototype = {};

EditorHelper.prototype.getErrorLineMessage = function () {
    var d = webdriver.promise.defer(), that = this;

    this.ptor.wait(function() {
        return that.ptor.driver.isElementPresent(protractor.By.css('.CodeMirror-lint-marker-error')); 
    }).then(function () {
        that.driver.executeScript(function () {
            var querySelectorMarkerError = document.querySelector(".CodeMirror-lint-marker-error");
            return [
                querySelectorMarkerError.getAttribute("data-marker-line"),
                querySelectorMarkerError.getAttribute("data-marker-message")
            ]}).then(function (list) {
                d.fulfill(list);
            });
    });
    return d.promise;
};

EditorHelper.prototype.getErrorMessage = function (){
    var d = webdriver.promise.defer();

    return this.getErrorLineMessage().then(function (list) {
        var message = list[1];
        d.fulfill(message);
    })

    return d.promise;
};

EditorHelper.prototype.getErrorLine = function (){
    var d = webdriver.promise.defer();

    return this.getErrorLineMessage().then(function (list) {
        var line = list[0];
        d.fulfill(line);
    })

    return d.promise;
    
}

EditorHelper.prototype.setLine = function (line, text) {
    return this.driver.executeScript('window.editor.setLine('+line+',"'+text+'")');
};

EditorHelper.prototype.getLine = function (line) {
    return this.driver.executeScript('return window.editor.getLine('+line+')');
};

EditorHelper.prototype.setValue = function (text) {
    return this.driver.executeScript('window.editor.setValue("'+text+'")');
}; 

exports.EditorHelper = EditorHelper;
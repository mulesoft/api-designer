'use strict';
describe('parser - traits',function(){
  browser.get('');
  browser.executeScript(function () {
    localStorage['config.updateResponsivenessInterval'] = 1;
    window.onbeforeunload = null;
  });
  browser.wait(function(){
    return editorGetLine(2).then(function(text) {
      return text === 'title:';
    });
  });

  describe('traits', function () {

    it('should failed response with form Parameters', function(){
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        'traits: ',
        '  - hola: ',
        '      responses: ',
        '        200: ',
        '          body: ',
        '            application/x-www-form-urlencoded: ',
        '              formParameters: '
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('9','formParameters cannot be used to describe response bodies');
    });

    it('should fail: parameter key cannot be used as a trait name', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: My API',
        'traits:',
        '  - <<name>>:'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('5','parameter key cannot be used as a trait name');
    });

    it('should fail: array as key - trait []', function () {
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        'resourceTypes:',
        '  - member3:',
        '      get:',
        '        is:',
        '          - gettrait',
        'traits:',
        '  - gettrait:',
        '      description: this is the description',
        '      responses:',
        '        [100,200,300,400,500]:',
        '           description: this is the description',
        '/resourc:',
        '  type: member3'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('12','only scalar map keys are allowed in RAML');
    });

    it('should fail: array as key - trait {}', function () {
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        'resourceTypes:',
        '  - member3:',
        '      get:',
        '        is:',
        '          - gettrait',
        'traits:',
        '  - gettrait:',
        '      description: this is the description',
        '      responses:',
        '        {100,200,300,400,500}:',
        '           description: this is the description',
        '/resourc:',
        '  type: member3'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('12','only scalar map keys are allowed in RAML');
    });

    describe('protocols', function () {

      it('should fail: traits-protocols property already used protocol', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'traits:',
          '  - hola:',
          '      protocols: []',
          '      protocols:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('7','property already used: \'protocols\'');
      });

      it('should fail: protocol property must be an array', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'traits:',
          '  - hola:',
          '      protocols:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('6','property must be an array');
      });

      it('should fail: protocol value must be a string', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'traits:',
          '  - hola:',
          '      protocols:',
          '        - '
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('7','value must be a string');
      });

      it('should fail: only HTTP and HTTPS values are allowed', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'traits:',
          '  - hola:',
          '      protocols:',
          '        - htt'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('7','only HTTP and HTTPS values are allowed');
      });

    }); // protocols

  }); //traits

}); // parser-traits
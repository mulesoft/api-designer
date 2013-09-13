#!/bin/bash

if [[ "$RAML_CODE_HOME" == "" ]]
then
	echo "RAML_CODE_HOME is not set, using current directory"
	RAML_CODE_HOME=`pwd`
fi

#exit on error
set -e
#build latest console

echo "building console..."
cd $RAML_CODE_HOME/console
git pull

grunt raml-console-embedded-debug

echo "copying console files to editor..."
cp $RAML_CODE_HOME/console/dist/app.css $RAML_CODE_HOME/javascript-editor/app/vendor/styles/raml-console.css
cp $RAML_CODE_HOME/console/dist/app.js  $RAML_CODE_HOME/javascript-editor/app/vendor/scripts/raml-console.js

echo "building parser..."
cd $RAML_CODE_HOME/javascript-parser
git pull
grunt

echo "copying parser files to editor..."
cp $RAML_CODE_HOME/javascript-parser/dist/raml-parser.js $RAML_CODE_HOME/javascript-editor/app/vendor/scripts/raml-parser.js

echo "copying parser files to console..."
cp $RAML_CODE_HOME/javascript-parser/dist/raml-parser.js $RAML_CODE_HOME/console/app/vendor/scripts/raml-parser.js

echo "Done!!!"
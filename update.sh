#!/bin/bash
if [ $# -lt 1 ]
then
  echo "> Missing branch-name param, correct usage is: update <branch-name>"
  exit
fi

# checkout repo in especified branch
BRANCH=$1 # "$(git --git-dir $SOURCE_REPO/.git rev-parse --abbrev-ref HEAD)"
SOURCE_REPO=./_tmp/api-designer-$BRANCH
echo "> Fetch latest api-designer from branch '$BRANCH' and cache it in '$SOURCE_REPO'"
rm -rf $SOURCE_REPO
mkdir -p $SOURCE_REPO
git clone -b $BRANCH https://github.com/mulesoft/api-designer.git $SOURCE_REPO

# copy dist
SOURCE_FOLDER=$SOURCE_REPO/dist/
TARGET=./dists/$BRANCH
VERSIONED_TARGET=$TARGET/latest
echo "> Updating '$VERSIONED_TARGET' from '$SOURCE_FOLDER'"
rm -rf $VERSIONED_TARGET
mkdir -p $VERSIONED_TARGET
cp -r $SOURCE_FOLDER $VERSIONED_TARGET

# replace "RAML.Settings.proxy = '/proxy/'" with "RAML.Settings.proxy = ''" in api-designer.js
echo "> Leave empty RAML.Settings.proxy setting from $VERSIONED_TARGET/scripts/api-designer.js"
sed -i '' -e "s/RAML\.Settings\.proxy = '\/proxy\/'/RAML\.Settings\.proxy = ''/g" $VERSIONED_TARGET/scripts/api-designer.js
sed -i '' -e 's/RAML\.Settings\.proxy = "\/proxy\/"/RAML\.Settings\.proxy = ""/g' $VERSIONED_TARGET/scripts/api-designer.min.js

# create md page with branch info
BRANCH_SHA="$(git --git-dir $SOURCE_REPO/.git rev-parse HEAD)"
BRANCH_SHA_DATE="$(git --git-dir $SOURCE_REPO/.git show -s --format=%aI $BRANCH_SHA^{commit})"
BRANCH_INFO_MD=./_branchs/$BRANCH.md
echo "> generating branch info file in '$BRANCH_INFO_MD'"
rm $BRANCH_INFO_MD
echo -e "---\nname: $BRANCH\nsha: $BRANCH_SHA\ndate: $BRANCH_SHA_DATE\n---" >> $BRANCH_INFO_MD

# create commit
echo "> review and run: git add .;git commit -am 'Update $BRANCH to commit $BRANCH_SHA';git push"

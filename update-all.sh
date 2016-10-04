#!/bin/bash

# get branch names from defined branchs directory
for entry in "./_branchs"/*
do
  if [ -f "$entry" ];then
    BRANCH="$(basename "$entry" .md)"
    echo "# Updating branch $BRANCH:"
    ./update-branch.sh $BRANCH
    echo "" # done
  fi
done
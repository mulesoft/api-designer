#Editor File System

This document summarizes the file system api for the RAML editor tool. This is the interface you must follow to create a new file system to use with raml repository.

##Concepts

###Paths

A path is an string that represents a location in a File System. A path is composed of path parts:

* A Path Part is expressed by the following regular expression: [A-Za-z&#45;\._0-9\||]\+.
* Path Parts are case insensitive: 'hello' and 'Hello' are the same Path parts.

A valid path is:
* The root path '/' that represents the topmost of the hierarchy.
* A path that is derived from the root path and appending Path Parts separated by '/'. Each of the Path Parts that are added are known as children of the previous path. The previous path is called parent path.

If a given nested path exists, after subtracting the last part is should be a valid path too. That means that all the ancestors of a given path exists. For instance, if we have path /a/b/c/d then, /a/b/c, /a/b/, /a/ and / must exist. If a path does not have a trailing '/', a '/' is prepended to it.

###Entries

An entry is a data structure representing either a file or a folder with the following keys:

<table>
	<tr>
		<td>path</td>
		<td>a string containing the full path of the file, including all parent path parts. It must start with a '/'.</td>
	</tr>
	<tr>
		<td>name</td>
		<td>a string containing the name of the file, extracted from the path upon creation or renaming.</td>
	</tr>
	<tr>
		<td>type</td>
		<td>a string that could take two values: 'file' or 'folder'.</td>
	</tr>
	<tr>
		<td>children</td>
		<td>in the case of a folder, it contains all the entries within that path.</td>
	</tr>
	<tr>
		<td>meta</td>
		<td>an object that can contain any important information, for example creation date.</td>
	</tr>
</table>

>Timestamps are stored using epoch.


For example, a file named 'example.raml' stored at root level will look like this:

```
{
  path: "/example.raml",
  name: "example.raml",
  type: "file",
  content: "here goes the content of the raml file",
  meta: {
    created: 1389902933
  }
}
```

And a folder at root level with two children will have this structure:

```
{
  path: "/samples",
  name: "samples",
  type: "folder",
  children: [
  	{ 
  	  path: "/samples/example.raml",
  	  name: "example.raml",
  	  type: "file",
  	  content: "…",
  	  meta: { … }
  	},
  	{ 
  	  path: "/samples/subFolder"
  	  name: "subFolder",
  	  type: "folder",
  	  children: [ … ],
  	  meta: { … }
  	}
  ]
  meta: {
    created: 1389903212
  }
}
```
> every folder has a children element. It's the choice of the file system to return the whole tree or make it lazy.


And a file two levels deep looks like this:

```
{
  path: "/samples/folderA/example.raml",
  name: "example.raml",
  type: "file",
  content: "here goes the content of the raml file",
  meta: {
    created: 1389903361
  }
}
```
> This file can be loaded by path or using the childrens element of the parent folder.

##File System Module

###Localstorage Implementation

####Factory

the 'fileSystem' module acts as a factory returning and instance of the service specified by the 'fsFactory' configuration key. If no key is present, 'localStorageFileSystem' is set and an instance of that module is returned.

####Actions

All the actions return a promise that fulfills on success or rejects on fail.

#####Get Directory Tree

The 'directory' method takes a single parameter 'path', and returns a promise that, on success, returns an object for that path, that has a 'children' property with an array of the entries for that element. This call is recursive. For example, if you call 'directory' for '/' it will return a representation of the whole file system.

#####Save

The 'save' method takes two argument, a 'path' string representing the full path of the entry and a 'content' object. On success it resolves the promise without parameters, and can fail for the following reasons:

* The path contains invalid parts or parts that do not exist.
* The file has the same name of a folder

If the 'save' method is called with an existing 'path' for a file as a parameter, and there is already a file with the same name, it saves the new content on the previous entry and adds a 'lastUpdated' property to the 'meta' object associated with that entry.
If it's a new file, it add a 'created' property to the meta object.

#####Create Folder

The 'createFolder' method takes a single argument 'path' representing the full path of the new folder. On success it resolves the promise without passing any value back, and can fail for the following reasons:

* The path is not valid.
* The folder already exists.
* The path contains invalid parts or parts that do not exist.

#####Load

The 'load' method takes a single argument, 'path' representing the full path of the file. On success it resolves the promise with the entry object matching that path, and can fail for these reasons:

* The file does not exists.
* The path represents a folder.

#####Remove

The 'remove' method takes a single argument, 'path', representing the full path of the entry that needs to be removed, either file or folder. On success it resolves the promise without passing any value back, and can fail for the following reasons:

* An entry with that path does not exist.
* The path represents a folder and it's not empty.

#####Rename

The 'rename' method takes two arguments. A 'source' path and a 'destination' path. Using this method you can rename entries and move them around the tree. Both entries should be of the same type, except when moving files to a new destination. When a folder is moved, all the child elements get their paths updated, preserving the tree. On success the promise is resolved without arguments, and it can fail for the following reasons:

* The source file or folder does not exist.
* The destination folder does not exist when moving entries.
* The destination file or folder already exists.

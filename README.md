# file-system-utils


## ⚠ Disclaimer

Currently the [FileSystem API](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem) is experimental which means it is not 100% reliable. I tested it in Chrome & Firefox but beware of future changes that might crash this code.

## Motivation

I wanted to provide Drag-and-Drop functionality for folders in two of the apps I'm working on. Next I discovered the FileSystem API and decided to release these utility functions as a separate package.

Here's the end-results of using these utils in [DevDrive](https://devdrive.io) and [Flixier](https://flixier.com).


## Installation & Usage

```bash
$ npm install file-system-utils --save
```

To use this library just import the functions you want into the code and voilà!

```js
import {
    toFolderStructure,
    toFileEntriesArray
} from "file-system-utils";
```
  
⚠ This library is specifically made to be used in conjunction with ES Modules or a bundler like Webpack. If you want to use it in a vanilla JavaScript project without any build process or ES Modules, then you'll need to copy-paste the functions directly in your code.

## API

### toFolderStructure(entries, middleware?) : `Promise<Object>`

Compute a tree-like structure of folders and files (including subfolders) from an Array of [FileSystemEntry](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry).

#### entries

Type: `Array`

An array of [FileSystemEntry](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry). You'll most likely get this from a `<input type="file">` after a user drops some files/folders on top.  You can also get this data from the [DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) object in case you're implementing the entire Drag-n-Drop yourself.


#### middleware

Type: `Function`

Default: `(arg) => Promise.resolve(arg)`

By default the resulting object will contain actual instances of [FileSystemFileEntry](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry). If instead you want to process the files and keep just certain information about them, use this middleware function which must return a Promise which resolves to the data you want to keep.

I used it to keep only the file's `name`, a unique `key` and it's `text content`. 

#### @returns

A tree like structure representing all the files and folders (including sub-folders).

Example:

```js
{
    folders: [{
        key: 'unique-uuid',
        name: 'public',
        folders: [ /* ... */ ],
        files: [/* ... */]
    }],
    files: [/* ... */]
}
```

### toFileEntriesArray(entries, middleware?) : `Promise<Array>`

Compute an Array of all the [FileSystemFileEntry](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry) found inside `entries` (including sub-entries).

This function is similar to the one before, it just returns an array of all the files instead of the tree-like structure. This is usefull in case you only care about the file contents, and not their specific directory.

#### entries

Exactly the same as in the `toFolderStructure` function.


#### middleware

Exactly the same as in the `toFolderStructure` function.


#### @returns

An Array of [FileSystemFileEntry](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry) or, if you specified a middleware function, an Array of whatever you're returning from there.

<hr/>

<p align="center"> Made with ❤ by <a href="https://iampava.com"> Pava </a></p>
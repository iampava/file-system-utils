import { v4 as uuid } from 'uuid';

export function toFolderStructure(entries, middleware) {
    let root = {
        folders: [],
        files: []
    }

    return Promise.all(
        entries.map(entry => {
            let { isFile, isDirectory } = entry;

            if (isDirectory) {
                let folderStructure = appendFolder(entry, root)
                return parseDirectory(entry, folderStructure, middleware)
            }

            if (isFile) {
                return appendFile(entry, root, middleware);
            }

            return Promise.resolve();
        })
    ).then(() => root)
}

export function toFileEntriesArray(entries, middleware) {
    let result = entries.filter(entry => entry.isFile);
    let dirEntries = entries.filter(entry => entry.isDirectory);

    return Promise
        .all(dirEntries.map(dirToFiles))
        .then(() => {
            if (!middleware) {
                return result
            }

            return Promise.all(result.map(middleware));
        })

    async function dirToFiles(entry) {
        let innerEntries = await getChildEntries(entry);
        let fileEntries = innerEntries.filter(entry => entry.isFile);
        let dirEntries = innerEntries.filter(entry => entry.isDirectory);

        result.push(...fileEntries);

        return Promise.all(dirEntries.map(dirToFiles))
    }
}


/************************************************************ */
async function parseDirectory(dirEntry, root, middleware) {
    let childEntries = await getChildEntries(dirEntry);

    return Promise.all(
        childEntries.map(entry => {
            let { isFile, isDirectory } = entry;
            if (isFile) {
                return appendFile(entry, root, middleware);
            }

            if (isDirectory) {
                let folderStructure = appendFolder(entry, root)
                return parseDirectory(entry, folderStructure, middleware);
            }

            return Promise.resolve();
        })
    )
}

function getChildEntries(dirEntry) {
    if (!dirEntry || typeof dirEntry.createReader !== 'function') {
        return Promise.resolve([])
    }

    let dirReader = dirEntry.createReader();
    let childEntries = [];

    return new Promise((resolve) => {
        dirReader.readEntries(useEntries);

        function useEntries(entries) {
            if (entries.length === 0) {
                resolve(childEntries);
            }

            childEntries.push(...entries);
            dirReader.readEntries(useEntries);
        }
    })
}


function appendFile(fileEntry, root, middleware) {
    if (!middleware) {
        root.files.push(fileEntry);
        return Promise.resolve()
    }

    return middleware(fileEntry).then(processedEntry => {
        root.files.push(processedEntry);
    })
}

function appendFolder(folderEntry, root) {
    let newFolder = {
        name: folderEntry.name,
        key: uuid(),
        folders: [],
        files: []
    }

    root.folders.push(newFolder);

    return newFolder;
}
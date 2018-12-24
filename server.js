'use strict';

const express = require('express');
const api = require('./driveAPI');

const PORT = 12345;
const HOST = '127.0.0.1';

//App
const app = express();

app.get('/', (req , res) => {
    api.getEverything().then(resolve => {
        let mapping = makeParentMapping(resolve);
        //resolve holds the file info for the shared files
        //mapping holds the parent -> child folder mappings
        let response = {files: resolve, map: mapping};
        res.send(response);
    }).catch(err => {
        console.log(err);
        res.send('There was an error.')
    });
});

app.post('/', (req, res) => {
    res.send('Post Request on \'/\'\n')
});


function makeParentMapping(raw_files) {
    let mapping = {};
    if (raw_files == undefined) {
        return mapping;
    }
    raw_files.map((file) => {
        if (file.mimeType == 'application/vnd.google-apps.folder') {
            mapping[file.id] = [];
        }
    });
    raw_files.map((file) => {
        if (file.parents != undefined) {
            let parent = file.parents[0];
            if (mapping[parent] != undefined && file.mimeType == 'application/vnd.google-apps.folder') {
                mapping[parent].push(file);
            }
        }
    });
    return mapping;
}

app.listen(PORT, HOST);
console.log('Running on http://%s:%d', HOST, PORT);
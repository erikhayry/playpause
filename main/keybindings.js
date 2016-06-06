"use strict";

const globalShortcut = require('global-shortcut');

let _init = (browserWindow) => {
    console.log('main > keybindings.init', browserWindow);
    // Load our media keys
    // Copied from https://gist.github.com/twolfson/0a03820e27583cc9ad6e
    var registered = globalShortcut.register('medianexttrack', function () {
        console.log('medianexttrack pressed');
    });
    if (!registered) {
        console.log('medianexttrack registration failed');
    } else {
        console.log('medianexttrack registration bound!');
    }

    var registered = globalShortcut.register('mediaplaypause', function () {
        console.log('mediaplaypause pressed');
        browserWindow.webContents.send('playpause', 'mediaplaypause pressed!');
    });
    if (!registered) {
        console.log('mediaplaypause registration failed');
    } else {
        console.log('mediaplaypause registration bound!');
    }

    var registered = globalShortcut.register('mediaprevioustrack', function () {
        console.log('mediaprevioustrack pressed');
    });
    if (!registered) {
        console.log('mediaprevioustrack registration failed');
    } else {
        console.log('mediaprevioustrack registration bound!');
    }

    var registered = globalShortcut.register('mediastop', function () {
        console.log('mediastop pressed');
    });
    if (!registered) {
        console.log('mediastop registration failed');
    } else {
        console.log('mediastop registration bound!');
    }
};


module.exports = {
    init: _init
};

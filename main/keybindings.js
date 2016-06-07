"use strict";

const globalShortcut = require('global-shortcut');

let _init = (browserWindow) => {
  console.log('main > keybindings.init', browserWindow);

  globalShortcut.register('medianexttrack', () => {
    console.log('main > keybindings > medianexttrack');
  });
  
  globalShortcut.register('mediaplaypause', (e) => {
    console.log('main > keybindings > mediaplaypause');
    browserWindow.webContents.send('playpause', e);
  });

  globalShortcut.register('mediaprevioustrack', () => {
    console.log('main > keybindings > mediaprevioustrack');
  });

  globalShortcut.register('mediastop', () => {
    console.log('main > keybindings > mediastop');
  });
};


module.exports = {
    init: _init
};

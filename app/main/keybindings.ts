"use strict";
import BrowserWindow = Electron.BrowserWindow;
const globalShortcut:Electron.GlobalShortcut = require('global-shortcut');

export module Keybindings {
  export function init(browserWindow:BrowserWindow) {
    console.log('main > keybindings.init', browserWindow);

    globalShortcut.register('medianexttrack', () => {
      console.log('main > keybindings > medianexttrack');
    });

    globalShortcut.register('mediaplaypause', () => {
      console.log('main > keybindings > mediaplaypause');
      browserWindow.webContents.send('playpause');
    });

    globalShortcut.register('mediaprevioustrack', () => {
      console.log('main > keybindings > mediaprevioustrack');
    });

    globalShortcut.register('mediastop', () => {
      console.log('main > keybindings > mediastop');
    });
  }
}

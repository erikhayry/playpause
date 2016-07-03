"use strict";
const app = require('app');
const BrowserWindow = require('browser-window');
const path = require('path');

const keybindings = require('./keybindings');
const settings = require('./settings');
const plugins = require('./plugins');

//Init
plugins.init(app, path);

//Events
app.on('window-all-closed', () => {
  console.log('main: on window-all-closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  console.log('main: on ready');
  let browserWindow = new BrowserWindow(settings.browserWindow);
  browserWindow.loadUrl('file://' + __dirname + '/../../index.html');
  keybindings.init(browserWindow);

  browserWindow.openDevTools();
});

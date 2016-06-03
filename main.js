"use strict";

const app = require('app');
const BrowserWindow = require('browser-window');
const path = require('path');
const keybindings = require('./main/keybindings')
const settings = require('./main/settings')
const plugins = require('./main/plugins')

//Init
plugins.init(app, path);

//Events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  let browserWindow = new BrowserWindow(settings.browserWindow);
  browserWindow.loadUrl('file://' + __dirname + '/render/index.html');
  keybindings.init(browserWindow);

  browserWindow.openDevTools()
});

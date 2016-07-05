"use strict";
import {Plugins} from "./plugins";
import {Keybindings} from "./keybindings";
import {Settings} from "./settings";
const app = require('app');
const BrowserWindow = require('browser-window');

const settings = require('./settings');


//Init
Plugins.init(app);

//Events
app.on('window-all-closed', () => {
  console.log('main: on window-all-closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  console.log('main: on ready');
  let browserWindow = new BrowserWindow(Settings.browserWindow);
  browserWindow.loadUrl('file://' + __dirname + '/../../index.html');
  Keybindings.init(browserWindow);
  browserWindow.openDevTools();
});

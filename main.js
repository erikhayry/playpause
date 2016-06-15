"use strict";

const app = require('app');
const BrowserWindow = require('browser-window');
const path = require('path');
const keybindings = require('./main/keybindings')
const settings = require('./main/settings')
const plugins = require('./main/plugins')

console.log(app.getPath('userData'))

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
  browserWindow.loadUrl('file://' + __dirname + '/index.html');
  keybindings.init(browserWindow);

  browserWindow.openDevTools()
  browserWindow.webContents.send('info', {
    'userData': app.getPath('userData')
  });

});


// main process mapNumbers.js
exports.withRendererCallback = (mapper) => {
  return [1,2,3].map(mapper);
};

exports.withLocalCallback = () => {
  return exports.mapNumbers(x => x + 1);
};

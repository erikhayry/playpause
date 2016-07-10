"use strict";
import App = Electron.App;
const path = require('path');

export module Plugins {

  export function init(app:App) {
    console.log('Plugins.init');
    let ppapi_flash_path:string;

    if(process.platform  == 'win32'){
      ppapi_flash_path = path.join(__dirname, '/../main/plugins/pepflashplayer.dll');
    }
    else if (process.platform == 'linux') {
      ppapi_flash_path = path.join(__dirname, '/../main/plugins/libpepflashplayer.so');
    }
    else if (process.platform == 'darwin') {
      ppapi_flash_path = path.join(__dirname, '/../main/plugins/PepperFlashPlayer.plugin');
    }

    app.commandLine.appendSwitch('ppapi-flash-path', ppapi_flash_path);
    app.commandLine.appendSwitch('ppapi-flash-version', '18.0.0.203');
  }
}

"use strict";

let _init = (app, path) =>{
  console.log('main > plugins.init', app, path);

  let _ppapi_flash_path;
    if(process.platform  == 'win32'){
        _ppapi_flash_path = path.join(__dirname, 'plugins/pepflashplayer.dll');
    } else if (process.platform == 'linux') {
        _ppapi_flash_path = path.join(__dirname, 'plugins/libpepflashplayer.so');
    } else if (process.platform == 'darwin') {
        _ppapi_flash_path = path.join(__dirname, 'plugins/PepperFlashPlayer.plugin');
    }

    app.commandLine.appendSwitch('ppapi-flash-path', _ppapi_flash_path);
    app.commandLine.appendSwitch('ppapi-flash-version', '18.0.0.203');
};

module.exports = {
    init: _init
};

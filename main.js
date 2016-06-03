// Load in our dependencies
var app = require('app');
var BrowserWindow = require('browser-window');
var globalShortcut = require('global-shortcut');
var path = require('path');

var ppapi_flash_path;
// Specify flash path.
// On Windows, it might be /path/to/pepflashplayer.dll
// On OS X, /path/to/PepperFlashPlayer.plugin
// On Linux, /path/to/libpepflashplayer.so
if(process.platform  == 'win32'){
  ppapi_flash_path = path.join(__dirname, 'pepflashplayer.dll');
} else if (process.platform == 'linux') {
  ppapi_flash_path = path.join(__dirname, 'libpepflashplayer.so');
} else if (process.platform == 'darwin') {
  ppapi_flash_path = path.join(__dirname, 'PepperFlashPlayer.plugin');
}

app.commandLine.appendSwitch('ppapi-flash-path', ppapi_flash_path);

app.commandLine.appendSwitch('ppapi-flash-version', '18.0.0.203');

// When all Windows are closed
app.on('window-all-closed', function handleWindowsClosed () {
  // If we are not on OS X, exit
  // DEV: OSX requires users to quit via the menu/cmd+q
  if (process.platform !== 'darwin') {
    console.log('All windows closed. Exiting application');
    app.quit();
  } else {
    console.log('All windows closed but not exiting because OSX');
  }
});

// When Electron is done loading
app.on('ready', function handleReady () {

  // Create our browser window for google.com
  var windowOpts = {
    height: 920,
    width: 1024
  };
  browserWindow = new BrowserWindow(windowOpts);
  browserWindow.loadUrl('file://' + __dirname + '/index.html');

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
    console.log('mediaplaypause pressed??');
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
});

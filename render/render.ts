"use strict";
import {Render} from "../domain/render";
import {WebView} from "../domain/webView";
import {Electron, SafeIPC} from "../domain/electron";

let render:Render = (function () {

  let electron:Electron = require('electron');
  let safeIPC:SafeIPC = require("electron-safe-ipc/host-webview");
  let fs = require('fs');
  let subscriber = require('./render/subscriber');
  let db = require('./render/db');

  let _webView:WebView;
  let _guestBundleInjected = false;
  let _subscriber = new subscriber();
  let _station;

  //Events

  electron.ipcRenderer.on('playpause', (event, message) => {
    console.log(message);
    _webView.executeJavaScript(fs.readFileSync('./node_modules/electron-safe-ipc/guest-bundle.js').toString());
    //_webView.executeJavaScript('electronSafeIpc.send("fromRenderer", document.querySelectorAll("*"), "a2");')

    if(_station){
      _webView.executeJavaScript(_station.buttons.play)
    }

    _guestBundleInjected = true;
    _subscriber.publish('playpause', event);
  });

  safeIPC.on("fromRenderer", function (a, b) {
    console.log("fromRenderer received", a, b);
  });

  return {
    setWebView: (wv) => {
      _webView = wv;
    },
    getStations: () => {
      return db
    },
    setStation: (station) => {
      _station = station;
    },
    on: _subscriber.on
  }
}());

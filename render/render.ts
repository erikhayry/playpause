"use strict";
import {Render} from "../domain/render";
import {WebView} from "../domain/webView";
import {Electron, SafeIPC, IpcRendererEvent} from "../domain/electron";
import {Station} from "../domain/station";

let render:Render = (function () {
  console.log('render');

  let electron:Electron = require('electron');
  //let safeIPC:SafeIPC = require("electron-safe-ipc/host-webview");
  let fs = require('fs');
  let subscriber = require('./js/render/subscriber');
  let db = require('./js/render/db');

  let _webView:WebView;
  let _subscriber = new subscriber();
  let _station:Station;

  //Events
  electron.ipcRenderer.on('playpause', (event:IpcRendererEvent) => {
    console.log('render on playpause', event);

    _webView.executeJavaScript(fs.readFileSync('./node_modules/electron-safe-ipc/guest-bundle.js').toString());
    _webView.executeJavaScript('console.log("guest > on playpause")');
    _webView.executeJavaScript('electronSafeIpc.send("fromRenderer", console.log("guest > on playpause"));');

    if(_station){
      _webView.executeJavaScript(_station.buttons.play)
    }

    _subscriber.publish('playpause', event);
  });

/*
  safeIPC.on("fromRenderer", function (a, b) {
    console.log("fromRenderer received", a, b);
  });
*/

  return {
    setWebView: (wv:WebView) => {
      console.log('render.setWebView', wv);
      _webView = wv;
    },
    getStations: () => {
      console.log('render.getStations');
      return db
    },
    setStation: (station:Station) => {
      console.log('render.setStation', station);

      _station = station;
    },
    on: _subscriber.on
  }
}());

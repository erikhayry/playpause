"use strict";
import {Render} from "../domain/render";
import {WebView} from "../domain/webView";
import {Electron, SafeIPC, IpcRendererEvent} from "../domain/electron";
import {Station} from "../domain/station";
import {ElementStyle} from "../domain/elementStyle";

let render:Render = (function () {
  console.log('render');

  let electron:Electron = require('electron');
  let safeIPC:SafeIPC = require("electron-safe-ipc/host-webview");
  let fs = require('fs');
  let utils = require('./js/render/utils');
  let subscriber = require('./js/render/subscriber');
  let db = require('./js/render/db');

  let _webView:WebView;
  let _subscriber = new subscriber();
  let _station:Station;

  //Events
  electron.ipcRenderer.on('playpause', (event:IpcRendererEvent) => {
    console.log('render on playpause', event);
    _webView.executeJavaScript('console.log("guest > on playpause")');

    if(_station){
      if(_station.buttons.play !== _station.buttons.pause){
        let _fetchButtons = 'electronSafeIpc.send("buttonStylesFetched", ' + utils.getComputedStyle(_station.buttons.play) + ',' + utils.getComputedStyle(_station.buttons.pause) + ')';
        console.log(_fetchButtons);
        _webView.executeJavaScript(_fetchButtons);
      }
      else{
        _webView.executeJavaScript(utils.click(_station.buttons.play))
      }
    }

    _subscriber.publish('playpause', event);
  });

  safeIPC.on("buttonStylesFetched", (playBtnStyle:ElementStyle, pauseBtnStyles:ElementStyle) => {
    console.log('render on buttonStylesFetched', !!playBtnStyle, !!pauseBtnStyles);
    switch(utils.getGuestState(playBtnStyle, pauseBtnStyles)){
      case 'playing':
        _webView.executeJavaScript(utils.click(_station.buttons.pause))
        break;
      case 'paused':
      default:
        _webView.executeJavaScript(utils.click(_station.buttons.play))
    }
  });

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
      _webView.executeJavaScript(fs.readFileSync('./node_modules/electron-safe-ipc/guest-bundle.js').toString());
    },
    on: _subscriber.on
  }
}());

"use strict";
import {Render} from "../domain/render";
import {WebView} from "../domain/webView";
import {Electron, SafeIPC, IpcRendererEvent, IpcRenderer} from "../domain/electron";
import {Station} from "../domain/station";
import {ElementStyle} from "../domain/elementStyle";

let render:Render = (function () {
  console.log('render');

  const MAIN:IpcRenderer = require('electron').ipcRenderer;
  const GUEST:SafeIPC = require("electron-safe-ipc/host-webview");

  const fs = require('fs');

  const utils = require('./js/render/utils');
  const subscriber = require('./js/render/subscriber');
  const db = require('./js/render/db');

  let _guest:WebView;
  let _subscriber = new subscriber();
  let _station:Station;

  //Events
  MAIN.on('playpause', (event:IpcRendererEvent) => {
    console.log('render on playpause', event);
    _guest.executeJavaScript('console.log("guest > on playpause")');

    if(_station){
      if(_station.buttons.play !== _station.buttons.pause){
        let _fetchButtons = 'electronSafeIpc.send("buttonStylesFetched", ' + utils.getComputedStyle(_station.buttons.play) + ',' + utils.getComputedStyle(_station.buttons.pause) + ')';
        console.log(_fetchButtons);
        _guest.executeJavaScript(_fetchButtons);
      }
      else{
        _guest.executeJavaScript(utils.click(_station.buttons.play))
      }
    }

    _subscriber.publish('playpause', event);
  });

  GUEST.on("buttonStylesFetched", (playBtnStyle:ElementStyle, pauseBtnStyles:ElementStyle) => {
    console.log('render on buttonStylesFetched', !!playBtnStyle, !!pauseBtnStyles);
    switch(utils.getGuestState(playBtnStyle, pauseBtnStyles)){
      case 'playing':
        _guest.executeJavaScript(utils.click(_station.buttons.pause))
        break;
      case 'paused':
      default:
        _guest.executeJavaScript(utils.click(_station.buttons.play))
    }
  });

  return {
    getStations: () => {
      console.log('render.getStations');
      return db
    },
    set: (station:Station, guest:WebView) => {
      console.log('render.setStation', station);
      _station = station;
      _guest = guest;
      _guest.executeJavaScript(fs.readFileSync('./node_modules/electron-safe-ipc/guest-bundle.js').toString());
    },
    on: _subscriber.on
  }
}());

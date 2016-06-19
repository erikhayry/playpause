"use strict";
import {Render} from "../domain/render";
import {WebView} from "../domain/webView";
import {IpcRendererEvent, IpcRenderer} from "../domain/electron";
import {Station} from "../domain/station";
import {Guest} from "../domain/guest";

let render:Render = (function () {
  const LOG = 'color: green; font-weight: bold;';
  console.log('%c render', LOG);

  const MAIN:IpcRenderer = require('electron').ipcRenderer;

  const subscriber = require('./js/render/subscriber');
  const Guest = require('./js/render/guest');
  const db = require('./js/render/db');

  let _guest:Guest;
  let _subscriber = new subscriber();

  //Events
  MAIN.on('playpause', (event:IpcRendererEvent) => {
    console.log('%c render on playpause', LOG, event);
    _guest.onPlayPause();
    _subscriber.publish('playpause', event);
  });

  return {
    getStations: db.getAll,
    getStation: db.get,
    addStation: db.add,
    removeStation: db.remove,

    set: (station:Station, webview:WebView) => {
      console.log('%c render.setStation', LOG,  station);
      _guest = new Guest(webview, station);
    },
    on: _subscriber.on
  }
}());

'use strict';
import IpcRenderer = Electron.IpcRenderer;
import IpcRendererEvent = Electron.IpcRendererEvent;
import WebViewElement = Electron.WebViewElement;

import {Station} from './app/domain/station';
import {Logger} from './app/domain/logger';
import {Subscriber} from './app/render/subscriber';
import {PlayGuest} from './app/render/playGuest';
import {AddGuest} from './app/render/addGuest';
import {DB} from './app/render/db';


//TODO handle exports error on load
export class Render{
  private logger = new Logger('Render', 'pink');
  private subscriber:Subscriber;

  constructor() {
    const MAIN:IpcRenderer = require('electron').ipcRenderer;
    this.subscriber = new Subscriber();

    MAIN.on('playpause', (event:IpcRendererEvent) => this.subscriber.publish('playpause', event));
  }

  getStations = DB.getAll;
  getStation = DB.get;
  addStation = DB.add;
  removeStation = DB.remove;

  buildStation = (station:Station, webview:WebViewElement):PlayGuest => {
    this.logger.log('setStation', station);
    return new PlayGuest(webview, station, this.subscriber);
  };

  buildStationCandidate = (webview:WebViewElement):AddGuest => {
    this.logger.log('setAddStation');
    return new AddGuest(webview, this.subscriber);
  };
}

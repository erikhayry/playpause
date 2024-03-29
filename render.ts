'use strict';
import IpcRenderer = Electron.IpcRenderer;
import IpcRendererEvent = Electron.IpcRendererEvent;
import WebViewElement = Electron.WebViewElement;

import {Station} from './app/domain/station';
import {Logger} from './app/domain/logger';
import {Subscriber} from './app/render/subscriber';
import {PlayGuest} from './app/render/playGuest';
import {AddGuest} from './app/render/addGuest';
import {TesterGuest} from "./app/render/testerGuest";
import {DB} from './app/render/db';

//TODO handle exports error on load
export class Render{
  private logger = new Logger('Render', 'pink');
  private subscriber:Subscriber;

  constructor() {
    this.logger.log('constructor');
    const MAIN:IpcRenderer = require('electron').ipcRenderer;
    this.subscriber = new Subscriber();

    MAIN.on('playpause', (event:IpcRendererEvent) => this.subscriber.publish('playpause', event));
  }

  getStations = DB.getAll;
  getStation = DB.get;
  addStation = DB.add;
  removeStation = DB.remove;

  unsubscribe = (e:any) => {
    this.subscriber.unsubscribe(e)
  }

  buildStation = (station:Station, webview:WebViewElement):PlayGuest => {
    this.logger.log('setStation', station);
    return new PlayGuest(webview, station, this.subscriber);
  };

  buildStationCandidate = (webview:WebViewElement):AddGuest => {
    this.logger.log('setAddStation');
    return new AddGuest(webview, this.subscriber);
  };

  buildTesterStation = (webview:WebViewElement):TesterGuest => {
    this.logger.log('setTesterStation');
    return new TesterGuest(webview, this.subscriber);
  };
}

'use strict';
import {Station} from './app/domain/station';
import IpcRenderer = Electron.IpcRenderer;
import IpcRendererEvent = Electron.IpcRendererEvent;
import WebViewElement = Electron.WebViewElement;

import {Logger} from './app/domain_/Logger';
import {Subscriber} from './app/render/subscriber';
import {Guest} from './app/render/guest';
import {AddGuest} from './app/render/addGuest';

class Render {
  private db = require('./app/render/db');

  guest:Guest;
  addGuest:AddGuest;
  subscriber:Subscriber;
  logger = new Logger('Render', 'pink');

  constructor() {
    const MAIN:IpcRenderer = require('electron').ipcRenderer;
    this.subscriber = new Subscriber();

    MAIN.on('playpause', (event:IpcRendererEvent) => {
      this.logger.log('playpause', event);
      this.guest.onPlayPause();
      this.subscriber.publish('playpause', event);
    });
  }

  getStations = this.db.getAll;
  getStation = this.db.get;
  addStation = this.db.add;
  removeStation = this.db.remove;

  setStation = (station:Station, webview:WebViewElement) => {
    this.logger.log('setStation', station);
    this.guest = new Guest(webview, station);
  };

  setAddStation = (webview:WebViewElement):Promise<any[]> => {
    this.logger.log('setAddStation');
    this.addGuest = new AddGuest(webview);
    return this.addGuest.getButtonsCanidates();
  };

  on = (topic:string, listener:any) =>{
    return this.subscriber.on(topic, listener);
  }
}

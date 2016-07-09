'use strict';
import {Station} from './app/domain/station';
import IpcRenderer = Electron.IpcRenderer;
import IpcRendererEvent = Electron.IpcRendererEvent;
import WebViewElement = Electron.WebViewElement;

import {Logger} from './app/domain_/Logger';
import {Subscriber} from './app/render/subscriber';
import {Guest} from './app/render/guest';

class Render {
  private AddGuest = require('./app/render/addGuest');
  private db = require('./app/render/db');

  guest:Guest;
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
    return new Promise<any>((resolve, reject) => {
      this.guest = new this.AddGuest(webview, this.subscriber);

      //TODO use promise
      this.subscriber.on('onButtonCandidatesFetched', (buttons:any[]) => {
        this.logger.log('onButtonCandidatesFetched', buttons);
        resolve(buttons);
      })
    })
  };

  on = (topic:string, listener:any) =>{
    return this.subscriber.on(topic, listener);
  }
}

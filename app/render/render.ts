"use strict";
import {Station} from "../domain/station";
import {Guest} from "../domain/guest";
import IpcRenderer = Electron.IpcRenderer;
import IpcRendererEvent = Electron.IpcRendererEvent;
import WebViewElement = Electron.WebViewElement;
import {Subscriber} from "../domain/subscriber";
import {iLogger} from "../domain_/iLogger";

class Render {
  private LOG = 'color: pink; font-weight: bold;';
  private NAME = (where:string) => `%c render.${where}`;
  private Guest = require('./app/render/guest');
  private AddGuest = require('./app/render/addGuest');
  private db = require('./app/render/db');

  guest:Guest;
  subscriber:Subscriber;
  logger:iLogger;

  constructor() {
    const MAIN:IpcRenderer = require('electron').ipcRenderer;
    let that = this;
    const Logger = require('./app/domain_/Logger');
    const Subscriber = require('./app/render/subscriber');

    this.subscriber = new Subscriber();
    this.logger = new Logger('Render');

    MAIN.on('playpause', (event:IpcRendererEvent) => {
      console.log(this.NAME('playpause'), this.LOG, event);
      that.guest.onPlayPause();
      that.subscriber.publish('playpause', event);
    });
  }

  getStations = this.db.getAll;
  getStation = this.db.get;
  addStation = this.db.add;
  removeStation = this.db.remove;
  setStation = (station:Station, webview:WebViewElement) => {
    this.logger.log('setStation', station);
    this.guest = new this.Guest(webview, station);
  };

  setAddStation = (webview:WebViewElement):Promise<any[]> => {
    console.log(this.NAME('setAddStation'), this.LOG);
    return new Promise<any>((resolve, reject) => {
      this.guest = new this.AddGuest(webview, this.subscriber);

      //TODO use promise
      this.subscriber.on('onButtonCandidatesFetched', (buttons:any[]) => {
        console.log(this.NAME('onButtonCandidatesFetched'), this.LOG, buttons);
        resolve(buttons);
      })
    })
  };

  on = (topic:string, listener:any) =>{
    return this.subscriber.on(topic, listener);
  }
}

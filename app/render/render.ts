"use strict";
import {Station} from "../domain/station";
import {Guest} from "../domain/guest";
import IpcRenderer = Electron.IpcRenderer;
import IpcRendererEvent = Electron.IpcRendererEvent;
import WebViewElement = Electron.WebViewElement;

class Render {
  private LOG = 'color: pink; font-weight: bold;';
  private NAME = (where:string) => `%c render.${where}`;
  private Subscriber = require('./app/render/subscriber');
  private Guest = require('./app/render/guest');
  private AddGuest = require('./app/render/addGuest');
  private db = require('./app/render/db');

  guest:Guest;
  subscriber = new this.Subscriber();

  constructor() {
    const MAIN:IpcRenderer = require('electron').ipcRenderer;
    let that = this;

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
    console.log(this.NAME('setStation'), this.LOG, station);
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

  on = this.subscriber.on
}

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
  private playGuest:PlayGuest;
  private addGuest:AddGuest;
  private subscriber:Subscriber;

  constructor() {
    const MAIN:IpcRenderer = require('electron').ipcRenderer;
    this.subscriber = new Subscriber();

    MAIN.on('playpause', (event:IpcRendererEvent) => {
      this.logger.log('playpause', event);
      this.playGuest.playPause();
      this.subscriber.publish('playpause', event);
    });
  }

  getStations = DB.getAll;
  getStation = DB.get;
  addStation = DB.add;
  removeStation = DB.remove;

  setStation = (station:Station, webview:WebViewElement) => {
    this.logger.log('setStation', station);
    this.playGuest = new PlayGuest(webview, station);
  };

  setAddStation = (webview:WebViewElement):Promise<any[]> => {
    this.logger.log('setAddStation');
    this.addGuest = new AddGuest(webview);
    return this.addGuest.getButtonsCandidates();
  };

  on = (topic:string, listener:any) =>{
    return this.subscriber.on(topic, listener);
  }
}

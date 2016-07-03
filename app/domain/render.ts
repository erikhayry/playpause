import {Station} from "./station";
import WebViewElement = Electron.WebViewElement;
import EventEmitter = Electron.EventEmitter;

export interface Render{
  on(event:String, callback:any):any
  setStation(station:Station, webview:WebViewElement):void
  setAddStation(webview:WebViewElement):Promise<Array<any>>
  getStations():Promise<Array<Station>>
  getStation(url:string):Promise<Station>
  addStation(station:Station):Promise<Array<Station>>
  removeStation(url:string):Promise<Array<Station>>
}

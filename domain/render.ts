import {Station} from "./station";
import {WebView} from "./webView";
import {Subscriber} from "./subscriber";
export interface Render{
  on(event:String, callback:any):any
  setStation(station:Station, webview:WebView):void
  setAddStation(webview:WebView):void
  getStations():Promise<Array<Station>>
  getStation(url:string):Promise<Station>
  addStation(station:Station):Promise<Array<Station>>
  removeStation(url:string):Promise<Array<Station>>
}

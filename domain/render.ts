import {Station} from "./station";
import {WebView} from "./webView";
export interface Render{
  on(event:String, callback:any):any
  set(station:Station, webview:WebView):void
  getStations():Promise<Array<Station>>
  getStation(url:string):Promise<Station>
  addStation(station:Station):Promise<Array<Station>>
  removeStation(url:string):Promise<Array<Station>>
}

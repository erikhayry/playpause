export interface Render{
  on(event:String, callback:any):any
  setWebView(webview:any):void
  getStations():Array<any>
  setStation(station:any):void
}

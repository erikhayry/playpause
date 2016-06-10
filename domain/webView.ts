export interface WebViewEvent{
  sender: {
    domain:String
  }
}

type WebViewEventCallback = (event: WebViewEvent) => void;

export interface WebView{
  executeJavaScript(script:String):void
  addEventListener(event:String, callback:WebViewEventCallback):any
  openDevTools():void
  getTitle():string
  reload():void
  src:String
}

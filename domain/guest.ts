import {WebView} from "./webView";
import {Station} from "./station";
import {ElementStyle} from "./elementStyle";
export interface Guest{
  getButtons():Array<any>
  getStatus():string;

  onPlayPause():void
}

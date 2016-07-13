import {Render} from "../../render";
export interface PPWindow extends Window {
  render:Render
  PP_EP:any
  electronSafeIpc: {
    send(event:string, ...args:Array<any>):void
  }
}

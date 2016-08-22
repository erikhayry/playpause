import EventEmitter = Electron.EventEmitter;
import WebViewElement = Electron.WebViewElement;
import {Station, StationButtonPath} from "../domain/station";
import {Utils} from './utils';
const safeIPC:EventEmitter = require('electron-safe-ipc/host-webview');

//TODO executeJavaScript with utils or other?
export module GuestActions{

  //TODO generic method for guest actions
/*  function execute(webview:WebViewElement, script:string, event:string):Promise<any>{
    webview.executeJavaScript(script);

    return new Promise<any>((resolve, reject) => {
      let rejectTimeout = setTimeout(() => reject(), 5000);
      safeIPC.on(event, (ret:any) => {
        safeIPC.removeAllListeners(event);
        window.clearTimeout(rejectTimeout);
        resolve(ret)
      });
    })
  }*/


  export function getButtonCandidates(webview:WebViewElement):Promise<any[]>{
    webview.executeJavaScript('PP_EP.getButtonCandidates()');

    return new Promise<any>((resolve, reject) => {
      safeIPC.on('buttonCandidatesFetched', (buttons:any[]) => {
        safeIPC.removeAllListeners('buttonCandidatesFetched');
        resolve(buttons)
      }); //TODO handle reject
    })
  }

  export function getTestableButtonCandidates(id:string, webview:WebViewElement):Promise<any[]>{
    console.log(id);
    webview.executeJavaScript(`PP_EP.getTestableButtonCandidates(${JSON.stringify(id)})`);

    return new Promise<any>((resolve, reject) => {
      safeIPC.on('testableButtonCandidatesFetched'+webview.id, (buttons:any[]) => {
        safeIPC.removeAllListeners('testableButtonCandidatesFetched'+webview.id);
        resolve({
          buttons: buttons,
          id: webview.id
        })
      }); //TODO handle reject
    })
  }

  export function getGuestState(webview:WebViewElement, station:Station):Promise<string>{
    webview.executeJavaScript(`PP_EP.getPlayerState(${JSON.stringify(station.buttons.play)}, ${JSON.stringify(station.buttons.pause)})`);

    return new Promise<any>((resolve, reject) => {
      safeIPC.on('buttonStylesFetched', (res:any) => {
        safeIPC.removeAllListeners('buttonStylesFetched');
        resolve(Utils.getGuestState(res.playBtnStyle, res.pauseBtnStyle))
      }); //TODO handle reject
    })
  }

  export function click(webview:WebViewElement, buttonPath:StationButtonPath):void{
    //webview.executeJavaScript(Utils.click(buttonPath))
    webview.executeJavaScript(`PP_EP.click(${JSON.stringify(buttonPath)})`)
  }
}

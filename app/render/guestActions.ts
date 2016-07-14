import EventEmitter = Electron.EventEmitter;
import WebViewElement = Electron.WebViewElement;
import {Station, StationButtonPath} from "../domain/station";
const safeIPC:EventEmitter = require('electron-safe-ipc/host-webview');
import {Utils} from './utils';

//TODO executeJavaScript with utils or other?
export module GuestActions{
  export function getButtonCandidates(webview:WebViewElement):Promise<any[]>{
    webview.executeJavaScript('PP_EP.getButtonCandidates()');

    return new Promise<any>((resolve, reject) => {
      safeIPC.on('buttonCandidatesFetched', (buttons:any[]) => {
        safeIPC.removeAllListeners('buttonCandidatesFetched');
        resolve(buttons)
      }); //TODO handle reject
    })
  }

  export function getGuestState(webview:WebViewElement, station:Station):Promise<string>{
    let fetchButtons = `electronSafeIpc.send("buttonStylesFetched", ${Utils.getComputedStyle(station.buttons.play)}, ${Utils.getComputedStyle(station.buttons.pause)})`;
    webview.executeJavaScript(fetchButtons);

    return new Promise<any>((resolve, reject) => {
      safeIPC.on('buttonStylesFetched', (playBtnStyle:CSSStyleDeclaration, pauseBtnStyles:CSSStyleDeclaration) => {
        safeIPC.removeAllListeners('buttonStylesFetched');
        resolve(Utils.getGuestState(playBtnStyle, pauseBtnStyles))
      }); //TODO handle reject
    })
  }

  export function click(webview:WebViewElement, buttonPath:StationButtonPath):void{
    webview.executeJavaScript(Utils.click(buttonPath))
  }
}

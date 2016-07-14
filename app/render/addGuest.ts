import WebViewElement = Electron.WebViewElement;
import EventEmitter = Electron.EventEmitter;
import {Guest} from './guest';

const path = require('path');
const fs = require('fs');
const safeIPC:EventEmitter = require('electron-safe-ipc/host-webview');

const root = path.dirname(require.main.filename);

const utils = require(root + '/app/render/utils.js');

export class AddGuest extends Guest{
  getButtonCandidates(){
    this.webview.executeJavaScript('PP_EP.getButtonCandidates()');

    return new Promise<any>((resolve, reject) => {
      safeIPC.on('buttonCandidatesFetched', (buttons:Array<any>) => {
        safeIPC.removeAllListeners('buttonCandidatesFetched');
        resolve(buttons)
      }); //TODO handle reject
    })
  }
}

import WebViewElement = Electron.WebViewElement;
import EventEmitter = Electron.EventEmitter;
import {Logger} from "../domain_/Logger";
import {Subscriber} from "./subscriber";

const path = require('path');
const fs = require('fs');
const safeIPC:EventEmitter = require("electron-safe-ipc/host-webview");

const root = path.dirname(require.main.filename);

const utils = require(root + '/app/render/utils.js');

export class AddGuest {
  private logger = new Logger('AddGuest', 'green');
  private webview:WebViewElement;

  constructor(webview:Electron.WebViewElement) {
    this.webview = webview;

    this.webview.executeJavaScript(fs.readFileSync(root + '/app/guest/lib/electronSafeIpc.js').toString());
    this.webview.executeJavaScript(fs.readFileSync(root + '/app/guest/guest-utils.js').toString());
  }

  getButtonsCanidates():Promise<any[]>{
    this.logger.log('getButtonsCanidates');
    this.webview.executeJavaScript('PP_EP.getButtonCandidates()');
    return new Promise<any>((resolve, reject) => {
      safeIPC.on("buttonCandidatesFetched", (buttons:Array<any>) => resolve(buttons)); //TODO handle reject
    })
  }

}

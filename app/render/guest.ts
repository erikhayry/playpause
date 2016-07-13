import WebViewElement = Electron.WebViewElement;
import EventEmitter = Electron.EventEmitter;
import {Logger} from "../domain/logger";

const path = require('path');
const fs = require('fs');
const root = path.dirname(require.main.filename);

export class Guest{
  logger = new Logger('Guest', 'green');
  webview:WebViewElement;

  constructor(webview:Electron.WebViewElement) {
    this.webview = webview;

    this.webview.executeJavaScript(fs.readFileSync(root + '/app/guest/lib/electronSafeIpc.js').toString());
    this.webview.executeJavaScript(fs.readFileSync(root + '/app/guest/guest-utils.js').toString());
  }
}

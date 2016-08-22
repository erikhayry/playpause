import WebViewElement = Electron.WebViewElement;
import EventEmitter = Electron.EventEmitter;
import {Logger} from "../domain/logger";
import {Subscriber} from "./subscriber";

const path = require('path');
const fs = require('fs');
const root = path.dirname(require.main.filename);

export abstract class Guest{
  logger = new Logger('Guest', 'green');
  webview:WebViewElement;
  subscriber:Subscriber;

  constructor(webview:Electron.WebViewElement, subscriber:Subscriber) {
    this.logger.log('constructor', webview.src);
    this.webview = webview;
    this.subscriber = subscriber;

    this.webview.executeJavaScript(fs.readFileSync(root + '/app/guest/lib/electronSafeIpc.js').toString());
    this.webview.executeJavaScript(fs.readFileSync(root + '/app/guest/guest-utils.js').toString());
    this.webview.executeJavaScript(fs.readFileSync(root + '/app/guest/xpath-utils.js').toString());
  }

  on = (topic:string, listener:any) =>{
    return this.subscriber.on(topic, listener);
  };
}

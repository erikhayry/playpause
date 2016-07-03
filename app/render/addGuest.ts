import {Guest} from "../domain/guest";
import {WebView} from "../domain/webView";
import {Station} from "../domain/station";
import {ElementStyle} from "../domain/elementStyle";
import {SafeIPC} from "../domain/electron";
import {Subscriber} from "../domain/subscriber";

const path = require('path');
const fs = require('fs');
const safeIPC:SafeIPC = require("electron-safe-ipc/host-webview");

const root = path.dirname(require.main.filename);
const LOG = 'color: green; font-weight: bold;';

const utils = require(root + '/app/render/utils.js');

let addGuest = (webview:WebView, subscriber:Subscriber):any => {
  let _webview = webview;
  let _subscriber = subscriber;

  _webview.executeJavaScript(fs.readFileSync(root + '/app/guest/lib/electronSafeIpc.js').toString());
  _webview.executeJavaScript(fs.readFileSync(root + '/app/guest/guest-utils.js').toString());
  _webview.executeJavaScript('PP_EP.getButtonCandidates()');

  safeIPC.on("buttonCandidatesFetched", (buttons:Array<any>) => onButtonCandidatesFetched(buttons));

  let onButtonCandidatesFetched = (buttons:Array<any>):void => {
    console.log('%c render onButtonsFetched', LOG, buttons);
    _subscriber.publish('onButtonCandidatesFetched', buttons)
  };
};

module.exports = addGuest;

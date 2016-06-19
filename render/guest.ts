import {Guest} from "../domain/guest";
import {WebView} from "../domain/webView";
import {Station} from "../domain/station";
import {ElementStyle} from "../domain/elementStyle";
import {SafeIPC} from "../domain/electron";

const path = require('path');
const fs = require('fs');
const safeIPC:SafeIPC = require("electron-safe-ipc/host-webview");

const root = path.dirname(require.main.filename);
const LOG = 'color: green; font-weight: bold;';

const utils = require(root + '/js/render/utils.js');

let guest = (webview:WebView, station:Station):Guest => {
  let _webview = webview;
  let _station = station;

  _webview.executeJavaScript(fs.readFileSync(root + '/lib/electronSafeIpc.js').toString());
  _webview.executeJavaScript(fs.readFileSync(root + '/js/guest/guest-utils.js').toString());
  _webview.executeJavaScript('PP_EP.getButtons()');

  safeIPC.on("buttonStylesFetched", (playBtnStyle:ElementStyle, pauseBtnStyles:ElementStyle) =>
    onButtonStylesFetched(playBtnStyle, pauseBtnStyles)
  );

  safeIPC.on("buttonsFetched", (buttons:Array<any>) => onButtonsFetched(buttons));

  let onButtonStylesFetched = (playBtnStyle:ElementStyle, pauseBtnStyles:ElementStyle):void => {
    console.log('%c render on buttonStylesFetched', LOG, !!playBtnStyle, !!pauseBtnStyles);
    switch(utils.getGuestState(playBtnStyle, pauseBtnStyles)){
      case 'playing':
        _webview.executeJavaScript(utils.click(_station.buttons.pause));
        break;
      case 'paused':
      default:
        _webview.executeJavaScript(utils.click(_station.buttons.play))
    }
  };

  let onButtonsFetched = (buttons:Array<any>):void => {
    console.log('%c render onButtonsFetched', LOG, buttons);
  };

  return {
    getButtons: ():Array<any> => {
        return null;
    },

    getStatus: () => {
        return '';
    },

    onPlayPause: ():void => {
      if(_station){
        if(_station.buttons.play !== _station.buttons.pause){
          let _fetchButtons = 'electronSafeIpc.send("buttonStylesFetched", ' + utils.getComputedStyle(_station.buttons.play) + ',' + utils.getComputedStyle(_station.buttons.pause) + ')';
          console.log('%c ' + _fetchButtons, LOG);
          _webview.executeJavaScript(_fetchButtons);
        }
        else{
          _webview.executeJavaScript(utils.click(_station.buttons.play))
        }
      }
    }
  }
};

module.exports = guest;

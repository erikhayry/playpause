import {Guest} from "../domain/guest";
import {WebView} from "../domain/webView";
import {Station} from "../domain/station";
import {ElementStyle} from "../domain/elementStyle";

const path = require('path');
const fs = require('fs');


const LOG = 'color: green; font-weight: bold;';

//TODO require utils here
let guest = (webview:WebView, station:Station, utils:any):Guest => {
  let _webview = webview;
  let _station = station;
  let _utils = utils;

  _webview.executeJavaScript(fs.readFileSync(path.dirname(require.main.filename) + '/lib/electronSafeIpc.js').toString());
  _webview.executeJavaScript(fs.readFileSync(path.dirname(require.main.filename) + '/js/guest/guest-utils.js').toString());
  _webview.executeJavaScript('PP_EP.getButtons()');

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
          let _fetchButtons = 'electronSafeIpc.send("buttonStylesFetched", ' + _utils.getComputedStyle(_station.buttons.play) + ',' + _utils.getComputedStyle(_station.buttons.pause) + ')';
          console.log('%c ' + _fetchButtons, LOG);
          _webview.executeJavaScript(_fetchButtons);
        }
        else{
          _webview.executeJavaScript(_utils.click(_station.buttons.play))
        }
      }
    },

    onButtonStylesFetched: (playBtnStyle:ElementStyle, pauseBtnStyles:ElementStyle):void => {
      console.log('%c render on buttonStylesFetched', LOG, !!playBtnStyle, !!pauseBtnStyles);
      switch(_utils.getGuestState(playBtnStyle, pauseBtnStyles)){
       case 'playing':
         _webview.executeJavaScript(_utils.click(_station.buttons.pause));
       break;
       case 'paused':
       default:
         _webview.executeJavaScript(_utils.click(_station.buttons.play))
       }
    },

    onButtonsFetched: (buttons:Array<any>):void => {
      console.log('%c render onButtonsFetched', LOG, buttons);
    }
  }
};

module.exports = guest;

import WebViewElement = Electron.WebViewElement;
import EventEmitter = Electron.EventEmitter;
import {Station} from "../ui/domain/stations";
import {Logger} from "../domain_/Logger";
import {Utils} from "./utils";

const path = require('path');
const fs = require('fs');
const safeIPC:EventEmitter = require("electron-safe-ipc/host-webview");
const root = path.dirname(require.main.filename);

export class Guest {
  private logger = new Logger('Guest', 'green');
  private webview:WebViewElement;
  private station:Station;

  constructor(webview:Electron.WebViewElement, station:Station) {
    this.webview = webview;
    this.station = station;

    this.webview.executeJavaScript(fs.readFileSync(root + '/app/guest/lib/electronSafeIpc.js').toString());
    this.webview.executeJavaScript(fs.readFileSync(root + '/app/guest/guest-utils.js').toString());
    this.webview.executeJavaScript('PP_EP.getButtons()');

    safeIPC.on("buttonStylesFetched", (playBtnStyle:CSSStyleDeclaration, pauseBtnStyles:CSSStyleDeclaration) =>
      this.onButtonStylesFetched(playBtnStyle, pauseBtnStyles)
    );

    safeIPC.on("buttonsFetched", (buttons:Array<any>) => this.onButtonsFetched(buttons));
  }

  private onButtonStylesFetched = (playBtnStyle:CSSStyleDeclaration, pauseBtnStyles:CSSStyleDeclaration):void => {
   this.logger.log('onButtonStylesFetched', !!playBtnStyle, !!pauseBtnStyles);
    switch (Utils.getGuestState(playBtnStyle, pauseBtnStyles)) {
      case 'playing':
        this.webview.executeJavaScript(Utils.click(this.station.buttons.pause));
        break;
      case 'paused':
      default:
        this.webview.executeJavaScript(Utils.click(this.station.buttons.play))
    }
  };

  private onButtonsFetched = (buttons:Array<any>):void => {
    this.logger.log('onButtonsFetched', buttons);
  };

  getButtons():Array<any> {
    return null;
  }

  getStatus() {
    return '';
  }

  onPlayPause():void {
    if (this.station) {
      if (this.station.buttons.play !== this.station.buttons.pause) {
        let fetchButtons = 'electronSafeIpc.send("buttonStylesFetched", ' + Utils.getComputedStyle(this.station.buttons.play) + ',' + Utils.getComputedStyle(this.station.buttons.pause) + ')';
        this.logger.log('onPlayPause', fetchButtons);
        this.webview.executeJavaScript(fetchButtons);
      }
      else {
        this.webview.executeJavaScript(Utils.click(this.station.buttons.play))
      }
    }
  }
}

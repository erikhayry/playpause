  import WebViewElement = Electron.WebViewElement;
  import EventEmitter = Electron.EventEmitter;
  import {Station} from '../domain/station';
  import {Guest} from './guest';
  import {Subscriber} from './subscriber';
  import {GuestActions} from './guestActions';

  export class PlayGuest extends Guest{
    private station:Station;

    constructor(webview:Electron.WebViewElement, station:Station, subscriber:Subscriber) {
      super(webview, subscriber);
      this.logger.log('constructor');
      this.station = station;
    }

    //TODO types for state. Enum?
    private onGuestStyleFetched = (state:string):void => {
      this.logger.log('onGuestStyleFetched', state);

      switch (state) {
        case 'playing':
          GuestActions.click(this.webview, this.station.buttons.pause);
          break;
        case 'paused':
        default:
          GuestActions.click(this.webview, this.station.buttons.play);
      }
    };

    playPause():void {
      this.logger.log('playPause');
      if (this.station && this.station.buttons.play !== this.station.buttons.pause) {
        GuestActions.getGuestState(this.webview, this.station)
          .then(this.onGuestStyleFetched)
      }
      else {
        GuestActions.click(this.webview, this.station.buttons.play)
      }
    }
  }

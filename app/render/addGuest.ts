import WebViewElement = Electron.WebViewElement;
import EventEmitter = Electron.EventEmitter;
import {Guest} from './guest';
import {GuestActions} from './guestActions';

export class AddGuest extends Guest{
  getButtonCandidates = () => GuestActions.getButtonCandidates(this.webview);
  getTestableButtonCandidates = (id:string, webview:WebViewElement) => GuestActions.getTestableButtonCandidates(id, webview)
}

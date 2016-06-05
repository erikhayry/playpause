import { ViewChild, ViewChildren, Component, QueryList, ElementRef } from '@angular/core';
import {PPWindowImpl} from "../domain/window";

declare var ppRender: any;


@Component({
  selector: 'wv',
  template: `
    {{wvSrc}}
    <ul>
        <li><button (click)="setSrc('https://soundcloud.com/jonwayne')">soundcloud</button></li>
        <li><button (click)="setSrc('https://www.bbc.co.uk/radio/player/bbc_6music')">bbc</button></li>
        <li><button (click)="setSrc('https://play.spotify.com/browse')">spotify</button></li>
    </ul>
    <div *ngIf="wvSrc != ''">
      <webview 
               #wv
               id="wv"
               style="display:inline-flex; width:640px; height:480px"
               autosize="on"
               minwidth="576" minheight="432"
               plugins
               allowpopups
               disablewebsecurity
      ></webview>    
    </div>
  `
})

export class WebviewComponent{
  _webview:any;
  _window:PPWindowImpl;
  wvSrc:String;

    constructor() {
      this._window = (<PPWindowImpl>window);
    }

    @ViewChild('wv') input:ElementRef;
    ngAfterViewInit() {
      console.log(this.input.nativeElement);
      this._webview = this.input.nativeElement;

      this._window.render.setWv(this._webview)
      this._window.render.on('playpause', function(e){
        console.log('onPlayPause', e)
      });

      let _loadstart = function() {
        console.log('loading');
      };

      let _loadstop = function() {
      };

      this._webview.addEventListener('did-start-loading', _loadstart);
      this._webview.addEventListener('did-stop-loading', _loadstop);

      this._webview.addEventListener('dom-ready', function(){
        if(this._webview){
          this._webview.openDevTools();
        }
      });

      this._webview.addEventListener('console-message', function(e){
        console.log(e)
      });

      this._webview.addEventListener('media-started-playing', function(e){
        console.log(e)
      });

      this._webview.addEventListener('media-paused', function(e){
        console.log(e)
      });
    }

  setSrc = (src) =>{
    this.wvSrc = src;
    this._webview.src = src;
  }
}

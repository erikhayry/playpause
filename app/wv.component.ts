import { ViewChild, Component, ElementRef } from '@angular/core';
import {PPWindowImpl} from "../domain/window";
import {WebView, WebViewEvent} from "../domain/webView";

@Component({
  selector: 'wv',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 sidebar">
          <ul class="nav nav-sidebar" >
              <li *ngFor="let station of stations">
                <button class="btn btn-block btn-primary" (click)="setStation(station)">{{station.name}}</button>
              </li>
          </ul>
          <button  class="btn btn-block btn-primary" (click)="openDevTools()">Open dev tools</button>
        </div>        
        <div class="col-sm-9 main" *ngIf="wvSrc != ''">
          <webview 
            #wv
            id="wv"
            style="display:inline-flex; width:100%; height:100%"
            autosize="on"
            plugins
            allowpopups
            disablewebsecurity
          ></webview>    
          </div>
        </div>
     </div>   
  `
})

export class WebviewComponent{
  _webview:WebView;
  _window:PPWindowImpl;
  stations:Array<any>;
  station:any;

  constructor() {
    console.log('app > WebviewComponent');
    this._window = (<PPWindowImpl>window);
    this.stations = this._window.render.getStations();
  }

  @ViewChild('wv') input:ElementRef;
  ngAfterViewInit() {
    console.log('app > WebviewComponent.ngAfterViewInit', this.input.nativeElement);
    this._webview = this.input.nativeElement;

    //Set up  render
    this._window.render.setWebView(this._webview);
    this._window.render.on('playpause', (e:WebViewEvent) => {
      console.log('app > WebviewComponent render on playpause', e);
    });

    //Web view events
    this._webview.addEventListener('did-start-loading', (e:WebViewEvent) => {
      console.log('app > WebviewComponent webview on did-start-loading', e);
    });

    this._webview.addEventListener('did-stop-loading', (e:WebViewEvent) => {
      console.log('app > WebviewComponent webview on did-stop-loading', e);
    });

    this._webview.addEventListener('dom-ready', (e:WebViewEvent)=> {
      console.log('app > WebviewComponent webview on dom-ready', e);
    });

    this._webview.addEventListener('console-message', (e:WebViewEvent)=> {
      console.log('app > WebviewComponent webview on console-message', e);
    });

    this._webview.addEventListener('media-started-playing', (e:WebViewEvent)=> {
      console.log('app > WebviewComponent webview on media-started-playing', e);

    });

    this._webview.addEventListener('media-paused', (e:WebViewEvent)=> {
      console.log('app > WebviewComponent webview on media-paused', e);

    });
  }

  setStation = (station:any) =>{
    this._webview.src = station.url;
    this.station = station;
    this._window.render.setStation(station)
  };

  openDevTools = () => {
    this._webview.openDevTools();
  }
}

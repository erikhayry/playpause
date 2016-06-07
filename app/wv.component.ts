import {ViewChild, Component, ElementRef} from '@angular/core';
import {PPWindowImpl} from "../domain/window";
import {WebView, WebViewEvent} from "../domain/webView";
import {Station} from "../domain/station";
import {Render} from "../domain/render";

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
          <button class="btn btn-block btn-primary" (click)="openDevTools()">Open dev tools</button>
        </div>        
        <div class="col-sm-9 main" *ngIf="wvSrc != ''">
          <h3 class="text-center">{{webViewTitle}}</h3>
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
  private webView:WebView;
  private render:Render;
  stations:Array<any>;
  currentStation:Station;
  webViewTitle:string;

  constructor() {
    console.log('app > WebviewComponent');
    this.render = (<PPWindowImpl>window).render;
    this.stations = this.render.getStations();
  }

  @ViewChild('wv') input:ElementRef;
  ngAfterViewInit() {
    console.log('app > WebviewComponent.ngAfterViewInit', this.input.nativeElement);
    this.webView = this.input.nativeElement;

    //Set up render
    this.render.setWebView(this.webView);
    this.render.on('playpause', (e:WebViewEvent) => {
      console.log('app > WebviewComponent render on playpause', e);
    });

    //Web view events
    this.webView.addEventListener('did-start-loading', (e:WebViewEvent) => {
      //console.log('app > WebviewComponent webView on did-start-loading', e);
    });

    this.webView.addEventListener('did-stop-loading', (e:WebViewEvent) => {
      //console.log('app > WebviewComponent webView on did-stop-loading', e);
    });

    this.webView.addEventListener('dom-ready', (e:WebViewEvent)=> {
      console.log('app > WebviewComponent webView on dom-ready', e);
      this.webViewTitle = this.webView.getTitle()
    });

    this.webView.addEventListener('console-message', (e:WebViewEvent)=> {
      //console.log('app > WebviewComponent webView on console-message', e);
    });

    this.webView.addEventListener('media-started-playing', (e:WebViewEvent)=> {
      console.log('app > WebviewComponent webView on media-started-playing', e);

    });

    this.webView.addEventListener('media-paused', (e:WebViewEvent)=> {
      console.log('app > WebviewComponent webView on media-paused', e);

    });
  }

  setStation = (station:Station) =>{
    this.webView.src = station.url;
    this.render.setStation(station)
    this.currentStation = station;
  };

  openDevTools = () => {
    this.webView.openDevTools();
  }
}

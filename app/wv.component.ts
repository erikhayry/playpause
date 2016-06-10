import {ViewChild, Component, ElementRef, SimpleChange} from '@angular/core';
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
        <div class="col-sm-9 main">
          <h3 class="text-center">{{guestTitle}}</h3>
          <webview 
            #quest
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
  private guest:WebView;
  private render:Render;
  stations:Array<any>;
  currentStation:Station;
  guestTitle:string;

  constructor() {
    console.log('app > WebviewComponent');
    this.render = (<PPWindowImpl>window).render;
    this.stations = this.render.getStations();
    this.currentStation = this.stations[0];
  }

  @ViewChild('quest') input:ElementRef;
  ngAfterViewInit() {
    console.log('app > WebviewComponent.ngAfterViewInit', this.input);
    this.guest = this.input.nativeElement;
    this.guest.src = this.currentStation.url;

    this.render.on('playpause', (e:WebViewEvent) => {
      console.log('app > WebviewComponent render on playpause', e);
    });

    this.guest.addEventListener('dom-ready', (e:WebViewEvent) => {
      console.log('app > WebviewComponent webView on dom-ready', e);
      this.guestTitle = this.guest.getTitle();
      this.render.set(this.currentStation, this.guest);
      this.guest.openDevTools();
    });
  }

  setStation = (station:Station) => {
    this.guest.src = station.url;
    this.currentStation = station;
  };

  openDevTools = () => {
    this.guest.openDevTools();
  }
}

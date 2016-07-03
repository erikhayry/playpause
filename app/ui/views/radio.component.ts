import {ViewChild, Component, ElementRef} from '@angular/core';
import {PPWindowImpl} from "../../domain/window";
import {WebView, WebViewEvent} from "../../domain/webView";
import {Render} from "../../domain/render";
import {Station, ButtonPath, StationButtons} from "../domain/stations";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-5 sidebar">
          <ul class="nav nav-sidebar" >
              <li *ngFor="let station of stations">
                {{station.name}} 
                <button class="btn btn-block btn-primary" (click)="openStation(station)">Open</button>
                <button class="btn btn-block btn-danger" (click)="removeStation(station.url)">Remove</button>
              </li>
          </ul>
          <hr>
          <a class="btn btn-block btn-primary" [routerLink]="['/add-station']">Add Station</a>
          <button class="btn btn-block btn-primary" (click)="openDevTools()">Open dev tools</button>
          

        </div>                 
        <div class="col-sm-7 main">
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
  `,
  directives: [ROUTER_DIRECTIVES],
})

export class RadioComponent{
  private LOG = 'color: red; font-weight: bold;';
  private guest:WebView;
  private render:Render;
  stations:Array<Station>;
  currentStation:Station;
  guestTitle:string;

  constructor() {
    console.log('%c app > RadioComponent', this.LOG);
    this.render = (<PPWindowImpl>window).render;
  }

  @ViewChild('quest') input:ElementRef;
  ngAfterViewInit() {
    console.log('%c app > RadioComponent.ngAfterViewInit', this.LOG, this.input);
    this.guest = this.input.nativeElement;

    this.render.getStations().then(stations => {
      this.stations = stations;
      this.currentStation = this.stations[0];
      this.guest.src = this.currentStation.url;
    });

    this.render.on('playpause', (e:WebViewEvent) => {
      console.log('%c app > RadioComponent render on playpause', this.LOG, e);
    });

    this.guest.addEventListener('dom-ready', (e:WebViewEvent) => {
      console.log('%c app > RadioComponent webView on dom-ready', this.LOG, e);
      this.guestTitle = this.guest.getTitle();
      this.render.setStation(this.currentStation, this.guest);
      this.guest.openDevTools();
    });
  }

  openStation = (station:Station) => {
    console.log('%c app > RadioComponent.openStation', this.LOG, station);
    this.guest.src = station.url;
    this.currentStation = station;
  };

  removeStation = (url:string) => {
    console.log('%c app > RadioComponent.removeStation', this.LOG, url);
    this.render.removeStation(url).then(stations => {
      console.log('%c app > RadioComponent.removeStation > removed', this.LOG, stations);
      this.stations = stations;
    })
  };

  openDevTools = () => {
    this.guest.openDevTools();
  };
}

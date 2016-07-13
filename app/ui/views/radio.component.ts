import {ViewChild, Component, ElementRef} from '@angular/core';
import {PPWindowImpl} from "../../domain/window";
import {Render} from "../../../render";
import {Station} from "../../domain/station";
import {ROUTER_DIRECTIVES} from "@angular/router";
import WebViewElement = Electron.WebViewElement;
import WebViewElementEvent = Electron.WebViewElement.Event;
import {Logger} from "../../domain/logger";

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
  directives: [ROUTER_DIRECTIVES]
})

export class RadioComponent{
  private logger = new Logger('RadioComponent', 'red');
  private guest:WebViewElement;
  private render:Render;
  stations:Array<Station>;
  currentStation:Station;
  guestTitle:string;

  constructor() {
    this.render = (<PPWindowImpl>window).render;
  }

  @ViewChild('quest') input:ElementRef;
  ngAfterViewInit() {
    this.logger.log('ngAfterViewInit', this.input);
    this.guest = this.input.nativeElement;

    this.render.getStations().then((stations:Station[]) => {
      this.stations = stations;
      this.currentStation = this.stations[0];
      this.guest.src = this.currentStation.url;
    });

    this.render.on('playpause', (e:Event) => {
      this.logger.log('onPlaypause', e);
    });

    this.guest.addEventListener('dom-ready', (e:WebViewElementEvent) => {
      this.logger.log('onDom-ready', e);
      this.guestTitle = this.guest.getTitle();
      this.render.setStation(this.currentStation, this.guest);
      this.guest.openDevTools();
    });
  }

  openStation = (station:Station) => {
    this.logger.log('openStation', station);
    this.guest.src = station.url;
    this.currentStation = station;
  };

  removeStation = (url:string) => {
    this.logger.log('removeStation', url);
    this.render.removeStation(url).then((stations:Station[]) => {
      this.logger.log('removeStation > removed', stations);
      this.stations = stations;
    })
  };

  openDevTools = () => {
    this.guest.openDevTools();
  };
}

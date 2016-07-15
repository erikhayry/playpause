import {ViewChild, Component, ElementRef} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router";
import WebViewElement = Electron.WebViewElement;
import WebViewElementEvent = Electron.WebViewElement.Event;
import {Station} from "../../domain/station";
import {Logger} from "../../domain/logger";
import {RenderComponent} from "./render.component";

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
            #guest
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

export class RadioComponent extends RenderComponent{
  stations:Array<Station>;
  currentStation:Station;
  guestTitle:string;

  constructor(){
    super('RadioComponent')
  }

  openStation = (station:Station) => {
    this.unsubscribe();
    this.logger.log('openStation', station);
    this.guest.src = station.url;
    this.currentStation = station;
  };

  removeStation = (url:string) => {
    this.unsubscribe();
    this.logger.log('removeStation', url);
    this.render.removeStation(url).then((stations:Station[]) => {
      this.logger.log('removeStation > removed', stations);
      this.stations = stations;
    })
  };

  openDevTools = () => {
    this.guest.openDevTools();
  };

  domReady():void{
    this.logger.log('domReady');
    this.guestTitle = this.guest.getTitle();
    var playGuest = this.render.buildStation(this.currentStation, this.guest);

    this.events.push(playGuest.on('playpause', (e:Event) => playGuest.playPause()));
    this.guest.openDevTools();
  }

  afterInit(){
    this.logger.log('afterInit');
    this.render.getStations().then((stations:Station[]) => {
      this.stations = stations;
      this.currentStation = this.stations[0];
      this.guest.src = this.currentStation.url;
    });
  };
}

import {ViewChild, Component, ElementRef, SimpleChange} from '@angular/core';
import {PPWindowImpl} from "../domain/window";
import {WebView, WebViewEvent} from "../domain/webView";
import {Render} from "../domain/render";
import {Station, ButtonPath, StationButtons} from "./stations";
import {Observable} from "rxjs/Rx";


@Component({
  selector: 'wv',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 sidebar">
          <ul class="nav nav-sidebar" >
              <li *ngFor="let station of stations">
                {{station.name}} 
                <button class="btn btn-block btn-primary" (click)="openStation(station)">Open</button>
                <button class="btn btn-block btn-danger" (click)="removeStation(station.url)">Remove</button>
              </li>
          </ul>
          <hr>
          <button class="btn btn-block btn-primary" (click)="adding = true">Add Station</button>
          <button class="btn btn-block btn-primary" (click)="openDevTools()">Open dev tools</button>
          
          <div *ngIf="adding">
            <hr>
            <div class="input-group">
              <input type="text" class="form-control" placeholder="URL" [(ngModel)]="newUrl">
            </div>       
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Name" [(ngModel)]="newName">
            </div>   
            <div class="input-group">
              <input type="text" class="form-control" placeholder="play button" [(ngModel)]="newPlay">
            </div>   
            <div class="input-group">
              <input type="text" class="form-control" placeholder="pause button" [(ngModel)]="newPause">
            </div> 
            <br>
            <button class="btn btn-block btn-primary" (click)="addStation(newUrl, newName, newPlay, newPause)" [disabled]="!newUrl">Add</button>
            <button class="btn btn-block btn-primary" (click)="adding = false">Close</button>
          </div> 
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
  private LOG = 'color: red; font-weight: bold;';
  private guest:WebView;
  private render:Render;
  stations:Observable<Array<any>>;
  currentStation:Station;
  guestTitle:string;
  adding = false;
  newUrl:string;
  newName:string;
  newPlay:string;
  newPause:string;

  constructor() {
    console.log('%c app > WebviewComponent', this.LOG);
    this.render = (<PPWindowImpl>window).render;
    this.render.getStations().then(stations => {
      console.log(stations)
      this.stations = stations;
      this.currentStation = this.stations[0];
      if(this.currentStation && this.guest && !this.guest.src){
        this.guest.src = this.currentStation.url;
      }
    });
  }

  @ViewChild('quest') input:ElementRef;
  ngAfterViewInit() {
    console.log('%c app > WebviewComponent.ngAfterViewInit', this.LOG, this.input);
    this.guest = this.input.nativeElement;
    if(this.currentStation &&  !this.guest.src){
      this.guest.src = this.currentStation.url;
    }

    this.render.on('playpause', (e:WebViewEvent) => {
      console.log('%c app > WebviewComponent render on playpause', this.LOG, e);
    });

    this.guest.addEventListener('dom-ready', (e:WebViewEvent) => {
      console.log('%c app > WebviewComponent webView on dom-ready', this.LOG, e);
      this.guestTitle = this.guest.getTitle();
      this.render.set(this.currentStation, this.guest);
      this.guest.openDevTools();
    });
  }

  openStation = (station:Station) => {
    console.log('%c app > WebviewComponent.openStation', this.LOG, station);
    this.guest.src = station.url;
    this.currentStation = station;
  };

  removeStation = (url:string) => {
    console.log('%c app > WebviewComponent.removeStation', this.LOG, url);
    this.render.removeStation(url).then(stations => {
      console.log('%c app > WebviewComponent.removeStation > removed', this.LOG, stations);
      this.stations = stations;
    })
  };

  openDevTools = () => {
    this.guest.openDevTools();
  };

  addStation = (newUrl, newName, newPlay, newPause) => {
    console.log('%c app > WebviewComponent.addStation', this.LOG, newUrl, newName, newPlay, newPause);

    let _play = new ButtonPath(newPlay, 'selector');
    let _pause = new ButtonPath(newPause, 'selector');
    let _buttons = new StationButtons(_play, _pause);

    this.render.addStation(new Station(newName, newUrl, _buttons)).then(stations => {
      console.log('%c app > WebviewComponent.removeStation > added', this.LOG, stations);
      this.stations = stations;
    })
  };
}

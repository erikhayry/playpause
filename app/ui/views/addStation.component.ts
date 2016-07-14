import {ViewChild, Component, ElementRef} from '@angular/core';
import {Station, StationButtonPath, StationButtons} from "../../domain/station";
import {ROUTER_DIRECTIVES} from "@angular/router";
import WebViewElement = Electron.WebViewElement;
import {RenderComponent} from "./render.component";

@Component({
  template: `
    <div class="container-fluid">
      <h1>Add Station</h1>
      <a class="btn btn-block btn-primary" [routerLink]="['/play-station']">Back</a>
      
      <hr>
      <div class="input-group">
        <input type="text" class="form-control" placeholder="URL" [(ngModel)]="url">
      </div>    
      <button class="btn btn-block btn-primary" (click)="loadUrl(url)">Load</button>
      
      <hr>
      
      <p>Play buttons path: <span *ngIf="playButton">{{playButton.path}}</span></p>
      <p>Pause buttons path: <span *ngIf="pauseButton">{{pauseButton.path}}</span></p>
      
      <button *ngIf="url && playButton && pauseButton && !added" class="btn btn-block btn-primary" (click)="addStation(url, url, playButton.path, pauseButton.path)">Add</button>
      
      <div *ngIf="added">
        <p>Stations added</p>
        <a class="btn btn-block btn-primary" [routerLink]="['/play-station']">Ok</a>    
      </div>
      
      <webview 
            #guest
            style="display:inline-flex; width:100%; height:100%"
            autosize="on"
            plugins
            allowpopups
            disablewebsecurity
      ></webview> 
    </div>
  `,
  directives: [ROUTER_DIRECTIVES],
})

export class AddStationComponent extends RenderComponent{
  url = 'http://sverigesradio.se/';
  playButton:any;
  pauseButton:any;
  added = false;

  constructor() {
    super('AddStationComponent')
  }

  afterInit():void {
    //Do nothing
  }

  domReady():void{
    this.logger.log('domReady');
    var stationCandidate = this.render.buildStationCandidate(this.guest);
    stationCandidate.getButtonCandidates().then((buttons:Array<any>) => {
      this.logger.log('render on onButtonCandidatesFetched', buttons);
      this.playButton = buttons.find(button => button.isPlayButton);
      this.pauseButton = buttons.find(button => button.isPauseButton) || this.playButton;
    });

    this.guest.openDevTools();
  }

  loadUrl = (url:string) => {
    this.logger.log('loadUrl', url);
    this.guest.src = url;
  };

  addStation = (newUrl:string, newName:string, newPlay:string, newPause:string) => {
    this.logger.log('addStation', newUrl, newName, newPlay, newPause);

    let _play = new StationButtonPath(newPlay, 'selector');
    let _pause = new StationButtonPath(newPause, 'selector');
    let _buttons = new StationButtons(_play, _pause);

    this.render.addStation(new Station(newName, newUrl, _buttons)).then((stations:Station[]) => {
      this.logger.log('addStation > added', stations);
      this.added = true;
    })
  };
}

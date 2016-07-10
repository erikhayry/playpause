import {ViewChild, Component, ElementRef} from '@angular/core';
import {PPWindowImpl} from "../../domain/window";
import {Render} from "../../../render";
import {Station, ButtonPath, StationButtons} from "../domain/stations";
import {ROUTER_DIRECTIVES} from "@angular/router";
import WebViewElement = Electron.WebViewElement;
import {Logger} from "../../domain_/Logger";

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
            #newStation
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

export class AddStationComponent{
  private logger = new Logger('AddStationComponent', 'red');
  private render:Render;
  newStation:WebViewElement;
  url = 'http://sverigesradio.se/';
  playButton:any;
  pauseButton:any;
  added = false;

  constructor() {
    this.render = (<PPWindowImpl>window).render;
  }

  @ViewChild('newStation') input:ElementRef;
  ngAfterViewInit() {
    this.logger.log('ngAfterViewInit', this.input);
    this.newStation = this.input.nativeElement;

    this.newStation.addEventListener('dom-ready', (e:Event) => {
      this.logger.log('webView on dom-ready', e);

      this.render.setAddStation(this.newStation).then((buttons:Array<any>) => {
        this.logger.log('render on onButtonCandidatesFetched', buttons);
        this.playButton = buttons.find(button => button.isPlayButton);
        this.pauseButton = buttons.find(button => button.isPauseButton) || this.playButton;
      });

      this.newStation.openDevTools();
    });

  }

  loadUrl = (url:string) => {
    this.logger.log('loadUrl', url);
    this.newStation.src = url;
  };

  addStation = (newUrl:string, newName:string, newPlay:string, newPause:string) => {
    this.logger.log('addStation', newUrl, newName, newPlay, newPause);

    let _play = new ButtonPath(newPlay, 'selector');
    let _pause = new ButtonPath(newPause, 'selector');
    let _buttons = new StationButtons(_play, _pause);

    this.render.addStation(new Station(newName, newUrl, _buttons)).then((stations:Station[]) => {
      this.logger.log('addStation > added', stations);
      this.added = true;
    })
  };
}

import {ViewChild, Component, ElementRef} from '@angular/core';
import {PPWindowImpl} from "../../domain/window";
import {WebView, WebViewEvent} from "../../domain/webView";
import {Render} from "../../domain/render";
import {Station, ButtonPath, StationButtons} from "../domain/stations";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
  template: `
    <div class="container-fluid">
      <h1>Add Station</h1>
      <a class="btn btn-block btn-primary" [routerLink]="['/']">Back</a>
      
      <hr>
      <div class="input-group">
        <input type="text" class="form-control" placeholder="URL" [(ngModel)]="url">
      </div>    
      <button class="btn btn-block btn-primary" (click)="loadUrl(url)">Load</button>
      
      <hr>
      
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
  private LOG = 'color: red; font-weight: bold;';
  newStation:WebView;
  url:string;

  constructor() {
    console.log('%c app > AddStationComponent', this.LOG);
  }

  @ViewChild('newStation') input:ElementRef;
  ngAfterViewInit() {
    console.log('%c app > AddStationComponent.ngAfterViewInit', this.LOG, this.input);
    this.newStation = this.input.nativeElement;
  }

  loadUrl = (url:string) => {
    console.log('%c app > AddStationComponent.loadUrl', this.LOG, url);
    this.newStation.src = url;
  }
}

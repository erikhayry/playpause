import {ViewChild, Component, ElementRef} from '@angular/core';
import {PPWindowImpl} from "../domain/window";
import {WebView, WebViewEvent} from "../domain/webView";
import {Render} from "../domain/render";
import {Station, ButtonPath, StationButtons} from "./stations";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
  template: `
    <div class="container-fluid">
      <h1>Add Station</h1>
      <a class="btn btn-block btn-primary" [routerLink]="['/']">Back</a>
     </div>   
  `,
  directives: [ROUTER_DIRECTIVES],
})

export class AddStationComponent{
  private LOG = 'color: red; font-weight: bold;';
  private guest:WebView;
  private render:Render;
  stations:Array<Station>;
  currentStation:Station;
  guestTitle:string;

  adding = false;
  newUrlLoaded = false;
  newUrl:string;
  newName:string;
  newPlay:string;
  newPause:string;

  constructor() {
    console.log('%c app > WebviewComponent', this.LOG);
    this.render = (<PPWindowImpl>window).render;
  }
}

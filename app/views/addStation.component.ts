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
      
      <div class="input-group">
        <input type="text" class="form-control" placeholder="URL" [(ngModel)]="newUrl">
      </div>    
      <button class="btn btn-block btn-primary" (click)="loadUrl(newUrl)">Load</button>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES],
})

export class AddStationComponent{
  private LOG = 'color: red; font-weight: bold;';
  newUrl:string;

  constructor() {
    console.log('%c app > AddStationComponent', this.LOG);
  }
}

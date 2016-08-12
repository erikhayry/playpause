import {ViewChild, Component, ElementRef} from '@angular/core';
import {Station, StationButtonPath, StationButtons} from "../../domain/station";
import {ROUTER_DIRECTIVES} from "@angular/router";
import WebViewElement = Electron.WebViewElement;
import WebViewElementEvent = Electron.WebViewElement.Event;
import {Render} from "render";
import {PPWindow} from "app/domain/window";

@Component({
  template: `
    <div class="container-fluid">
      <div *ngFor="let url of urls">
       <webview    
            #guest
            [id]="url"
            style="display:inline-flex; width:80%; height:200px"
            autosize="on"
            plugins
            allowpopups
            disablewebsecurity
      ></webview>
       <hr>
      </div>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES],
})

export class TesterComponent {
   urls = ['http://sverigesradio.se', 'http://ot.fi'];
  render:Render;

  constructor() {
    this.render = (<PPWindow>window).render;
  }

  @ViewChild('guest') input:ElementRef;
  ngAfterViewInit() {

    this.urls.forEach(url => {
      let webview = (<WebViewElement>document.getElementById(url));
      webview.src = url;
      webview.addEventListener('dom-ready', (e:WebViewElementEvent) => this.domReady(webview));
    })
  }

  domReady(webview:WebViewElement){
    let testerGuest = this.render.buildTesterStation(webview);

    webview.executeJavaScript('document.body.style.opacity = 0.5');
    webview.openDevTools();
    console.log(webview)
  }
}

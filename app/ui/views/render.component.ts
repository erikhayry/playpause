import {PPWindow} from "../../domain/window";
import {Render} from "../../../render";
import {ViewChild, ElementRef} from '@angular/core';
import WebViewElement = Electron.WebViewElement;
import WebViewElementEvent = Electron.WebViewElement.Event;
import {Logger} from "../../domain/logger";

export abstract class RenderComponent{
  logger:Logger;
  render:Render;
  guest:WebViewElement;

  constructor(name:string) {
    this.logger = new Logger(name, 'red');
    this.render = (<PPWindow>window).render;
  }

  @ViewChild('guest') input:ElementRef;
  ngAfterViewInit() {
    this.logger.log('ngAfterViewInit', this.input);
    this.guest = this.input.nativeElement;
    this.guest.addEventListener('dom-ready', (e:WebViewElementEvent) => this.domReady());
    this.afterInit()
  }

  abstract afterInit():void
  abstract domReady():void
}


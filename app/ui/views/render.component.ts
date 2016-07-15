import {PPWindow} from "../../domain/window";
import {Render} from "../../../render";
import {ViewChild, ElementRef} from '@angular/core';
import WebViewElement = Electron.WebViewElement;
import WebViewElementEvent = Electron.WebViewElement.Event;
import {Logger} from "../../domain/logger";
import {SubscriberToken} from "../../render/subscriber";

export abstract class RenderComponent{
  logger:Logger;
  render:Render;
  guest:WebViewElement;
  events:SubscriberToken[];

  constructor(name:string) {
    this.logger = new Logger(name, 'red');
    this.render = (<PPWindow>window).render;
    this.events = [];
  }

  @ViewChild('guest') input:ElementRef;
  ngAfterViewInit() {
    this.logger.log('ngAfterViewInit', this.input);
    this.guest = this.input.nativeElement;
    this.guest.addEventListener('dom-ready', (e:WebViewElementEvent) => this.domReady());
    this.afterInit()
  }

  ngOnDestroy(){
    this.logger.log('ngOnDestroy');
    this.unsubscribe()
  }

  abstract afterInit():void
  abstract domReady():void

  //TODO figure out better way to handle old events
  unsubscribe(){
    this.events.forEach((e:SubscriberToken) => {
      this.render.unsubscribe(e)
    });
    this.events = [];
  }}


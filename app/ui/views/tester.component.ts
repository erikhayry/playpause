import {ViewChild, Component, ElementRef} from '@angular/core';
import {Station, StationButtonPath, StationButtons} from "../../domain/station";
import {ROUTER_DIRECTIVES} from "@angular/router";
import WebViewElement = Electron.WebViewElement;
import WebViewElementEvent = Electron.WebViewElement.Event;
import {Render} from "../../../render";
import {PPWindow} from "../../domain/window";

@Component({
  template: `
    <div class="container-fluid">
      <div *ngFor="let station of stations" class="row">
       <webview    
            #guest
            class="col-sm-6"
            [id]="station.id"
            style="display:inline-flex; height:400px;"
            autosize="on"
            plugins
            allowpopups
            disablewebsecurity
      ></webview>
      <div class="col-sm-6" style="overflow: scroll; height: 400px">
        <div *ngIf="result[station.id]">
            <h4>{{station.id}}</h4>
            
            <div *ngIf="result[station.id].playButtonsCandidates && result[station.id].playButtonsCandidates.length > 0">
              <h3>Play Button ({{result[station.id].playButtonsCandidates[0].playButtonScore}})</h3>
              <table class="table table-striped">
              <tr>
              <th>type</th>
              <th>expected</th>
              <th>result</th>
              </tr>
              <tr *ngIf="result[station.id].playButtonsCandidates[0].className" 
                [ngClass]="result[station.id].playButtonsCandidates[0].className == station.buttons.play.className ? 'text-success' : 'text-danger'">
              <td>className</td>
              <td>{{station.buttons.play.className}}</td>
              <td>{{result[station.id].playButtonsCandidates[0].className}}</td>
              </tr>
              <tr *ngIf="result[station.id].playButtonsCandidates[0].id" [ngClass]="result[station.id].playButtonsCandidates[0].id == station.buttons.play.id ? 'text-success' : 'text-danger'">
              <td>id</td>
              <td>{{station.buttons.play.id}}</td>
              <td>{{result[station.id].playButtonsCandidates[0].id}}</td>
              </tr>
              <tr *ngIf="result[station.id].playButtonsCandidates[0].xpath" [ngClass]="result[station.id].playButtonsCandidates[0].xpath == station.buttons.play.xpath ? 'text-success' : 'text-danger'">
              <td>xpath</td>
              <td>{{station.buttons.play.xpath}}</td>
              <td>{{result[station.id].playButtonsCandidates[0].xpath}}</td>
              </tr>
              </table>
            </div>

        </div>
       </div>
       <hr>
      </div>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES],
})

export class TesterComponent {
  stations = [
    {
      id: 'bbc',
      url: 'https://www.bbc.co.uk/radio/player/bbc_6music',
      buttons: {
        play: {
          xpath: '//*[@id="btn-play"]',
          id: 'btn-play'
        },
        pause: {
          xpath: '//*[@id="btn-stop"]',
          id: 'btn-stop'
        }
      }
    },
    {
      id: 'google',
      url: 'https://play.google.com/music/listen?authuser#/now',
      buttons: {
        play: {
          xpath: '//*[@id="player-bar-play-pause"]',
          id: 'player-bar-play-pause'
        },
        pause: {
          xpath: '//*[@id="player-bar-play-pause"]',
          id: 'player-bar-play-pause'
        }
      }
    },
    {
      id: 'lastfm',
      url: 'http://www.last.fm/home',
      buttons: {
        play: {
          xpath: '/html/body/div[2]/div/section/div[1]/ul/li[2]/button',
          className: 'js-play-pause player-bar-btn player-bar-btn--play'
        },
        pause: {
          xpath: '/html/body/div[2]/div/section/div[1]/ul/li[2]/button',
          className: 'js-play-pause player-bar-btn player-bar-btn--pause'
        }
      }
    },
    {
      id: 'sr',
      url: 'http://sverigesradio.se',
      buttons: {
        play: {
          xpath: '/html/body/div[7]/div/div[1]/div/div[1]/button',
          className: 'player-play player-play--small'
        },
        pause: {
          xpath: '//*[@id="player-container"]/div/div[1]/div/div[1]/button',
          className: 'player-play th-p3-bg-color player-play--is-playing player-play--small'
        }
      }
    },
    {
      id:'soundcloud',
      url: 'https://soundcloud.com/jonwayne',
      hidden: true,
      buttons: {
        play: {
          xpath: '/html/body/div[1]/div[4]/div/div/ul/li[1]/button[2]',
          className: 'playControl playControls__icon sc-ir'
        },
        pause: {
          xpath: '//*[@id="app"]/div[4]/div/div/ul/li[1]/button[2]',
          className: 'playControl playControls__icon sc-ir playing'
        }
      }
    },
    {
      id: 'spotify',
      url: 'https://play.spotify.com/browse',
      iframe: true,
      buttons: {
        play: {
          xpath: '//*[@id="app-player"]//*[@id="play-pause"]', //TODO iframe path  + button path
          id: 'play-pause'
        },
        pause: {
          xpath: '//*[@id="app-player"]//*[@id="play-pause"]',
          id: 'play-pause'
        }
      }
    },
    {
      id: 'ot',
      url: 'http://ot.fi',
      buttons: {
        play: {},
        pause: {}
      }
    },

      //'http://www.radio.org.se/',
      //'http://www.playradio.se/',
      //'http://www.internet-radio.com/station/dougeasyhits/',
      //'http://www.radioguide.fm/internet-radio-sverige/sr-p3',
      //'http://www.radiotunes.com/the80s',
    ];
    render:Render;
    result = {};

  constructor() {
    this.render = (<PPWindow>window).render;
  }

  @ViewChild('guest') input:ElementRef;
  ngAfterViewInit() {
    this.stations.forEach(station => {
      let webview = (<WebViewElement>document.getElementById(station.id));
      webview.src = station.url;
      webview.addEventListener('dom-ready', (e:WebViewElementEvent) => this.domReady(station.id, webview));
    })
  }

  domReady(id:string, webview:WebViewElement){
    console.log('domReady', id);
    webview.openDevTools();
    var stationCandidate = this.render.buildStationCandidate(webview);
    stationCandidate.getTestableButtonCandidates(id, webview).then((res:any) => {
      console.log(res.id);
      console.log(res.buttons);
      this.result[res.id] = {
        playButtonsCandidates: res.buttons.playButtonsCandidates
      };
      console.log(this.result[res.id])
    });
  }
}

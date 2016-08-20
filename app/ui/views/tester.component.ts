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
              <tr *ngIf="station.buttons.play.xpath" 
                [ngClass]="result[station.id].playButtonsCandidates[0].xpath == 
                (station.buttons.play.parentXpath ? station.buttons.play.parentXpath + '+' : '') + station.buttons.play.xpath ? 'text-success' : 'text-danger'">
              <td>xpath</td>
              <td>{{station.buttons.play.xpath}}</td>
              
              <td *ngIf="result[station.id].playButtonsCandidates[0].parentXpath"
              [ngClass]="station.buttons.play.xpath == result[station.id].playButtonsCandidates[0].parentXpath + '+' + result[station.id].playButtonsCandidates[0].xpath ? 'text-success' : 'text-danger'">
                {{result[station.id].playButtonsCandidates[0].parentXpath}}+{{result[station.id].playButtonsCandidates[0].xpath}}
              </td>
              <td *ngIf="!result[station.id].playButtonsCandidates[0].parentXpath"
              [ngClass]="result[station.id].playButtonsCandidates[0].xpath == station.buttons.play.xpath ? 'text-success' : 'text-danger'">
                {{result[station.id].playButtonsCandidates[0].xpath}}
              </td>
              </tr>
              </table>
            </div>
            <div *ngIf="result[station.id].pauseButtonsCandidates && result[station.id].pauseButtonsCandidates.length > 0">
              <h3>Pause Button ({{result[station.id].pauseButtonsCandidates[0].pauseButtonScore}})</h3>
              <table class="table table-striped">
              <tr>
              <th>type</th>
              <th>expected</th>
              <th>result</th>
              </tr>
              <tr *ngIf="result[station.id].pauseButtonsCandidates[0].className" 
                [ngClass]="result[station.id].pauseButtonsCandidates[0].className == station.buttons.pause.className ? 'text-success' : 'text-danger'">
              <td>className</td>
              <td>{{station.buttons.pause.className}}</td>
              <td>{{result[station.id].pauseButtonsCandidates[0].className}}</td>
              </tr>
              <tr *ngIf="result[station.id].pauseButtonsCandidates[0].id" [ngClass]="result[station.id].pauseButtonsCandidates[0].id == station.buttons.pause.id ? 'text-success' : 'text-danger'">
              <td>id</td>
              <td>{{station.buttons.pause.id}}</td>
              <td>{{result[station.id].pauseButtonsCandidates[0].id}}</td>
              </tr>
              <tr *ngIf="station.buttons.pause.xpath" 
                [ngClass]="result[station.id].pauseButtonsCandidates[0].xpath == 
                (station.buttons.pause.parentXpath ? station.buttons.pause.parentXpath + '+' : '') + station.buttons.pause.xpath ? 'text-success' : 'text-danger'">
              <td>xpath</td>
              <td>{{station.buttons.pause.xpath}}</td>
              
              <td *ngIf="result[station.id].pauseButtonsCandidates[0].parentXpath"
              [ngClass]="station.buttons.pause.xpath == result[station.id].pauseButtonsCandidates[0].parentXpath + '+' + result[station.id].pauseButtonsCandidates[0].xpath ? 'text-success' : 'text-danger'">
                {{result[station.id].pauseButtonsCandidates[0].parentXpath}}+{{result[station.id].pauseButtonsCandidates[0].xpath}}
              </td>
              <td *ngIf="!result[station.id].pauseButtonsCandidates[0].parentXpath"
              [ngClass]="result[station.id].pauseButtonsCandidates[0].xpath == station.buttons.pause.xpath ? 'text-success' : 'text-danger'">
                {{result[station.id].pauseButtonsCandidates[0].xpath}}
              </td>
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
          xpath: '//*[@id="btn-pause"]',
          id: 'btn-pause'
        }
      }
    },
    {
      id: 'lastfm',
      url: 'http://www.last.fm/home',
      buttons: {
        play: {
          xpath: '/html/body/div[3]/section/div[1]/div[2]/ul/li[2]/button',
          className: ' js-play-pause player-bar-btn player-bar-btn--play '
        },
        pause: {
          xpath: '/html/body/div[3]/section/div[1]/div[2]/ul/li[2]/button',
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
          xpath: '/html/body/div[7]/div/div[1]/div/div[1]/button/span',
          className: 'player-play__stop player-play--active' //TODO get parent if button
        }
      }
    },
    {
      id: 'google',
      url: 'https://play.google.com/music/listen?authuser#/now',
      buttons: {
        play: {
          xpath: '//*[@id="player-bar-play-pause"]',
          id: 'player-bar-play-pause',
          className: 'x-scope paper-icon-button-0'
        },
        pause: {
          xpath: '//*[@id="player-bar-play-pause"]',
          id: 'player-bar-play-pause',
          className: 'x-scope paper-icon-button-0'
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
          className: 'btn btn-play btn-icon',
          xpath: '//*[@id="app-player"]+//*[@id="play-pause"]',
          id: 'play-pause'
        },
        pause: {
          xpath: '//*[@id="app-player"]//*[@id="play-pause"]',
          id: 'play-pause'
        }
      }
    },
    {
      id: 'tunein',
      url: 'http://tunein.com/radio/Bandit-Rock-1065-s15426',
      buttons: {
        play: {
          className: 'playbutton-cont col',
          xpath: '/html/body/div[3]/div/div/div[1]',
        },
        pause: {
          className: 'playbutton-cont col',
          xpath: '/html/body/div[3]/div/div/div[1]'
        }
      }
    }

      //http://tunein.com/radio/Bandit-Rock-1065-s15426/
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
        playButtonsCandidates: res.buttons.playButtonsCandidates.length > 0 ? res.buttons.playButtonsCandidates : res.buttons.pauseButtonsCandidates,
        pauseButtonsCandidates: res.buttons.pauseButtonsCandidates.length > 0 ? res.buttons.pauseButtonsCandidates : res.buttons.playButtonsCandidates
      };
    });
  }
}

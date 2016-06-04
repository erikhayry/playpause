import { ViewChild, ViewChildren, Component, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'wv',
  template: `
    <webview 
             #wv
             id="wv"
             src="https://soundcloud.com/jonwayne"
             src="https://www.bbc.co.uk/radio/player/bbc_6music"
             src="https://play.spotify.com/browse"
             style="display:inline-flex; width:640px; height:480px"
             autosize="on"
             minwidth="576" minheight="432"
             plugins
             allowpopups
             disablewebsecurity
    ></webview>
  `
})

export class WebviewComponent{
  @ViewChild('wv') input:ElementRef;

    ngAfterViewInit() {
      console.log(this.input.nativeElement);
      let _webview = this.input.nativeElement;
      window.webview = _webview;
      
      let _loadstart = function() {
        console.log('loading...');
      };

      let _loadstop = function() {
      };

      _webview.addEventListener('did-start-loading', _loadstart);
      _webview.addEventListener('did-stop-loading', _loadstop);

      _webview.addEventListener('dom-ready', function(){
        _webview.openDevTools();
      });

      _webview.addEventListener('console-message', function(e){
        console.log(e)
      });

      _webview.addEventListener('media-started-playing', function(e){
        console.log(e)
      });

      _webview.addEventListener('media-paused', function(e){
        console.log(e)
      });
    }
}

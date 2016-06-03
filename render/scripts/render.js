"use strict";

let _webview = document.getElementById('wv');
let _indicator = document.querySelector('.indicator');

let _onload = () => {
    _webview = document.getElementById('wv');
    _indicator = document.querySelector('.indicator');

    let _loadstart = function() {
        _indicator.innerText = 'loading...';
    };

    let _loadstop = function() {
        _indicator.innerText = '';
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
};

_onload();

//Events
require('electron').ipcRenderer.on('playpause', (event, message) => {
    console.log(message);
    //TODO inject node_modules/electron-safe-ipc/guest-bundle.js
    _webview.executeJavaScript('electronSafeIpc.send("fromRenderer", document.querySelectorAll("*"), "a2");')
    //webview.executeJavaScript("console.log(document.querySelectorAll('button.playControl')[0].className); document.querySelectorAll('button.playControl')[0].click()")
});

require("electron-safe-ipc/host-webview").on("fromRenderer", function (a, b) {
    console.log("fromRenderer received", a, b);
});

"use strict";
var render = (function () {
  var electron = require('electron');
  var safeIPC = require("electron-safe-ipc/host-webview");
  var fs = require('fs');

  console.log('RENDER init')
  var _wv:any;
  var topics = {};
  var hOP = topics.hasOwnProperty;

  //Events
  var _guestBundleInjected = false;

  var _publish =  function(topic, info) {
    console.log(topics, topic, info )
    // If the topic doesn't exist, or there's no listeners in queue, just leave
    if(!hOP.call(topics, topic)) return;

    // Cycle through topics queue, fire!
    topics[topic].forEach(function(item) {
      item(info != undefined ? info : {});
    });
  };

  electron.ipcRenderer.on('playpause', (event, message) => {
    console.log(message);
    //if(!_guestBundleInjected){

      var content = fs.readFileSync('./node_modules/electron-safe-ipc/guest-bundle.js').toString();
      _wv.executeJavaScript(content)
      _guestBundleInjected = true;
    //}

    _wv.executeJavaScript('electronSafeIpc.send("fromRenderer", document.querySelectorAll("*"), "a2");')

    //webview.executeJavaScript("console.log(document.querySelectorAll('button.playControl')[0].className); document.querySelectorAll('button.playControl')[0].click()")

    _publish('playpause', {
      url: '/some/url/path'
    });
  });

  safeIPC.on("fromRenderer", function (a, b) {
    console.log("fromRenderer received", a, b);
  });

  return {
    setWv: (wv) => {
      _wv = wv;
    },
    on: function(topic, listener) {
      // Create the topic's object if not yet created
      if(!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) -1;

      // Provide handle back for removal of topic
      return {
        remove: function() {
          delete topics[topic][index];
        }
      };
    }
  }
}());

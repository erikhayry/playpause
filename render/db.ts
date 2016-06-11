import {Station} from "../domain/station";

const PouchDB = require('pouchdb');
const Q = require('Q');
const db = new PouchDB('pp_db');
//db.destroy()
function _add(station:Station) {
  let station = {
    _id: new Date().toISOString(),
    station: station,
  };

  db.put(station, function callback(err, result) {
    if (!err) {
      console.log('Successfully posted a todo!');
    }
  });
}

function _get() {
  var deferred = Q.defer();

  db.allDocs({include_docs: true, descending: true}, function(err, doc) {
    console.log(doc)
    deferred.resolve(doc.rows.map(row => row.doc.station));
  });

  return deferred.promise;
}
/*
_add({
  name: 'Soundcloud',
  url: 'https://soundcloud.com/jonwayne',
  buttons: {
    play: {
      type: 'selector',
      value: 'button.playControl'
    },
    pause: {
      type: 'selector',
      value: 'button.playControl'
    }
  }
});*/

/*_add({
  name: 'BBC 6',
  url: 'https://www.bbc.co.uk/radio/player/bbc_6music',
  buttons: {
    play:
    {
      type: 'selector',
      value: '#btn-play'
    },
    pause:
    {
      type: 'selector',
      value: '#btn-stop'
    }

  }
});*/
/*

_add({
  name: 'Spotify',
  url: 'https://play.spotify.com/browse',
  buttons: {
    play: {
      type: 'iframe',
      value: 'app-player,#play-pause'
    },
    pause: {
      type: 'iframe',
      value: 'app-player,#play-pause'
    }
  }
});
*/




module.exports = {
  get: _get,
  add: _add
};

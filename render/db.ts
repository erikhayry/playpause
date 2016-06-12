import {Station} from "../domain/station";

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));

const Q = require('Q');
const db = new PouchDB('pp_db');
const LOG = 'color: pink; font-weight: bold;';

//TODO handle edit
//TODO handle add already exisiting
//TODO handle errors


//db.destroy()
function _add(station:Station) {
  let deferred = Q.defer();
  console.log('%c DB.add', LOG, station.url, station);

  db.putIfNotExists(station.url, {station: station}).then((res) => {
    console.log('%c DB.add success', LOG, res);
    deferred.resolve(_getAll())
  }).catch((err) => {
    console.log('%c DB.add error', LOG, err);
  });

  return deferred.promise;
}

function _remove(stationUrl:string) {
  let deferred = Q.defer();
  console.log('%c DB.remove', LOG, stationUrl);

  db.get(stationUrl).then((doc) => {
    db.remove(doc._id, doc._rev);
    deferred.resolve(_getAll())
  });

  return deferred.promise;
}

function _get(stationUrl:string) {
  let deferred = Q.defer();
  console.log('%c DB.remove', LOG, stationUrl);

  db.get(stationUrl).then((doc) => {
    deferred.resolve(doc.rows.map(row => row.doc.station))
  });

  return deferred.promise;
}

function _getAll() {
  let deferred = Q.defer();
  console.log('%c DB.get', LOG);

  db.allDocs({include_docs: true, descending: true}, (err, doc) => {
    console.log('%c DB.get success', LOG, doc);

    deferred.resolve(doc.rows.map(row => row.doc.station));
  });

  return deferred.promise;
}

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
});

_add({
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
});

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

module.exports = {
  get: _get,
  getAll: _getAll,
  add: _add,
  remove: _remove
};

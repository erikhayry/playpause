import {Station} from "../domain/station";

const remote = require('electron').remote
const app = remote.app;

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));

const db = new PouchDB(app.getPath('userData') + '/pp_db');
const LOG = 'color: pink; font-weight: bold;';

//TODO handle edit
//TODO handle add already exisiting
//TODO handle errors


//db.destroy()
function _add(station:Station) {
  console.log('%c DB.add', LOG, station.url, station);

  return new Promise<any>((resolve, reject) => {
    db.putIfNotExists(station.url, {station: station}).then((res) => {
      console.log('%c DB.add success', LOG, res);
      resolve(_getAll())
    }).catch((err) => {
      console.log('%c DB.add error', LOG, err);
    });
  })
}

function _remove(stationUrl:string) {
  console.log('%c DB.remove', LOG, stationUrl);

  return new Promise<any>((resolve, reject) => {
      db.get(stationUrl).then((doc) => {
        db.remove(doc._id, doc._rev);
        resolve(_getAll())
      });
  })
}

function _get(stationUrl:string) {
  console.log('%c DB.remove', LOG, stationUrl);

  return new Promise<any>((resolve, reject) => {
    db.get(stationUrl).then((doc) => {
      resolve(doc.rows.map(row => row.doc.station))
    });
  })
}

function _getAll() {
  console.log('%c DB.get', LOG);

  return new Promise<any>((resolve, reject) => {
    db.allDocs({include_docs: true, descending: true}, (err, doc) => {
      console.log('%c DB.get success', LOG, doc);
      resolve(doc.rows.map(row => row.doc.station));
    });
  })}

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

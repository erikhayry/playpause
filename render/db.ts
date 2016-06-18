import {Station} from "../domain/station";

const remote = require('electron').remote
const app = remote.app;

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));

const db = new PouchDB(app.getPath('userData') + '/pp_db');
const LOG = 'color: pink; font-weight: bold;';

interface DbRes{
  updated:boolean,
  rev:string
};

interface DbDoc{
  _id: string
  _rev: string
  offset: number
  rows: Array<DbRow>
  total_rows: number
};

interface DbRow{
  doc: {
    _id: string
    _rev: string
    station: Station
  }
  id: string
  key: string
  value: {
    rev: string
  }
}

interface DbError {
  status: number;
  error: string;
  reason: string;
}

//TODO handle edit
//TODO handle add already exisiting
//TODO handle errors


//db.destroy()
function _add(station:Station) {
  console.log('%c DB.add', LOG, station.url, station);

  return new Promise<any>((resolve, reject) => {
    db.putIfNotExists(station.url, {station: station}).then((res:DbRes) => {
      console.log('%c DB.add success', LOG, res);
      resolve(_getAll())
    }).catch((err:DbError) => {
      console.log('%c DB.add error', LOG, err);
    });
  })
}

function _remove(stationUrl:string) {
  console.log('%c DB.remove', LOG, stationUrl);

  return new Promise<any>((resolve, reject) => {
      db.get(stationUrl).then((doc:DbDoc) => {
        db.remove(doc._id, doc._rev);
        resolve(_getAll())
      });
  })
}

function _get(stationUrl:string) {
  console.log('%c DB.get', LOG, stationUrl);

  return new Promise<any>((resolve, reject) => {
    db.get(stationUrl).then((doc:DbDoc) => {
      resolve(doc.rows.map(row => row.doc.station))
    });
  })
}

function _getAll() {
  console.log('%c DB.get', LOG);

  return new Promise<any>((resolve, reject) => {
    db.allDocs({include_docs: true, descending: true}, (err:string, doc:DbDoc) => {
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

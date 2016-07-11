import {Station} from "../ui/domain/stations";
import {Logger} from "../domain_/Logger";
import {PouchUpdateResponse} from "~pouchdb/index";
import {PouchError} from "~pouchdb/index";
import {PouchGetResponse} from "~pouchdb/index";
import {PouchAllDocsResponse} from "~pouchdb/index";

//TODO handle edit
//TODO handle add already exisiting
//TODO handle errors

export module DB{
  let logger = new Logger('DB', 'pink');
  const remote = require('electron').remote;
  const app = remote.app;
  const PouchDB = require('pouchdb');
  PouchDB.plugin(require('pouchdb-upsert'));
  const db = new PouchDB(app.getPath('userData') + '/pp_db');

  //db.destroy()
  add({
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
  add({
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
  add({
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

  export function add(station:Station) {
    logger.log('add', station.url, station);

    return new Promise<any>((resolve, reject) => {
      db.putIfNotExists(station.url, {station: station}).then((res:PouchUpdateResponse) => {
        logger.log('add success', res);
        resolve(getAll())
      }).catch((err:PouchError) => {
        logger.log('add error', err);
      });
    })
  }

  export function remove(stationUrl:string) {
    logger.log('remove', stationUrl);

    return new Promise<any>((resolve, reject) => {
      db.get(stationUrl).then((doc:PouchGetResponse) => {
        db.remove(doc._id, doc._rev);
        resolve(getAll())
      });
    })
  }

  export function get(stationUrl:string) {
    logger.log('get', stationUrl);

    return new Promise<any>((resolve, reject) => {
      db.get(stationUrl).then((doc:PouchAllDocsResponse) => {
        resolve(doc.rows.map(row => row.doc.station))
      });
    })
  }

  export function getAll() {
    logger.log('getAll');

    return new Promise<any>((resolve, reject) => {
      db.allDocs({include_docs: true, descending: true}, (err:string, doc:PouchAllDocsResponse) => {
        logger.log('get success', doc);
        resolve(doc.rows.map(row => row.doc.station));
      });
    })
  }
}

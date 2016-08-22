import {Station} from "../domain/station";
import {Logger} from "../domain/logger";

import {PouchUpdateResponse} from "~pouchdb/index";
import {PouchError} from "~pouchdb/index";
import {PouchGetResponse} from "~pouchdb/index";
import {PouchAllDocsResponse} from "~pouchdb/index";
import PouchDB from "~pouchdb/index";

//TODO handle edit
//TODO handle add already exisiting
//TODO handle errors

interface diffFunc { (doc:any):any }

interface PuouchDbUpsert extends PouchDB{
  upsert(docId:string, diffFunc:diffFunc):Promise<PouchUpdateResponse>
  putIfNotExists(docId:string|number, doc:any):Promise<PouchUpdateResponse>
}

export module DB{
  let logger = new Logger('DB', 'pink');
  const remote = require('electron').remote;
  const app = remote.app;
  const PouchDB = require('pouchdb');
  PouchDB.plugin(require('pouchdb-upsert'));
  const db = (<PuouchDbUpsert>new PouchDB(app.getPath('userData') + '/pp_db'));

  //db.destroy()
  add({
    name: 'Soundcloud',
    url: 'https://soundcloud.com/jonwayne',
    buttons: {
      play: {
        type: 'selector',
        value: '/html/body/div[1]/div[4]/div/div/ul/li[1]/button[2]'
      },
      pause: {
        type: 'selector',
        value: '/html/body/div[1]/div[4]/div/div/ul/li[1]/button[2]'
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
        value: '//*[@id="btn-play"]'
      },
      pause:
      {
        type: 'selector',
        value: '//*[@id="btn-pause"]'
      }

    }
  });
  add({
    name: 'Spotify',
    url: 'https://play.spotify.com/browse',
    buttons: {
      play: {
        type: 'iframe',
        value: '//*[@id="app-player"]+//*[@id="play-pause"]'
      },
      pause: {
        type: 'iframe',
        value: '//*[@id="app-player"]+//*[@id="play-pause"]'
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
      //TODO typings wrong, any for now
      db.get(stationUrl).then((doc:any) => {
        resolve(doc.rows.map((row: any) => row.doc.station))
      });
    })
  }

  export function getAll() {
    logger.log('getAll');
    return new Promise<any>((resolve, reject) => {
      db.allDocs({include_docs: true, descending: true}).then((doc:PouchAllDocsResponse) => {
        logger.log('get success', doc);
        resolve(doc.rows.map(row => row.doc.station));
      })
    })
  }
}

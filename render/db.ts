import {DbItem} from "../domain/dbItem";
let db:Array<DbItem> = [
  {
    name: 'BBC 6',
    url: 'https://www.bbc.co.uk/radio/player/bbc_6music',
    buttons: {
      play: "document.querySelectorAll('#btn-stop')[0].click()",
      pause: "document.querySelectorAll('#btn-stop')[0].click()"
    }
  },
  {
    name: 'Spotify',
    url: 'https://play.spotify.com/browse',
    buttons: {
      play: "window.frames['app-player'].contentDocument.querySelectorAll('#play-pause')[0].click()",
      pause: "window.frames['app-player'].contentDocument.querySelectorAll('#play-pause')[0].click()"
    }
  },
  {
    name: 'Soundcloud',
    url: 'https://soundcloud.com/jonwayne',
    buttons: {
      play: "document.querySelectorAll('button.playControl')[0].click()",
      pause: "document.querySelectorAll('button.playControl')[0].click()"
    }
  }
];

module.exports = db;

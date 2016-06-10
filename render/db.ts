import {Station} from "../domain/station";
let db:Array<Station> = [
  {
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
  },
  {
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
  },
  {
    name: 'Soundcloud',
    url: 'https://soundcloud.com/jonwayne',
    buttons: {
      play: {
          type: 'selector',
          value: 'button.playControl'
        }
      ,
      pause: {
          type: 'selector',
          value: 'button.playControl'
        }

    }
  }
];

module.exports = db;

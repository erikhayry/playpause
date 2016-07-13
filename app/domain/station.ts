export class StationButtons{
  play:StationButtonPath;
  pause:StationButtonPath;

  constructor(play:StationButtonPath, pause:StationButtonPath) {
    this.play = play;
    this.pause = pause;
  }
}

export class StationButtonPath{
  value:string;
  type:string;

  constructor(value:string, type:string) {
    this.value = value;
    this.type = type;
  }
}

export class Station {
  name:string;
  url:string;
  buttons:StationButtons;

  constructor(name:string, url:string, buttons:StationButtons) {
      this.name = name;
      this.url = url;
      this.buttons = buttons;
  }
}

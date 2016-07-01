export class StationButtons{
  play:ButtonPath;
  pause:ButtonPath;

  constructor(play:ButtonPath, pause:ButtonPath) {
    this.play = play;
    this.pause = pause;
  }
}

export class ButtonPath{
  value:string;
  type:string;

  constructor(value:string, type:string) {
    this.value = value;
    this.type = type;
  }
}

export class Station {
  name:String;
  url:String;
  buttons:StationButtons;

  constructor(name:String, url:String, buttons:StationButtons) {
      this.name = name;
      this.url = url;
      this.buttons = buttons;
  }
}

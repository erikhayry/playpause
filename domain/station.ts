export enum ButtonPathType{
  selector, iframe
}

export interface ButtonPath{
  value:string;
  type:string;
}

export interface StationButtons{
  play:ButtonPath;
  pause:ButtonPath;
}

export interface Station{
  name:String
  url:String
  buttons: StationButtons
}

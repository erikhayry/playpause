export interface StationButtons{
  play:String;
  pause:String;
}

export interface Station{
  name:String
  url:String
  buttons: StationButtons
}

export interface DbItemButtons{
  play:String;
  pause:String;
}

export interface DbItem{
  name:String
  url:String
  buttons: DbItemButtons
}

export interface Guest{
  getButtons():Array<any>
  getStatus():string;

  onPlayPause():void
}

export interface Subscriber {
  publish(topic:string, info:any):void
  on(topic:string, listener:any):any
}

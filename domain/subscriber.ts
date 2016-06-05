export interface Subscriber {
  publish(topic:String, info:any)
  on(topic:String, listener:any)
}

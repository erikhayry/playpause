import {Logger} from "../domain/logger";

export class Subscriber {
  private logger = new Logger('Subscriber', 'brown');
  private topics = {};
  private hasOwnProperty = this.topics.hasOwnProperty;

  constructor() {

  }

  on(topic:string, listener:any){
    this.logger.log('on', topic, typeof listener);

    if(!this.hasOwnProperty.call(this.topics, topic)) this.topics[topic] = [];
    let index = this.topics[topic].push(listener) -1;

    return {
        remove: function(topic:string) {
        this.logger.log('on.delete', topic);
        delete this.topics[topic][index];
      }
    };
  };

  publish(topic:string, info:any){
    this.logger.log('on', topic, info);

    if(!this.hasOwnProperty.call(this.topics, topic)) return;

    this.topics[topic].forEach(function(item:Function) {
      item(info != undefined ? info : {});
    });
  };
}

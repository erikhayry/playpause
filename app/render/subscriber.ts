import {Logger} from "../domain/logger";

export interface SubscriberToken{
  topic:string,
  index:number
}

export class Subscriber {
  private logger = new Logger('Subscriber', 'brown');
  private topics = {};
  private hasOwnProperty = this.topics.hasOwnProperty;

  on(topic:string, listener:any){
    this.logger.log('on', topic, typeof listener, this.topics);

    if(!this.hasOwnProperty.call(this.topics, topic)) {
      this.topics[topic] = [];
    }

    return {
      topic: topic,
      index: this.topics[topic].push(listener) - 1
    }
  };

  unsubscribe(token:SubscriberToken){
    this.logger.log('unsubscribe', token, this.topics);

    if(this.topics[token.topic] && this.topics[token.topic][token.index]){
      delete this.topics[token.topic][token.index];
    }
  }

  publish(topic:string, info:any){
    this.logger.log('publish', topic, info, this.topics);

    if(!this.hasOwnProperty.call(this.topics, topic)) return;

    this.topics[topic].forEach(function(item:Function) {
      item(info != undefined ? info : {});
    });
  };
}

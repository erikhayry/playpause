import {Subscriber as Sub} from "../domain/subscriber";

let Subscriber = ():Sub => {
  const LOG = 'color: brown; font-weight: bold;';

  console.log('%c render > subscriber', LOG);
  let _topics = {};
  let _hasOwnProperty = _topics.hasOwnProperty;

  return {
    on: (topic:string, listener:any) => {
      console.log('%c render > subscriber.on', LOG, topic, typeof listener);

      if(!_hasOwnProperty.call(_topics, topic)) _topics[topic] = [];
      let index = _topics[topic].push(listener) -1;

      return {
        remove: function(topic:string) {
          console.log('%c render > subscriber.on.delete', LOG, topic);
          console.log(_topics)
          delete _topics[topic][index];
        }
      };
    },

    publish: (topic:string, info:any) => {
      console.log('%c render > subscriber.on', LOG, topic, info);

      if(!_hasOwnProperty.call(_topics, topic)) return;

      _topics[topic].forEach(function(item:Function) {
        item(info != undefined ? info : {});
      });
    }
  }
};


module.exports = Subscriber;

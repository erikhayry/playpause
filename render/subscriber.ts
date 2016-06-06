import {Subscriber as Sub} from "../domain/subscriber";

let Subscriber = ():Sub => {
  console.log('render > subscriber');
  let _topics = {};
  let _hasOwnProperty = _topics.hasOwnProperty;

  return {
    on: (topic:String, listener:any) => {
      console.log('render > subscriber.on', topic, listener);

      if(!_hasOwnProperty.call(_topics, topic)) _topics[topic] = [];
      let index = _topics[topic].push(listener) -1;

      return {
        remove: function() {
          delete _topics[topic][index];
        }
      };
    },

    publish: (topic, info) => {
      console.log('render > subscriber.on', topic, info);

      if(!_hasOwnProperty.call(_topics, topic)) return;

      _topics[topic].forEach(function(item) {
        item(info != undefined ? info : {});
      });
    }
  }
};


module.exports = Subscriber;

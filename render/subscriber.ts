// My module
import {Subscriber as Sub} from "../domain/subscriber";

let Subscriber = ():Sub => {
  let _topics = {};
  let _hasOwnProperty = _topics.hasOwnProperty;

  return {
    on: (topic:String, listener:any) => {
      if(!_hasOwnProperty.call(_topics, topic)) _topics[topic] = [];
      let index = _topics[topic].push(listener) -1;

      return {
        remove: function() {
          delete _topics[topic][index];
        }
      };
    },

    publish:  (topic, info) => {
      if(!_hasOwnProperty.call(_topics, topic)) return;

      _topics[topic].forEach(function(item) {
        item(info != undefined ? info : {});
      });
    }
  }
}


module.exports = Subscriber;

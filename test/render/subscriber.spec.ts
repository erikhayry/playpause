let assert = require('chai').assert;
import {Subscriber} from '../../app/render/subscriber';

describe('Subscriber', () => {
  var _subscriber = new Subscriber(),
      _testRet = '',
      _testRet2 = '',
      _testRet3 = '';

  _subscriber.on('test', (val:any) => {
    _testRet = val
  });

  _subscriber.on('test', (val:any) => {
    _testRet2 = val
  });

  let token3 = _subscriber.on('test3', (val:any) => {
    _testRet3 = val
  });

  it('should publish event',  ()  => {
    _subscriber.publish('test', 'testVal');
    _subscriber.publish('test3', 'testVal3');

    assert.equal(_testRet, 'testVal');
    assert.equal(_testRet2, 'testVal');
    assert.equal(_testRet3, 'testVal3');
  });

  it('should unsubscribe event',  ()  => {
    _testRet = '';
    _testRet2 = '';
    _testRet3 = '';
    _subscriber.unsubscribe(token3);
    _subscriber.unsubscribe({topic: 'test3', index: 99});
    _subscriber.unsubscribe({topic: 'missingTopic', index: 99});

    _subscriber.publish('test', 'testVal');
    _subscriber.publish('test3', 'testVal3');

    assert.equal(_testRet, 'testVal');
    assert.equal(_testRet2, 'testVal');
    assert.equal(_testRet3, '');
  });

});

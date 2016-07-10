"use strict";
var assert = require('chai').assert;
var subscriber_1 = require('../../app/render/subscriber');
describe('Subscriber', function () {
    var _subscriber = new subscriber_1.Subscriber(), _testRet = '', _testRet2 = '', _testRet3 = '';
    _subscriber.on('test', function (val) {
        _testRet = val;
    });
    _subscriber.on('test', function (val) {
        _testRet2 = val;
    });
    _subscriber.on('test3', function (val) {
        _testRet3 = val;
    });
    _subscriber.publish('test', 'testVal');
    _subscriber.publish('test3', 'testVal3');
    it('should publish event', function () {
        assert.equal(_testRet, 'testVal');
        assert.equal(_testRet2, 'testVal');
        assert.equal(_testRet3, 'testVal3');
    });
});
//# sourceMappingURL=subscriber.spec.js.map
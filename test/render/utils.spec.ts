let assert = require('chai').assert;

import {StationButtonPath} from "../../app/domain/station";
import {Utils} from '../../app/render/utils';

describe('Utils', () => {
  describe('getGuestState', () => {
    let playButtonHidden = (<CSSStyleDeclaration>{display: 'none'});
    let playButtonVisible = (<CSSStyleDeclaration>{display: 'block'});
    let stopButtonHidden = (<CSSStyleDeclaration>{display: 'none'});
    let stopButtonVisible = (<CSSStyleDeclaration>{display: 'block'});

    it('should return state of player', ()=> {
      assert.equal(Utils.getGuestState(playButtonHidden, stopButtonHidden), 'playing');
      assert.equal(Utils.getGuestState(playButtonHidden, stopButtonVisible), 'playing');
      assert.equal(Utils.getGuestState(playButtonVisible, stopButtonHidden), 'paused');
      assert.equal(Utils.getGuestState(playButtonVisible, stopButtonVisible), 'paused');
    });
  });
});

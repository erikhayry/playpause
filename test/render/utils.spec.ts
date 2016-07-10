let assert = require('chai').assert;

import {ButtonPath} from "../../app/ui/domain/stations";
import {Utils} from '../../app/render/utils';

describe('Utils', () => {
  let buttonPathElement = new ButtonPath('.button', 'selector');
  let buttonPathiFrame = new ButtonPath('player,.button', 'iframe');

  describe('click', () => {
    it('should return click action for element', () => {
      assert.equal(Utils.click(buttonPathElement), 'document.querySelectorAll(".button")[0].click()');
    });

    it('should return click action for element', () => {
      assert.equal(Utils.click(buttonPathiFrame), 'window.frames["player"].contentDocument.querySelectorAll(".button")[0].click()');
    })
  });

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

  describe('getElement', () => {
    it('should return element query', () => {
      assert.equal(Utils.getElement(buttonPathElement), 'document.querySelectorAll(".button")[0]');
      assert.equal(Utils.getElement(buttonPathiFrame), 'window.frames["player"].contentDocument.querySelectorAll(".button")[0]');
    });
  });

  describe('getComputedStyle', () => {
    it('should return element style query', () => {
      assert.equal(Utils.getComputedStyle(buttonPathElement), 'window.getComputedStyle(document.querySelectorAll(".button")[0])');
      assert.equal(Utils.getComputedStyle(buttonPathiFrame), 'window.getComputedStyle(window.frames["player"].contentDocument.querySelectorAll(".button")[0])');
    });
  });
});

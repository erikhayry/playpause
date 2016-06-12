import {ElementStyle} from "../domain/elementStyle";
import {ButtonPath} from "../domain/station";

let Utils = (() => {
  const LOG = 'color: purple; font-weight: bold;';

  let _getElement = (path:ButtonPath) => {
    if(path.type === 'selector'){
      return 'document.querySelectorAll("' + path.value +'")[0]'
    }
    if(path.type === 'iframe'){
      let _paths = path.value.split(',');
      return 'window.frames["' + _paths[0] +'"].contentDocument.querySelectorAll("' + _paths[1] +'")[0]'
    }
  };

  return {
    click(buttonPath:ButtonPath):string{
      console.log('%c Utils.click', LOG, buttonPath);
      return _getElement(buttonPath) + '.click()'
    },

    getGuestState(playBtnEl:ElementStyle, pauseBtnEl:ElementStyle):string{
      console.log('%c Utils.getGuestState', LOG, playBtnEl.display, pauseBtnEl.display);

      if(playBtnEl.display === 'none'){
        return 'playing'
      }
      else{
        return'paused'
      }
    },

    getElement(path:ButtonPath){
      console.log('%c Utils.getElement', LOG, path);
      return _getElement(path)
    },

    getComputedStyle(path:ButtonPath){
      console.log('%c Utils.getComputedStyle', LOG, path);
      return 'window.getComputedStyle(' + _getElement(path) + ')'
    }
  }
})();

module.exports = Utils;

import {ButtonPath} from "../domain/station";
import {ElementStyle} from "../domain/elementStyle";

let Utils = (() => {

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
      console.log('Utils.click', buttonPath);
      return _getElement(buttonPath) + '.click()'
    },
    getGuestState(playBtnEl:ElementStyle, pauseBtnEl:ElementStyle):string{
      console.log('Utils.getGuestState', playBtnEl.display, pauseBtnEl.display);

      if(playBtnEl.display === 'none'){
        return 'playing'
      }
      else{
        return'paused'
      }
    },
    getElement(path:ButtonPath){
      console.log('Utils.getElement', path);
      return _getElement(path)
    },
    getComputedStyle(path:ButtonPath){
      console.log('Utils.getComputedStyle', path);
      return 'window.getComputedStyle(' + _getElement(path) + ')'
    }
  }
})();

module.exports = Utils;

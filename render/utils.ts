import {ButtonPath, Station} from "../domain/station";

let Utils = () => {



  let _getElement = (path:ButtonPath) => {
    if(path.type === 'selector'){
      return 'document.querySelectorAll("' + path.value +'")[0]'
    }
    if(path.type === 'iframe'){
      let _paths = path.value.split(',');
      return 'window.frames["' + _paths[0] +'"].contentDocument.querySelectorAll("' + _paths[1] +'")[0]'
    }
  };

  let _isPlaying = (playBtnEl:Element, pauseBtnEl:Element) => {
    return true;
  };

  return {
    click(station:Station):string{
      return _getElement(station.buttons.play) + '.click()'
    },
    tryGetGuestStateAndClick(playBtnEl:Element, pauseBtnEl:Element){
      //TODO classname not good enough
      if(_isPlaying(playBtnEl, pauseBtnEl)){
        return 'document.querySelectorAll("' + pauseBtnEl.className +'")[0].click()'
      }
      else{
        return 'document.querySelectorAll("' + playBtnEl.className +'")[0].click()'
      }
    },
    getElement: _getElement
  }
};

module.exports = Utils;

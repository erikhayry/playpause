import {StationButtonPath} from "../domain/station";
import {Logger} from "../domain/logger";

export module Utils{
  let logger = new Logger('Utils', 'orange');

  let getElementQuery = (path:StationButtonPath) => {
    if(path.type === 'selector'){
      return 'document.querySelectorAll("' + path.value +'")[0]'
    }
    if(path.type === 'iframe'){
      let _paths = path.value.split(',');
      return 'window.frames["' + _paths[0] +'"].contentDocument.querySelectorAll("' + _paths[1] +'")[0]'
    }
  };

  export function click(buttonPath:StationButtonPath):string{
    logger.log('click', buttonPath);
    return getElementQuery(buttonPath) + '.click()'
  }

  export function getGuestState(playBtnEl:CSSStyleDeclaration, pauseBtnEl:CSSStyleDeclaration):string{
    logger.log('getGuestState', playBtnEl.display, pauseBtnEl.display);

    if(playBtnEl.display === 'none'){
      return 'playing'
    }
    else{
      return'paused'
    }
  }

  export function getElement(path:StationButtonPath){
    logger.log('getElement', path);
    return getElementQuery(path)
  }

  export function getComputedStyle(path:StationButtonPath){
    logger.log('getComputedStyle', path);
    return 'window.getComputedStyle(' + getElementQuery(path) + ')'
  }
}

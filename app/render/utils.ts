import {ButtonPath} from "../ui/domain/stations";
import {Logger} from "../domain_/Logger";

export module Utils{
  let logger = new Logger('Utils', 'orange');

  let getElementQuery = (path:ButtonPath) => {
    if(path.type === 'selector'){
      return 'document.querySelectorAll("' + path.value +'")[0]'
    }
    if(path.type === 'iframe'){
      let _paths = path.value.split(',');
      return 'window.frames["' + _paths[0] +'"].contentDocument.querySelectorAll("' + _paths[1] +'")[0]'
    }
  };

  export function click(buttonPath:ButtonPath):string{
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

  export function getElement(path:ButtonPath){
    logger.log('getElement', path);
    return getElementQuery(path)
  }

  export function getComputedStyle(path:ButtonPath){
    logger.log('getComputedStyle', path);
    return 'window.getComputedStyle(' + getElementQuery(path) + ')'
  }
}

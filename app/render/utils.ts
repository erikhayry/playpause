import {StationButtonPath} from "../domain/station";
import {Logger} from "../domain/logger";

export module Utils{
  let logger = new Logger('Utils', 'orange');

  export function getGuestState(playBtnEl:CSSStyleDeclaration, pauseBtnEl:CSSStyleDeclaration):string{
    logger.log('getGuestState', playBtnEl.display, pauseBtnEl.display);

    if(playBtnEl.display === 'none'){
      return 'playing'
    }
    else{
      return'paused'
    }
  }
}

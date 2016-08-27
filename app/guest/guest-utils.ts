import {PPWindow} from "../domain/window";
import {StationButtonPath} from "../domain/station";
import {iRatedHTMLElement} from "../domain/iRatedHTMLElement";

class RatedHTMLElement implements iRatedHTMLElement{
  element:HTMLElement;
  className:string;
  id:string;
  title:string;
  playButtonScore = 0;
  pauseButtonScore = 0;
  isPlayButton = false;
  isPauseButton = false;
  isAudio = false;
  parentXpath:string;
  xpath:string;
  nodeName:string;
  numberOfTwins:number;

  constructor(element:HTMLElement, parentXpath:string) {
    this.element = element;
    this.parentXpath = parentXpath;
    this.className = (element.className.replace) ? element.className.replace(/\s\s+/g, ' ') : element.className;
    this.title = element.title;
    this.id = element.id;
    this.nodeName = element.nodeName;

    if(!this.isOtherMediaControl(this.element)){
      this.setButtonType(this.element);

      if(this.isAudio || this.isPlayButton || this.isPauseButton){
        this.checkAudioEl(this.element, 10000);
        this.checkSiblings(this.element, 1000);
        this.checkNodeName(this.element, 100);
        this.checkAttributes(this.element, 100);
      }
    }
  }

  private _PP_MEDIA_ATTRIBUTES = [
    'id', 'className', 'title'
  ];

  private isOtherMediaControl(element:HTMLElement):boolean{
    const IGNORED_VALUES = [
      'playlist', 'volume', 'open', 'radioplayer'
    ];

    return this._PP_MEDIA_ATTRIBUTES.some(attr => {
      if(element[attr] && element[attr].indexOf){
        const EL_ATTR = element[attr].toLowerCase();
        return IGNORED_VALUES.some(val => {
          return (EL_ATTR.indexOf(val) > -1)
        })
      }
    });
  }

  private setButtonType(element:HTMLElement):void{
    this.isAudio = element.nodeName == 'AUDIO';

    this.isPlayButton = this._PP_MEDIA_ATTRIBUTES.some(attr => {
      if(element.parentNode.nodeName == 'BUTTON' || element.getElementsByTagName('button').length != 0){
        return false
      }

      if(element[attr] && element[attr].match){
        const EL_ATTR = element[attr].toLowerCase();
        let playMatches = (EL_ATTR.match(/play/g) || []).length;
        return playMatches > 0 && playMatches != (EL_ATTR.match(/player/g) || []).length
       }
    });

    this.isPauseButton =  this._PP_MEDIA_ATTRIBUTES.some(attr => {
      if(element[attr] && element[attr].indexOf){
        const EL_ATTR = element[attr].toLowerCase();
        return (EL_ATTR.indexOf('stop') > -1 || EL_ATTR.indexOf('pause') > -1)
      }
    });
  }

  private checkSiblings(element:HTMLElement, score:number):void{
    const OTHER_MEDIA_VALUES = [
      'volume', 'next', 'previous', 'stop', 'pause', 'artwork', 'srcubber', 'info', 'skip', 'repeat',
      'rewind', 'forward', 'shuffle', 'queue', 'timeline', 'progress', 'cover', 'cover-art', 'track',
    ]; //TODO go one level up, set max value?

    let siblings = element.parentNode.childNodes;

    [].forEach.call(siblings, (sibling:HTMLElement) => {
      if(sibling != element && sibling.nodeName == element.nodeName){
        this._PP_MEDIA_ATTRIBUTES.forEach(attr => {
          if(sibling[attr]){
            const EL_ATTR = sibling[attr].toLowerCase();

            OTHER_MEDIA_VALUES.forEach(val => {
              let matchingScore = (EL_ATTR.match(new RegExp(val, 'g')) || []).length * score;
              this.playButtonScore += matchingScore;
              this.pauseButtonScore += matchingScore;
            })
          }
        });
      }
    });
  }

  private checkAttributes(element:HTMLElement, score:number):void{
    this._PP_MEDIA_ATTRIBUTES.forEach(attr => {
      if(element[attr]){
        const EL_ATTR = element[attr].toLowerCase();
        this.playButtonScore += (EL_ATTR.match(/play/g) || []).length * score;
        this.pauseButtonScore += (EL_ATTR.match(/pause/g) || []).length * score;
      }
    });
  }

  private checkAudioEl(element:HTMLElement, score:number){
    if(this.isAudio){
      console.log(element);
      this.playButtonScore += score;
      this.pauseButtonScore += score;
    }
  }

  private checkNodeName(element:HTMLElement, score:number){
    if (element.nodeName === 'BUTTON' || (element.nodeName && element.nodeName.indexOf('button') > -1)) {
      if(this.isPlayButton){
        this.playButtonScore += score
      }
      if(this.isPauseButton){
        this.pauseButtonScore += score
      }
    }
  }
}

(<PPWindow>window).PP_EP = (() => {
  const LOG = 'color: orange; font-weight: bold;';
  console.log('%c render on guest', LOG);

  function _getButtonCandidates(elements?:any, old?:Array<any>, parentXpath?:string): RatedHTMLElement[]{
    const IGNORED_NODE_TYPES = ['A'];
    const IGNORED_IFRAMES = ['js-player'];
    let _elements = elements || document.querySelectorAll('*');
    let _old = old || [];
    let _parentXpath = parentXpath || null;

    [].forEach.call(_elements, (el:any) => {
      if (el.nodeName === 'IFRAME' && !IGNORED_IFRAMES.some(val => el.className.indexOf(val) > 0)){
        try{
          if(el && el.contentDocument){
            _old = _getButtonCandidates(el.contentDocument.querySelectorAll('*'), _old, (<PPWindow>window).PP_XPATH.getElementXPath(el))
          }
        }
        catch(e){
          console.info(e)
        }
      }

      else if(IGNORED_NODE_TYPES.indexOf(el.nodeName) < 0){
        _old.push(new RatedHTMLElement(el, _parentXpath));
      }

    });

    return _old.filter((el) => el.isAudio || el.isPlayButton || el.isPauseButton)
      .sort((a,b) => (b.playButtonScore + b.pauseButtonScore) - (a.playButtonScore + a.pauseButtonScore));
  }

  function _getElementQuery(path:StationButtonPath):HTMLElement{
    console.log('_getElementQuery', path);
    if(path.type === 'selector'){
      console.log((<PPWindow>window).PP_XPATH.getElementsByXPath(document, path.value));
      return (<HTMLElement>(<PPWindow>window).PP_XPATH.getElementsByXPath(document, path.value)[0])
    }

    //TODO use parent value instead of split
    if(path.type === 'iframe'){
      let _paths = path.value.split('+');
      let _iFrameEl = (<PPWindow>window).PP_XPATH.getElementsByXPath(document, _paths[0])[0];
      return (<PPWindow>window).PP_XPATH.getElementsByXPath(_iFrameEl.contentDocument, _paths[1])[0];
    }
  }

  function _sortByUniqueness(buttonCandidates: RatedHTMLElement[]):RatedHTMLElement[]{
    buttonCandidates.forEach(candidate => {
      let identicalCandidates = buttonCandidates.filter(siblings => {
        return siblings.className == candidate.className
      });

      candidate.numberOfTwins = identicalCandidates.length;
    });

    return buttonCandidates.sort((a, b) => {
      if((b.playButtonScore + b.pauseButtonScore) == (a.playButtonScore + a.pauseButtonScore)){
        return a.numberOfTwins - b.numberOfTwins
      }
      return (b.playButtonScore + b.pauseButtonScore) - (a.playButtonScore + a.pauseButtonScore)
    });
  }

  return {
    getButtons: () => {
      console.log('%c render on guest.getButtons()', LOG);
      (<PPWindow>window).electronSafeIpc.send('buttonsFetched', [1,2,3]);
    },

    getButtonCandidates: () => {
      let buttonCandidates = _getButtonCandidates();

      let playButtonsCandidates = _sortByUniqueness(buttonCandidates.filter((button) => button.isPlayButton));
      if(playButtonsCandidates.length > 0){
        playButtonsCandidates[0].xpath = (<PPWindow>window).PP_XPATH.getElementXPath(playButtonsCandidates[0].element)
      }

      let pauseButtonsCandidates = _sortByUniqueness(buttonCandidates.filter((button) => button.isPauseButton));
      if(pauseButtonsCandidates.length > 0){
        pauseButtonsCandidates[0].xpath = (<PPWindow>window).PP_XPATH.getElementXPath(pauseButtonsCandidates[0].element)
      }

      let audioCandidates = _sortByUniqueness(buttonCandidates.filter((button) => button.isAudio));
      if(audioCandidates.length > 0){
        audioCandidates[0].xpath = (<PPWindow>window).PP_XPATH.getElementXPath(audioCandidates[0].element)
      }

      playButtonsCandidates.forEach(el => delete el['element']);
      pauseButtonsCandidates.forEach(el => delete el['element']);
      audioCandidates.forEach(el => delete el['element']);

      (<PPWindow>window).electronSafeIpc.send('buttonCandidatesFetched', {
        playButtonsCandidates: playButtonsCandidates,
        pauseButtonsCandidates: pauseButtonsCandidates,
        audioCandidates: audioCandidates,
      });
    },

    getTestableButtonCandidates: (id:string) => {
      let buttonCandidates = _getButtonCandidates();

      let playButtonsCandidates = _sortByUniqueness(buttonCandidates.filter((button) => button.isPlayButton));
      if(playButtonsCandidates.length > 0){
        playButtonsCandidates[0].xpath = (<PPWindow>window).PP_XPATH.getElementXPath(playButtonsCandidates[0].element)
      }

      let pauseButtonsCandidates = _sortByUniqueness(buttonCandidates.filter((button) => button.isPauseButton));
      if(pauseButtonsCandidates.length > 0){
        pauseButtonsCandidates[0].xpath = (<PPWindow>window).PP_XPATH.getElementXPath(pauseButtonsCandidates[0].element)
      }

      let audioCandidates = _sortByUniqueness(buttonCandidates.filter((button) => button.isAudio));
      if(audioCandidates.length > 0){
        audioCandidates[0].xpath = (<PPWindow>window).PP_XPATH.getElementXPath(audioCandidates[0].element)
      }

      playButtonsCandidates.forEach(el => delete el['element']);
      pauseButtonsCandidates.forEach(el => delete el['element']);
      audioCandidates.forEach(el => delete el['element']);

      (<PPWindow>window).electronSafeIpc.send('testableButtonCandidatesFetched'+id, {
        playButtonsCandidates: playButtonsCandidates,
        pauseButtonsCandidates: pauseButtonsCandidates,
        audioCandidates: audioCandidates,
      });
    },

    getPlayerState: (playBtnObj:StationButtonPath, pauseBtnObj:StationButtonPath) => {
      let _playButtonEl = _getElementQuery(playBtnObj);
      let _pauseButtonEl = _getElementQuery(playBtnObj);
      console.log('getPlayerState', _playButtonEl, _pauseButtonEl);

      (<PPWindow>window).electronSafeIpc.send("buttonStylesFetched", {
        playBtnStyle: _playButtonEl ? window.getComputedStyle(_playButtonEl) : null,
        pauseBtnStyle: _pauseButtonEl ? window.getComputedStyle(_pauseButtonEl) : null
      })
    },

    click: (buttonPath:StationButtonPath):void => {
      _getElementQuery(buttonPath).click()
    }
  }
})();

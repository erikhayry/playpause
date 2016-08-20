import {PPWindow} from "../domain/window";
import {StationButtonPath} from "../domain/station";
import {iRatedHTMLElement} from "../domain/iRatedHTMLElement";

class RatedHTMLElement implements iRatedHTMLElement{
  element:HTMLElement;
  path:string;
  className:string;
  id:string;
  title:string;
  playButtonScore = 0;
  pauseButtonScore = 0;
  isPlayButton = false;
  isPauseButton = false;
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

      if(this.isPlayButton || this.isPauseButton){
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

    this.isPauseButton = this._PP_MEDIA_ATTRIBUTES.some(attr => {
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
    ];

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

   function _getElementXPath(element:HTMLElement){
    console.log('_getElementXPath');
    if (element && element.id)
      return '//*[@id="' + element.id + '"]';
    else
      return _getElementTreeXPath(element);
  };

  function _getElementTreeXPath(element:HTMLElement){
    console.log('_getElementTreeXPath', element);
    let paths:string[] = [];

    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == Node.ELEMENT_NODE; element = (<HTMLElement>element.parentNode))
    {
      let index = 0;
      let hasFollowingSiblings = false;
      for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
      {
        // Ignore document type declaration.
        if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
          continue;

        if (sibling.nodeName == element.nodeName)
          ++index;
      }

      for (let sibling = element.nextSibling; sibling && !hasFollowingSiblings;
           sibling = sibling.nextSibling)
      {
        if (sibling.nodeName == element.nodeName)
          hasFollowingSiblings = true;
      }

      let tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
      let pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
      paths.splice(0, 0, tagName + pathIndex);
    }
    return paths.length ? "/" + paths.join("/") : null;
  }

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
            _old = _getButtonCandidates(el.contentDocument.querySelectorAll('*'), _old, _getElementXPath(el))
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

    return _old.filter((el) => el.isPlayButton || el.isPauseButton)
      .sort((a,b) => (b.playButtonScore + b.pauseButtonScore) - (a.playButtonScore + a.pauseButtonScore));
  }

  function _getElementQuery(path:StationButtonPath):HTMLElement{
    if(path.type === 'selector'){
      return (<HTMLElement>document.querySelectorAll(path.value)[0])
    }
    if(path.type === 'iframe'){
      let _paths = path.value.split(',');
      return window.frames[_paths[0]].contentDocument.querySelectorAll(_paths[1])[0]
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
      (<PPWindow>window).electronSafeIpc.send('buttonCandidatesFetched', buttonCandidates);
    },

    getTestableButtonCandidates: (id:string) => {
      let buttonCandidates = _getButtonCandidates();

      let playButtonsCandidates = _sortByUniqueness(buttonCandidates.filter((button) => button.isPlayButton));
      if(playButtonsCandidates.length > 0){
        playButtonsCandidates[0].xpath = _getElementXPath(playButtonsCandidates[0].element)
      }

      let pauseButtonsCandidates = _sortByUniqueness(buttonCandidates.filter((button) => button.isPauseButton));
      if(pauseButtonsCandidates.length > 0){
        pauseButtonsCandidates[0].xpath = _getElementXPath(pauseButtonsCandidates[0].element)
      }

      playButtonsCandidates.forEach(el => delete el['element']);
      pauseButtonsCandidates.forEach(el => delete el['element']);

      (<PPWindow>window).electronSafeIpc.send('testableButtonCandidatesFetched'+id, {
        playButtonsCandidates: playButtonsCandidates,
        pauseButtonsCandidates: pauseButtonsCandidates,
      });
    },

    getPlayerState: (playBtnObj:StationButtonPath, pauseBtnObj:StationButtonPath) => {
      (<PPWindow>window).electronSafeIpc.send("buttonStylesFetched", {
        playBtnStyle:window.getComputedStyle(_getElementQuery(playBtnObj)),
        pauseBtnStyle: window.getComputedStyle(_getElementQuery(pauseBtnObj))
      })
    },

    click: (buttonPath:StationButtonPath):void => {
      _getElementQuery(buttonPath).click()
    }
  }
})();

import {PPWindow} from "../domain/window";
import {StationButtonPath} from "../domain/station";
import {iRatedHTMLElement} from "../domain/iRatedHTMLElement";

class ratedHTMLElement implements iRatedHTMLElement{
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
      if(element[attr] && element[attr].indexOf){
        const EL_ATTR = element[attr].toLowerCase();
        return EL_ATTR.indexOf('play') > -1
       }
    });

    this.isPauseButton = this._PP_MEDIA_ATTRIBUTES.some(attr => {
      if(element[attr] && element[attr].indexOf){
        const EL_ATTR = element[attr].toLowerCase();
        return (EL_ATTR.indexOf('stop') > -1 || EL_ATTR.indexOf('pause') > -1)
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
    if (element && element.id)
      return '//*[@id="' + element.id + '"]';
    else
      return _getElementTreeXPath(element);
  };

  function _getElementTreeXPath(element:HTMLElement){
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
  };

  function _buildElement(el:HTMLElement, parentId:string){
    const PP_MEDIA_ATTRIBUTES = [
      'id', 'className', 'title'
    ];
    const PREFERRED_PLAY_VALUES = [
      'stopped'
    ];
    const PREFERRED_PAUSE_VALUES = [
      'playing'
    ];
    const PREFERRED_GENERAL_VALUES = [
      'playcontrol'
    ];
    const IGNORED_VALUES = [
      'playlist', 'player', 'volume', 'open'
    ];
    const PP_SCORE = 1;

    let _el = {
      element: el,
      path: el.className && el.className.replace ? '.' + el.className.replace(/ /g,'.') : '',
      className: el.className,
      id: el.id,
      playButtonScore: 0,
      pauseButtonScore: 0,
      isPlayButton: false,
      isPauseButton: false,
      isOtherMediaControl: false,
      parentId: parentId || undefined
    };

    PP_MEDIA_ATTRIBUTES.forEach(attr => {
      if(el[attr] && el[attr].indexOf){
        const EL_ATTR = el[attr].toLowerCase();
        if (EL_ATTR.indexOf('play') > -1) {
          _el.playButtonScore += PP_SCORE
          _el.isPlayButton = true;

          PREFERRED_GENERAL_VALUES.forEach(val => {
            if(EL_ATTR.indexOf(val) > -1){
              _el.playButtonScore += PP_SCORE;
            }
          })
        }

        if (EL_ATTR.indexOf('stop') > -1 || EL_ATTR.indexOf('pause') > -1) {
          _el.pauseButtonScore += PP_SCORE;
          _el.isPauseButton = true;
        }

        IGNORED_VALUES.forEach(val => {
          if(EL_ATTR.indexOf(val) > -1){
            _el.isOtherMediaControl = true;
          }
        })
      }
    });

    if (el.nodeName === 'BUTTON') {
      if(_el.isPlayButton){
        _el.playButtonScore += PP_SCORE
      }
      if(_el.isPauseButton){
        _el.pauseButtonScore += PP_SCORE
      }
    }

    return _el
  }

  function _getButtonCandidates(elements?:any, old?:Array<any>, parentXpath?:string){
    const IGNORED_NODE_TYPES = ['A'];
    let _elements = elements || document.querySelectorAll('*');
    let _old = old || [];
    let _parentXpath = parentXpath || null;

    [].forEach.call(_elements, (el:any) => {
      if (el.nodeName === 'IFRAME'){
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
        _old.push(new ratedHTMLElement(el, _parentXpath));
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
      console.log(id);
      let buttonCandidates = _getButtonCandidates();

      let playButtonsCandidates = buttonCandidates.filter((button) => button.isPlayButton);
      if(playButtonsCandidates.length > 0){
        playButtonsCandidates[0].xpath = _getElementXPath(playButtonsCandidates[0].element)
      }
      playButtonsCandidates.forEach(el => delete el['element']);

      let pauseButtonsCandidates = buttonCandidates.filter((button) => button.isPauseButton);
      if(pauseButtonsCandidates.length > 0){
        pauseButtonsCandidates[0].xpath = _getElementXPath(pauseButtonsCandidates[0].element)
      }
      pauseButtonsCandidates.forEach(el => delete el['element']);

      //TODO check if one winner or multiple

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

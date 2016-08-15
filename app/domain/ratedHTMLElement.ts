export class ratedHTMLElement{
  element:HTMLElement;
  path:string;
  className:string;
  id:string;
  playButtonScore = 0;
  pauseButtonScore:number;
  isPlayButton = false;
  isPauseButton = false;
  parentXpath:string;
  xpath:string;

  constructor(element:HTMLElement, parentXpath:string) {
      this.element = element;
      this.parentXpath = parentXpath;
      this.checkAttributes(this.element, 1000);
      this.checkNodeName(this.element, 100);
  }

  private checkAttributes(element:HTMLElement, score:number):void{
    const PP_MEDIA_ATTRIBUTES = [
      'id', 'className', 'title'
    ];

    PP_MEDIA_ATTRIBUTES.forEach(attr => {
      if(element[attr] && element[attr].indexOf){
        const EL_ATTR = element[attr].toLowerCase();

        if (EL_ATTR.indexOf('play') > -1) {
          this.playButtonScore += score;
          this.isPlayButton = true; //TODO don set this here
        }

        if (EL_ATTR.indexOf('stop') > -1 || EL_ATTR.indexOf('pause') > -1) {
          this.pauseButtonScore += score;
          this.isPauseButton = true;
        }
      }
    });
  }

  private checkNodeName(element:HTMLElement, score:number){
    if (element.nodeName === 'BUTTON') {
      if(this.isPlayButton){
        this.playButtonScore += score
      }
      if(this.isPauseButton){
        this.pauseButtonScore += score
      }
    }
  }
}

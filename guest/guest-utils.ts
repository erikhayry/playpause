import {PPWindowImpl} from "../domain/window";

(<PPWindowImpl>window).PP_EP = (() => {
  const LOG = 'color: orange; font-weight: bold;';
  console.log('%c render on guest', LOG);

  return {
    getButtons: () => {
      console.log('%c render on guest.getButtons()', LOG);
      (<PPWindowImpl>window).electronSafeIpc.send('buttonsFetched', [1,2,3]);
    }
  }
})();

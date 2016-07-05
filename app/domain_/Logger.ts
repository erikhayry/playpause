import {iLogger} from "../domain_/iLogger";

export class Logger implements iLogger{
  name:string;

  constructor(name:string) {
      this.name = name;
  }

  log(where:string, ...args:any[]){
    console.log(`${this.name}.${where}`, args)
  }
}

module.exports = Logger;

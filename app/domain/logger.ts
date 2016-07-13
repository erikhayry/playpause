export class Logger{
  name:string;
  style:string;

  constructor(name:string, color:string) {
      this.name = name;
      this.style = `color: ${color}; font-weight: bold;`;
  }

  log(where:string, ...args:any[]){
    console.log(`%c ${this.name}.${where}`, this.style, args)
  }
}

export class Logger{
  private style:String;
  name:String;


  constructor(name:String, color:String) {
      this.name = name;
      this.style = `color: ${color}; font-weight: bold;`;



  }

  log = (...args:any[]):void =>{
    console.log(this.style, this.name, ...args)
  }
}

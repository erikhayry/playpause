export interface IpcRendererEvent{
  sender: {
    domain: String
  }
}

export interface IpcRenderer{
  on(event:String, callback:any):any
}

export interface SafeIPC{
  on(event:String, callback:any):any
}


export interface Electron{
  ipcRenderer:IpcRenderer
}

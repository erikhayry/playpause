export interface IpcRenderer{
  on(event:String, callback:any)
}

export interface SafeIPC{
  on(event:String, callback:any)
}


export interface Electron{
  ipcRenderer:IpcRenderer
}

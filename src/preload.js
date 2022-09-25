const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('emitter', {
    ping: () => ipcRenderer.invoke('ping')
})

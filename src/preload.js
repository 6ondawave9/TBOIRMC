const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  buildMod: (mod) => ipcRenderer.send('build-mod', mod)
})
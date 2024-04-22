const { app, BrowserWindow, ipcMain } = require('electron')
const { ModBuilder } = require('./src/modbuilder')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1200,
      height: 700,
      center: true,
      autoHideMenuBar: true,
      webPreferences: {
        devTools: false,
        preload: path.join(__dirname, 'src/preload.js')
      }
    })

    ipcMain.on('build-mod', (event, mod) => {
      ModBuilder.createMod(mod)
    })
  
    win.loadFile('index.html')
}
app.whenReady().then(() => {
        createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('src/index.html')
}

app.whenReady().then(() => {
    createWindow()

    ipcMain.handle('get-version', () => {
        const version = app.getVersion()
        console.log('Version:', version)
        return version
    })

    ipcMain.on('button-click', (event, arg) => {
        console.log(arg)
    })
})

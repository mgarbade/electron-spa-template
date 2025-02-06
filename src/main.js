const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js')
        }
    });

    win.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('button-click', (event, arg) => {
        console.log(arg); // Handle IPC messages
    });
});

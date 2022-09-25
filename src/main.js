const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

app.commandLine.appendSwitch('enable-web-bluetooth', true);
app.commandLine.appendSwitch('enable-experimental-web-platform-features');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: true,
        titleBarOverlay: {
            color: '#e4e4e4',
            symbolColor: '#F25E86',
            height: 30
        },
        titleBarStyle: 'hidden'
    })

    win.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
        event.preventDefault()
        console.log(deviceList);
        if (deviceList && deviceList.length > 0 && deviceList[0].deviceName.indexOf('未知') === -1) {
            console.log('push');
            win.webContents.send('push-connect-status', {
                status: true,
                device: deviceList[0]
            })
            callback(deviceList[0].deviceId)
        } else callback('')
    })

    win.webContents.openDevTools();

    win.loadFile('src/index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

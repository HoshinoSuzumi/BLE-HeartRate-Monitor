const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

app.commandLine.appendSwitch('enable-web-bluetooth', true);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: true,
        titleBarOverlay: {
            color: '#F0F2F2',
            symbolColor: '#F25E86',
            height: 30
        },
        titleBarStyle: 'hidden'
    })

    win.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
        event.preventDefault()
        const scannedDeviceLists = [];
        deviceList.forEach(device => {
            if (device.deviceName.indexOf('未知') === -1) scannedDeviceLists.push(device)
        });
        console.log('scannedDeviceLists', scannedDeviceLists)
        win.webContents.send('push-device-list', scannedDeviceLists);
        if (deviceList && deviceList.length > 0) {
            callback(deviceList[0].deviceId)
        } 
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

const { ipcRenderer } = require('electron')

const elemDeviceList = document.querySelector('#device-list')

let deviceList = []

ipcRenderer.on('push-device-list', (ev, arg) => {
    deviceList = arg;
    elemDeviceList.innerHTML = '';
    arg.forEach(device => {
        let li = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = `${device.deviceName}[${device.deviceId}]`
        button.addEventListener('cilck', () => {
            ipcRenderer.send('select-bluetooth-device', device.deviceId)
        });
        li.appendChild(button)
        elemDeviceList.appendChild(li);
        li = null;
        button = null;
    });
})

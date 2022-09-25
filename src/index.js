const { ipcRenderer } = require('electron')
const echarts = require('echarts')

let chart_x = []
let chart_data = []
let chart = echarts.init(document.getElementById('charts'))
chart.setOption({
    tooltip: {},
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value'
    },
    series: [
        {
            data: [0],
            type: 'line',
            smooth: true
        }
    ]
});
window.onresize = function () {
    chart.resize();
};

const elemBtnConnectBle = document.getElementById('btn-connect-ble');
const elemAppTopBar = document.querySelector('.app-top-bar')
const elemHeartRateValue = document.getElementById('heart-rate-value')

let BleDevice = null;
let connectionStatus = {
    status: false,
    device: null
}

ipcRenderer.on('push-connect-status', (ev, status) => {
    connectionStatus = status;
    elemAppTopBar.innerHTML += ` · [已连接] ${connectionStatus.device.deviceName || connectionStatus.device.deviceId || 'N/A'}`;
})

elemBtnConnectBle.addEventListener('click', () => {
    connectionStatus.status = false
    elemBtnConnectBle.disabled = true;

    let scan_job = setInterval(() => {
        if (!connectionStatus.status) {
            BleDevice = navigator.bluetooth.requestDevice({
                filters: [{ services: ['heart_rate'] }]
            }).then(device => {
                console.log('> Name:             ' + connectionStatus.device.deviceName);
                console.log('> Id:               ' + device.id);
                console.log('> Is connected:     ' + device.gatt.connected);
                return device.gatt.connect();
            }).catch(err => { });
            next = false;
        } else {
            elemBtnConnectBle.disabled = false;
            elemBtnConnectBle.classList.add('connected');
            clearInterval(scan_job);
            scan_finish();
        }
    }, 500);

    const scan_finish = () => {
        BleDevice.then(server => {
            return server.getPrimaryService('heart_rate');
        }).then(service => {
            return service.getCharacteristic('heart_rate_measurement');
        }).then(character => {
            return character.startNotifications().then(_ => {
                character.addEventListener('characteristicvaluechanged', (ev) => {
                    let data = ev.target.value;
                    let heartRate = data.getUint8(1);
                    elemHeartRateValue.innerText = heartRate;
                    chart_data.push(heartRate);
                    // chart_x.push(chart_data.length);
                    chart_x.push(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`);
                    chart.setOption({
                        xAxis: {
                            data: chart_x
                        },
                        series: [
                            {
                                data: chart_data,
                            }
                        ]
                    });
                    console.log(`Heart Rate: ${ev.target.value.getInt8(1)}`);
                });
            });
        })
    }

});


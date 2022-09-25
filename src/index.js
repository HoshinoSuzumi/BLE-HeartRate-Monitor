const elemBtnConnectBle = document.getElementById('btn-connect-ble');

elemBtnConnectBle.addEventListener('click', () => {
    deviceList = []
    elemBtnConnectBle.disabled = true;

    navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }]
    }).then(device => {
        return device.gatt.connect();
    }).catch(err => { });

    let scan_job = setInterval(() => {
        if (deviceList && deviceList.length === 0) {
            navigator.bluetooth.requestDevice({
                filters: [{ services: ['heart_rate'] }]
            }).catch(err => { });
            next = false;
        } else {
            elemBtnConnectBle.disabled = false;
            clearInterval(scan_job);
            scan_finish();
        }
    }, 500);

    const scan_finish = () => {
        navigator.bluetooth.
        console.log(deviceList);
    }

    // navigator.bluetooth.requestDevice({
    //     filters: [{ services: ['heart_rate'] }]
    // }).then(device => {
    //     console.log('device', device);
    //     return device.gatt.connect();
    // }).then(server => {
    //     console.log('server', server);
    //     return server.getPrimaryService('heart_rate');
    // }).then(service => {
    //     console.log('service', service);
    //     return service.getCharacteristic('heart_rate_measurement');
    // }).then(characteristic => {
    //     console.log('characteristic', characteristic);
    // }).catch(err => { });

});


function metadata() {
    return {
        "network": "Test",
        "manufacturer": "Imont",
        "model": "Test Input Device",
        "hardwareVersion": "1",
        "primaryFeature": "ON_OFF"
    }
}

function onLoad() {
    var meta = metadata();
    framework.db.raiseEvent(context.id,
        framework.stdevents.hardware.DEVICE_ADDED_EVENT,
        meta.primaryFeature,
        {
            'POWER_SUPPLY':'AC',
            'HARDWARE_VERSION': meta.hardwareVersion,
            'MODEL': meta.model,
            'MANUFACTURER': meta.manufacturer,
            'FIRMWARE_VERSION': '29',
            'PROTOCOL': 'Test',
            'IP_ADDRESS': "Unknown"
        }
    );
    framework.db.raiseEvent(context.id, 'ON_OFF>ON_OFF', '0', null);
    context.scheduler.callback("reportStatus", 0, 60000); // every minute
}

function onRequestEvent(evt) {
    if (evt.key == 'ON_OFF>ON_OFF') {
        if (evt.value == '1') {
            java.lang.System.out.println("Switching device ON")
            framework.db.raiseEvent(context.id, 'ON_OFF>ON_OFF', '1', null);
        } else if (evt.value == '0') {
            java.lang.System.out.println("Switching device OFF")
            framework.db.raiseEvent(context.id, 'ON_OFF>ON_OFF', '0', null);
        } else {
            java.lang.System.out.println("Unknown ON_OFF value " + evt.value);
            return;
        }
    } else {
        java.lang.System.out.println("Unknown request event:" + evt);
    }
}

function reportStatus() {
    framework.db.raiseEvent(context.id,
        "STATUS_EVENT",
        "DEVICE_STATUS",
        {
            'ATTRIBUTE': 'VALUE',
            'ATTRIBUTE2': 'VALUE2'
        }
    );
}


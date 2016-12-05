function metadata() {
    return {
        "network": "Test",
        "manufacturer": "Test",
        "model": "Test Device",
        "hardwareVersion": "1",
        "primaryFeature": "TEST_FEATURE"
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

    context.scheduler.callback("reportStatus", 0, 60000); // every minute
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


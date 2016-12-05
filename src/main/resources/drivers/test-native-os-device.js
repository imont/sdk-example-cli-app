function metadata() {
    return {
        "network": "OS",
        "manufacturer": "OS",
        "model": "OS",
        "hardwareVersion": "1",
        "primaryFeature": "OS_FEATURE"
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
            'PROTOCOL': 'Native',
            'OPERATING_SYSTEM': framework.os.getOSVersion()
        }
    );

    context.scheduler.callback("reportStatus", 0, 60000); // every minute
}

function reportStatus() {
    framework.db.raiseEvent(context.id,
        "STATUS_EVENT",
        "DEVICE_STATUS",
        {
            'OS_UPTIME': "" + framework.os.getOSUptime()
        }
    );
}


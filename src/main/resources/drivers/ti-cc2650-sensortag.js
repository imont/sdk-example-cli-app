/*
 * Copyright (C) 2017 IMONT Technologies Limited
 */
var battery_service_uuid = "0000180f-0000-1000-8000-00805f9b34fb";
var battery_level_uuid = "00002a19-0000-1000-8000-00805f9b34fb";

// the ir temperature service covers ambient and object (infra-red) temperature
var ir_temperature_service_uuid = 'f000aa00-0451-4000-b000-000000000000';
var ir_temperature_data_uuid = 'f000aa01-0451-4000-b000-000000000000';  // handle 0x0024
var ir_temperature_config_uuid = 'f000aa02-0451-4000-b000-000000000000';  // handle 0x0027
var ir_temperature_period_uuid = 'f000aa03-0451-4000-b000-000000000000';  //

var luxometer_service_uuid = 'f000aa70-0451-4000-b000-000000000000';
var luxometer_data_uuid = 'f000aa71-0451-4000-b000-000000000000';  // handle: 0x0044
var luxometer_config_uuid = 'f000aa72-0451-4000-b000-000000000000';  // handle: 0x0047
var luxometer_period_uuid = 'f000aa73-0451-4000-b000-000000000000';

var humidity_service_uuid = 'f000aa20-0451-4000-b000-000000000000';
var humidity_data_uuid = 'f000aa21-0451-4000-b000-000000000000';
var humidity_config_uuid = 'f000aa22-0451-4000-b000-000000000000';  // handle: 0x002f
var humidity_period_uuid = 'f000aa23-0451-4000-b000-000000000000';

var barometer_service_uuid = 'f000aa40-0451-4000-b000-000000000000';
var barometer_data_uuid = 'f000aa41-0451-4000-b000-000000000000';  // handle: 0x0034
var barometer_config_uuid = 'f000aa42-0451-4000-b000-000000000000';  // handle: 0x0037
var barometer_period_uuid = 'f000aa44-0451-4000-b000-000000000000';

var io_service_uuid = 'f000aa64-0451-4000-b000-000000000000';
var io_data_uuid = 'f000aa65-0451-4000-b000-000000000000';
var io_config_uuid = 'f000aa66-0451-4000-b000-000000000000';

function metadata() {
    return {
        "network": "BLE",
        "manufacturer": "Texas Instruments",
        "model": "CC2650 SensorTag",
        "hardwareVersion": "PCB 1.2/1.3",
        "primaryFeature": 'TEMPERATURE'
    }
}

function onLoad() {
    reportIO();
    context.scheduler.callback("readLux", 0, 120000); // every 2 mins
    context.scheduler.callback("readTemperature", 0, 300000); // every 5 mins
    context.scheduler.callback("readHumidity", 0, 300000); // every 5 mins
    context.scheduler.callback("readBarometer", 0, 300000); // every 5 mins
    context.scheduler.callback("readBattery", 0, 3600000 ); // every hour
}

function acquire(device) {
    return true
}

function switchOnTemperatureSensor() {
    framework.ble.writeCharacteristic(context.id, ir_temperature_service_uuid, ir_temperature_config_uuid, [ 1 ]);
}

function switchOnLightSensor() {
    framework.ble.writeCharacteristic(context.id, luxometer_service_uuid, luxometer_config_uuid, [ 1 ]);
}

function switchOnHumiditySensor() {
    framework.ble.writeCharacteristic(context.id, humidity_service_uuid, humidity_config_uuid, [ 1 ]);
}

function switchOnPressureSensor() {
    framework.ble.writeCharacteristic(context.id, barometer_service_uuid, barometer_config_uuid, [ 1 ]);
}

function switchOnIOActuator() {
    framework.ble.writeCharacteristic(context.id, io_service_uuid, io_data_uuid, [ 0 ]);   // turn all LEDs/buzzer off by default.
    framework.ble.writeCharacteristic(context.id, io_service_uuid, io_config_uuid, [ 1 ]);
}

function setSamplingIntervals() {
    // We don't read anything more than every 5 seconds so set the sampling period to the max (2.55 secs) for each, (might save a bit of battery).
    framework.ble.writeCharacteristic(context.id, ir_temperature_service_uuid, ir_temperature_period_uuid, [ -1 ]);
    framework.ble.writeCharacteristic(context.id, luxometer_service_uuid, luxometer_period_uuid, [ -1 ]);
    framework.ble.writeCharacteristic(context.id, humidity_service_uuid, humidity_period_uuid, [ -1 ]);
    framework.ble.writeCharacteristic(context.id, barometer_service_uuid, barometer_period_uuid, [ -1 ]);
}

function onAttribute(evt) {
    context.log.debug("onAttribute");
}

function onConnection(evt) {
    context.log.debug("onConnection");
}

function readLux() {
    // Luxometer
    var rawLux = framework.ble.readCharacteristic(
                        context.id,
                        luxometer_service_uuid,
                        luxometer_data_uuid
                 );
    if (rawLux != null) {
        var lux  = calculateLux(rawLux);
        if (lux == 0) {
            // If lux is zero then there is either no light being measured (quite possible) or the sensor is not on.
            // Read the config to ensure the sensor is on.
            if (framework.ble.readCharacteristic(context.id, luxometer_service_uuid, luxometer_config_uuid)[0] != 1) {
                switchOnLightSensor();
                context.scheduler.callback("readLux", 1000);  // It takes some time for the sensor to get it's first reading.
                return;
            }
        }
        reportIfChanged(context.id, 'LIGHT_INTENSITY', calculateLux(rawLux), null);
    }
}

function calculateLux(rawLux) {
    var value = parseInt(pad(((rawLux[1] & 0xFF)).toString(16), 2) + pad((rawLux[0] & 0xFF).toString(16), 2), 16);

    var mantissa = value & 0x0FFF
    var exponent = value >> 12

    var magnitude = Math.pow(2, exponent)
    var output = (mantissa * magnitude)

    var lux = output / 100.0

    return lux
}

function readTemperature() {
    // IR Temperature
    var rawIrTempData = framework.ble.readCharacteristic(context.id, ir_temperature_service_uuid, ir_temperature_data_uuid);
    if (rawIrTempData != null) {
        var objectTemp = calculateObjTemp(rawIrTempData);
        var ambientTemp = calculateAmbTemp(rawIrTempData);

        if (objectTemp == 0 && ambientTemp == 0) {
            // It is very unlikely that the reading is actually zero, switch on sensor and try again.
            switchOnTemperatureSensor();
            context.scheduler.callback("readTemperature", 1000); // It takes some time for the sensor to get it's first reading.
            return;
        }
        reportIfChanged(context.id, 'OBJECT_TEMPERATURE', objectTemp, null);
        reportIfChanged(context.id, 'AMBIENT_TEMPERATURE', ambientTemp, null);
    }
}

function calculateObjTemp(rawIrTemp) {
    // Object Temperature is the first two bytes with endianness swapped
    var objTemp = "" + parseInt(pad(((rawIrTemp[1] & 0xFF)).toString(16), 2) + pad((rawIrTemp[0] & 0xFF).toString(16), 2), 16);
    return calculateTemperature(objTemp);
}

function calculateAmbTemp(rawIrTempData) {
    // Ambient Temperature is the second two bytes with endianness swapped
    var ambTempData = "" + parseInt(pad((rawIrTempData[3] & 0xFF).toString(16), 2) + pad((rawIrTempData[2] & 0xFF).toString(16), 2), 16);
    return calculateTemperature(ambTempData);
}

function readHumidity() {
    // Humidity
    var rawHumidity = framework.ble.readCharacteristic(context.id, humidity_service_uuid, humidity_data_uuid);
    if (rawHumidity != null) {
        var humidity = calculateHumidity(rawHumidity);
        if (humidity == 0) {
            // It is very unlikely that the reading is actually zero, switch on sensor and try again.
            switchOnHumiditySensor();
            context.scheduler.callback("readHumidity", 1000); // It takes some time for the sensor to get it's first reading.
            return;
        }
        reportIfChanged(context.id, 'RELATIVE_HUMIDITY', humidity, null);
    }
}

function calculateHumidity(data) {
    var humidityData = "" + parseInt(pad((data[3] & 0xFF).toString(16), 2) + pad((data[2] & 0xFF).toString(16), 2), 16);
    var humidity = (humidityData / 65536) * 100;
    return Math.round(humidity * 10) / 10;
}

function readBarometer() {
    // Barometer
    var rawBarometer = framework.ble.readCharacteristic(context.id, barometer_service_uuid, barometer_data_uuid);
    if (rawBarometer != null) {
        var pressure = calculateBarometer(rawBarometer)
        if (pressure == 0) {
            // It is very unlikely that the reading is actually zero, switch on sensor and try again.
            switchOnPressureSensor();
            context.scheduler.callback("readBarometer", 1000); // It takes some time for the sensor to get it's first reading.
            return;
        }
        reportIfChanged(context.id, 'ATMOSPHERIC_PRESSURE', "" + pressure, null);
    }
}

function calculateBarometer(data) {
    // Pressure is the last three bytes with endianness swapped
    var barometerData =
            parseInt((toPaddedUnsignedHex(data[5]) + toPaddedUnsignedHex(data[4]) + toPaddedUnsignedHex(data[3])), 16);
    return barometerData / 100;
}

function readBattery() {
    // Battery Level
    var batteryLevel = framework.ble.readCharacteristic(context.id, battery_service_uuid, battery_level_uuid);
    if (batteryLevel != null) {
        reportIfChanged(context.id, 'BATTERY_LEVEL', "" + batteryLevel[0], null);
    }
}

function reportIO() {
    // All IO device are by default switched off so just report the state.
    reportIfChanged(context.id, 'ON_OFF>ON_OFF', "0", null);
}

function calculateTemperature(data) {
    var temperature = (data >> 2) * 0.03125;
    return Math.round(temperature * 100) / 100;
}

function toPaddedUnsignedHex(byte) {
    return pad((byte & 0xFF).toString(16), 2);
}

function pad(value, size) {
    var s = String(value);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

function onRequestEvent(evt) {
    if (evt.key == 'ON_OFF>ON_OFF') {
        if (evt.value == 1) {
            var data = 7  // BE VERY CAREFUL HERE! Setting bit 3 on this characteristic will erase the external flash.
        } else if (evt.value == 0) {
            var data = 0
        } else {
            return;
        }
        switchOnIOActuator();
        framework.ble.writeCharacteristic(context.id, io_service_uuid, io_data_uuid, [ data ]);
        framework.db.raiseEvent(context.id, 'ON_OFF>ON_OFF', "" + evt.value, null);
    }
}

reportIfChanged = function(id, key, value, metadata) {
    var currentValue = context.cache.get(key);
    if (currentValue != value) {
        framework.db.raiseEvent(id, key, value, metadata);
        context.cache.put(key, value);
    }
}
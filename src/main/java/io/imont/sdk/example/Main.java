/**
 * Copyright 2016 IMONT Technologies
 * Created by romanas on 04/12/2016.
 */
package io.imont.sdk.example;

import io.imont.ferret.client.config.FerretConfiguration;
import io.imont.lion.Lion;
import io.imont.lion.LionBuilder;
import io.imont.lion.drivers.DriverSpec;
import io.imont.sdk.example.hardware.ExampleOSHardwareLayer;

import java.io.File;

public class Main {

    public static final String WORK_DIR = ".";

    private static final String[] DRIVERS = new String[] {
            "drivers/test-native-os-device.js",
            "drivers/test-bridged-device.js",
            "drivers/test-input-device.js"
    };

    public static void main(String[] args) throws Exception {
        boolean firstStart = !new File(WORK_DIR, "state.yaml").exists();
        Lion lion = new LionBuilder()
                .ferretConfiguration(getConfiguration())
                .workDir(WORK_DIR) // current directory
                .build();

        for (String driver : DRIVERS) {
            lion.getDriverManager().registerDriver(Main.class.getClassLoader().getResource(driver));
        }

        lion.registerNetwork("os", new ExampleOSHardwareLayer());

        lion.start();

        if (firstStart) {
            lion.registerDevice(lion.getMole().getLocalPeerId(), new DriverSpec("OS", "OS", "OS", "1"));
            lion.registerDevice("TEST:DEVICE:ID", new DriverSpec("Test", "Test", "Test Device", "1"));
            lion.registerDevice("TEST:INPUT-DEVICE:ID", new DriverSpec("Test", "Imont", "Test Input Device", "1"));
        }
    }

    private static FerretConfiguration getConfiguration() {
        // Just a static config
        FerretConfiguration fc = new FerretConfiguration();
        fc.setFriendlyName("My app");
        fc.setType("CLI");
        fc.setRendezvousHost("r.imont.tech");
        fc.setRendezvousPort(4444);
        return fc;
    }
}

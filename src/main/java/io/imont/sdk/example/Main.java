/**
 * Copyright 2016 IMONT Technologies
 * Created by romanas on 04/12/2016.
 */
package io.imont.sdk.example;

import io.imont.bluetooth.BluezBleNetwork;
import io.imont.ferret.client.config.NetworkConfig;
import io.imont.lion.Lion;
import io.imont.lion.LionBuilder;
import io.imont.lion.drivers.DriverManager;
import tinyb.BluetoothManager;

import java.net.URL;

public class Main {

    private static final String WORK_DIR = ".";

    public static void main(String[] args) throws Exception {
        Lion lion = new LionBuilder()
                .networkConfig(getConfiguration())
                .workDir(WORK_DIR)
                .build();

        lion.registerNetwork(
                "BLE",
                new BluezBleNetwork(BluetoothManager.getBluetoothManager())
        );
        DriverManager dm = lion.getDriverManager();

        URL driverLocation = Main.class.getClassLoader().getResource("drivers/ti-cc2650-sensortag.js");
        dm.registerDriver(driverLocation);

        lion.start();

        AppInfo info = new AppInfo(lion.getMole());
        info.report();
    }

    private static NetworkConfig getConfiguration() {
        NetworkConfig fc = new NetworkConfig();
        fc.setCoordinator(true);
        fc.setFriendlyName("My CLI App");
        fc.setType("CLI");
        fc.setRendezvousHost("r.imont.tech");
        fc.setRendezvousPort(4444);
        return fc;
    }
}

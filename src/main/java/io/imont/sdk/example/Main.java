/**
 * Copyright 2016 IMONT Technologies
 * Created by romanas on 04/12/2016.
 */
package io.imont.sdk.example;

import io.imont.bluetooth.BluezBleNetwork;
import io.imont.ferret.client.config.NetworkConfig;
import io.imont.lion.Lion;
import io.imont.lion.LionBuilder;
import tinyb.BluetoothManager;

public class Main {

    private static final String WORK_DIR = ".";

    public static void main(String[] args) throws Exception {
        Lion lion = new LionBuilder()
                .networkConfig(getConfiguration())
                .workDir(WORK_DIR) // current directory
                .build();

        lion.registerNetwork("BLE", new BluezBleNetwork(BluetoothManager.getBluetoothManager()));
        lion.start();
    }

    private static NetworkConfig getConfiguration() {
        NetworkConfig fc = new NetworkConfig();
        fc.setFriendlyName("My CLI App");
        fc.setType("CLI");
        fc.setRendezvousHost("r.imont.tech");
        fc.setRendezvousPort(4444);
        return fc;
    }
}

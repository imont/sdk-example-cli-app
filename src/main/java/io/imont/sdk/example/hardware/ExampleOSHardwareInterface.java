/**
 * Copyright 2016 IMONT Technologies
 * Created by romanas on 05/12/2016.
 */
package io.imont.sdk.example.hardware;

import java.lang.management.ManagementFactory;

public class ExampleOSHardwareInterface {

    public String getOSVersion() {
        return System.getProperty("os.name");
    }

    public long getOSUptime() {
        return ManagementFactory.getRuntimeMXBean().getUptime();
    }

    public String fake() {
        return "I AM FAKE";
    }
}

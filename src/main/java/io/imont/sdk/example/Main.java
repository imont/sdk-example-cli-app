/**
 * Copyright 2016 IMONT Technologies
 * Created by romanas on 04/12/2016.
 */
package io.imont.sdk.example;

import io.imont.ferret.client.config.FerretConfiguration;
import io.imont.lion.Lion;
import io.imont.lion.LionBuilder;

import java.nio.file.Files;
import java.nio.file.attribute.FileAttribute;

public class Main {

    public static void main(String[] args) throws Exception {
        Lion lion = new LionBuilder()
                .ferretConfiguration(getConfiguration())
                .workDir(Files.createTempDirectory("liontemp", new FileAttribute[] {}).toString())
                .build();

        lion.start();
    }

    private static FerretConfiguration getConfiguration() {
        // Just a static config
        FerretConfiguration fc = new FerretConfiguration();
        fc.setFriendlyName("My app");
        fc.setType("CLI");
        fc.setRendezvousHost("r.imont.tech");
        fc.setRendezvousPort(5555);
        return fc;
    }
}

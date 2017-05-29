/*
 * Copyright (C) 2017 IMONT Technologies Limited
 *
 */
package io.imont.sdk.example;

import io.imont.cairo.events.Hardware;
import io.imont.cairo.events.Hub;
import io.imont.mole.MoleClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class AppInfo {

    public static final String SOFTWARE_ENV_KEY = "SOFTWARE>ENVIRONMENT";

    private static final Logger logger = LoggerFactory.getLogger(AppInfo.class);

    private static final String VERSION_PROPS_FILE = "version.properties";

    private MoleClient moleClient;

    public AppInfo(final MoleClient moleClient) {
        this.moleClient = moleClient;
    }

    public void report() throws Exception {
        Map<String, String> meta = new HashMap<>();
        meta.put(Hardware.DEVICE_ADDED_MANUFACTURER_META.getMetaKey(), getManufacturer());
        meta.put(Hardware.DEVICE_ADDED_MODEL_META.getMetaKey(), getModel());
        meta.put(Hardware.DEVICE_ADDED_POWER_SUPPLY_META.getMetaKey(), "AC");
        meta.put(Hardware.DEVICE_ADDED_PHYSICAL_ADDRESS_META.getMetaKey(), moleClient.getLocalPeerId());
        meta.put(Hardware.DEVICE_ADDED_MOLE_PEER_ID_META.getMetaKey(), moleClient.getLocalPeerId());
        meta.put(Hardware.DEVICE_ADDED_FIRMWARE_VERSION_META.getMetaKey(), getVersion());

        raiseEvent(Hardware.DEVICE_ADDED_EVENT.getFQEventKey(), Hub.HUB_FEATURE.getFQEventKey(), meta);
        raiseEvent(SOFTWARE_ENV_KEY, "BASIC", null);
    }

    protected MoleClient getMoleClient() {
        return moleClient;
    }

    private String getVersion() {
        try (InputStream is = AppInfo.class.getClassLoader().getResourceAsStream(VERSION_PROPS_FILE)) {
            Properties props = new Properties();
            props.load(is);
            return (String) props.get("version");
        } catch (IOException e) {
            logger.warn("Unable to get our version, defaulting to UNKNOWN", e);
        }
        return "UNKNOWN";
    }

    private String getManufacturer() {
        String os = System.getProperty("os.name");
        String arch = System.getProperty("os.arch");
        String version = System.getProperty("os.version");
        return String.format("%s %s %s", os, arch, version);
    }

    private String getModel() {
        try {
            return InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException e) {
            String hostname = System.getenv("HOSTNAME");
            if (hostname == null || hostname.isEmpty()) {
                return "UNKNOWN";
            }
            return hostname;
        }
    }

    protected void raiseEvent(final String key, final String value, final Map<String, String> meta) {
        try {
            getMoleClient().raiseEvent(getMoleClient().getLocalPeerId(), key, value, meta).subscribe();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

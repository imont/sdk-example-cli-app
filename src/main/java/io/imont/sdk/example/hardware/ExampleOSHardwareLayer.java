/**
 * Copyright 2016 IMONT Technologies
 * Created by romanas on 05/12/2016.
 */
package io.imont.sdk.example.hardware;

import io.imont.lion.network.AbstractNetworkLayer;
import io.imont.lion.network.DeviceCandidate;
import io.imont.lion.network.NetworkEvent;
import rx.Observable;

public class ExampleOSHardwareLayer extends AbstractNetworkLayer {

    @Override
    public Object getPublicInterface() {
        return new ExampleOSHardwareInterface();
    }

    @Override
    public Observable<NetworkEvent> events() {
        return Observable.empty();
    }

    @Override
    public Observable<DeviceCandidate> discover() {
        return Observable.empty();
    }

    @Override
    public void stopDiscovering() {

    }
}

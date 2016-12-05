/**
 * Copyright 2016 IMONT Technologies
 * Created by romanas on 05/12/2016.
 */
package io.imont.sdk.example.hardware;

import io.imont.network.FoundDevice;
import io.imont.network.NetworkEvent;
import io.imont.network.NetworkLayer;
import rx.Observable;

public class ExampleOSHardwareLayer implements NetworkLayer {

    @Override
    public Object getPublicInterface() {
        return new ExampleOSHardwareInterface();
    }

    @Override
    public Observable<NetworkEvent> events() {
        return Observable.empty();
    }

    @Override
    public Observable<FoundDevice> discover() {
        return Observable.empty();
    }

    @Override
    public void stopDiscovering() {

    }
}

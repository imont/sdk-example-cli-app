IMONT SDK Example CLI Application
=====

A simple app that instantiates the IMONT SDK with the Bluetooth module and allows connecting a TI CC2650 Sensor Tag.

## Before you start

The CLI app will assume to be running in an armhf environment (i.e. a Raspberry Pi), Bluetooth capabilities will not work elsewhere.

Don't forget to register for SDK access at https://sdk.imont.io, and configure gradle accordingly.

## Using the app

1. `./gradlew clean build`
2. Take the archive from `build/distributions` and copy to a Raspberry Pi (or similar)
3. Unzip or untar
4. Go to created folder
4. `./bin/sdk-example-cli-app`


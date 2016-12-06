# IMONT SDK Example CLI Application

A simple app that instantiates the IMONT SDK and a couple of fake devices, to demonstrate the various features available.

## Before you start

Don't forget to place the .jar with the IMONT SDK into the libs/ folder (adjust the path in build.gradle accordingly)

## Writing a driver:

1. Create a new js file in `src/main/resources` (take inspiration from the ones already available)
2. Register it with Lion, i.e.: `lion.getDriverManager().registerDriver(Main.class.getClassLoader().getResource("drivers/my-driver.js"))` (make sure you do this before `start()` is invoked)
3. Register a new device `lion.registerDevice("your:device:id", new DriverSpec("$network", "$manufacturer", "$model", "$hwVersion"));`
4. Voila!

## Using the app

1. `./gradlew clean build`
2. Go to `build/distributions`
3. Unzip or untar the generated archive
4. Go to created folder
4. `./bin/sdk-example-cli-app`


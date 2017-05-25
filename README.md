* Backend repository here: https://github.com/futurice/wappuapp-backend

# Whappu app

![](docs/logo.png)

> An event app similar to a festival app, which helps students of TTY(Tampere University of Technology) and Otaniemi to find events and celebrate between 19th April - 1st May.

### Download the App
* [App Store](https://itunes.apple.com/fi/app/whappu/id1096655903?mt=8)
* [Play Store](https://play.google.com/store/apps/details?id=com.wappuapp)

### Features:
* Low-effort user registration
* Feed with images and text
* Radio streaming
* Event Calendar
* Event Map
* Vibe Meter and Charts
* Scoreboard
* Event links

### Short facts:
* React Native + Redux
* iOS and Android

- Whappu 2017 architectural updates
  - Selectors with [reselect](https://github.com/reactjs/reselect/) to access store
  - Redux architecture using [ducks](https://github.com/erikras/ducks-modular-redux). See `/app/concepts`
  - Data processing in concepts and minimize logic in views

## Release

### iOS

* Make sure you have latest App Store provisioning profile installed
* Package production script bundle with `npm run release:ios`
* In XCode project settings, bump Version field
* Choose `Generic iOS Device` (or a connected iPhone) as build target
* Run `Product > Clean` (for paranoia) and `Product > Archive`
* Go to `Window > Organizer`, select latest build with correct version and press Upload to App Store

### Android

* Setup Android environment: https://facebook.github.io/react-native/docs/android-setup.html#content
* Copy `whappu-release.keystore` under `android/app` if it's not there already.
* Bump `versionCode` and `versionName` in `android/app/build.gradle`
* `cd android && ./gradlew assembleRelease --no-daemon`
* Built .apk is saved to `android/app/build/outputs/apk`

## Local development

**BEFORE JUMPING TO IOS OR ANDROID GUIDE, FOLLOW THESE GUIDES:**

* https://facebook.github.io/react-native/docs/getting-started.html
* (Optional) https://facebook.github.io/react-native/docs/debugging.html#content
* `npm install` (you might need to use npm@2 version)
* `npm dedupe` (maybe necessary if you encounter Namespace collision error)
* `cp env.example.js env.js` and fill in the blank secrets in the file

### iOS

The xcode-project is expecting that you have nvm installed. It can be reconfigured in
`Build Phases > Bundle React Native code and images`.

- [Install Cocoapods](https://guides.cocoapods.org/using/getting-started.html#installation)
- `cd ios && pod install`
- `open wappuapp.xcworkspace`

  **Note:** Use the .xworkspace instead of .xcodeproj!

### Android

- Android Emulator suggestion: install and start [Genymotion](https://www.genymotion.com)
- Or connect your Android device with usb cable
- `react-native run-android`

### Common problems

Try these:

* Google: e.g. `react native Naming collision detected` almost always provides
useful resources to fix problems
* Search [react-native issues](https://github.com/facebook/react-native)
* Search from the react native component's issues

- `error: /Users/user/code/wappuapp/wappuapp-client/node_modules/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf: No such file or directory`
  - Download the from [here](https://github.com/oblador/react-native-vector-icons/raw/master/Fonts/MaterialCommunityIcons.ttf) and move it to `/node_modules/react-native-vector-icons/Fonts`
- Cmd + R

#### Could not connect to development server

Make sure:

* React native packager is running (`npm start`)
* You have configured React native correctly: https://facebook.github.io/react-native/docs/getting-started.html
* Your mobile phone is connected to same wifi as your computer

#### Loading from <your-ip>:8081...

Stuck at the white screen? It may take even minutes to do the initial load..

#### Error: Naming collision detected

Try to run `npm dedupe`.


#### Can't find 'node' binary to build React Native bundle

At least `nvm` causes this. Change Build Phases -> Bundle React Native code and images to:

```
export NODE_BINARY=node
. ~/.nvm/nvm.sh  # add this
nvm use 4        # add this (or whatever node version you are using)
../node_modules/react-native/packager/react-native-xcode.sh
```

#### Websocket connection failed

Setup your IP address for debugging https://facebook.github.io/react-native/docs/debugging.html#content

#### jsSchedulingOverhead (-48ms) should be positive

Issue: https://github.com/facebook/react-native/issues/1598
Do this: https://github.com/facebook/react-native/issues/1598#issuecomment-172890857

## Contributing

Found a bug? Can't live without a feature? Submit a pull request, or if you want to get paid, [apply for a job at Futurice](http://futurice.com/careers) in Tampere, Helsinki, Stockholm, London, Berlin, or Munich.

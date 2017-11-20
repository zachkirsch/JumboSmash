## JumboSmash

[![Build Status](https://travis-ci.com/zachkirsch/JumboSmash.svg?token=xAap1Kz9FJ82yigUmRZS&branch=develop)](https://travis-ci.com/zachkirsch/JumboSmash)

This is the repository for the 2017-2018 JumboSmash React Native App. If you
haven't dealt with React Native before, you should walk through the
[tutorial](https://facebook.github.io/react-native/releases/next/docs/tutorial.html)
(React knowledge is not a prerequisite).

Other important things to check out:
  - [Typescript](https://www.typescriptlang.org/docs/home.html) and [ES6](https://babeljs.io/learn-es2015/)
  - [Redux](https://redux.js.org)
  - [Redux-Saga](https://redux-saga.js.org)

### Initial Setup (for Mac)

```
brew install node
brew install watchman
npm install -g react-native-cli
npm install -g yarn
```

#### iOS

- Download Xcode and Xcode command line tools. Please follow the directions on
 the [RN
 docs](https://facebook.github.io/react-native/releases/next/docs/getting-started.html#command-line-tools).

#### Android

 - [Download JDK 8 or newer](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
 - Download Android Studio and relevant SDKs. Please follow the directions on
  the [RN docs](https://facebook.github.io/react-native/releases/next/docs/getting-started.html#1-install-android-studio).
 - Install an Android Virtual Device. Please follow the directions on the [RN
 docs](https://facebook.github.io/react-native/releases/next/docs/getting-started.html#using-a-virtual-device). You'll have to create a dummy project in
 Android Studio to be able to see the virtual devices icon in the toolbar.
 You'll also probably have to install [HAXM](https://software.intel.com/en-us/android/articles/installation-instructions-for-intel-hardware-accelerated-execution-manager-mac-os-x).
 - Set up environment:
   ```
   cat <<-"EOT" >> $HOME/.bash_profile
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   EOT
   source $HOME/.bash_profile
   ```

### Run the App

First, clone this repository.

```
git clone git@github.com:zachkirsch/JumboSmash.git
cd JumboSmash
yarn install
```

The app needs to be compiled to Javascript (from Typescript) to function. You can do this
by running `yarn build`. You can instead run `yarn watch` to build and watch for changes to the
typescript, and automatically compile to javascript when necessary.

Running the app via one of the commands below will open a new window to run the packager
(if it's not already running)

#### iOS

For iOS, the simulator does not have to already be running. If it's not, running this command will launch the simulator.

```
yarn run ios
```

#### Android

For Android, the simulator must already be running.

```
yarn run android
```

### Run Tests

```
yarn test
```

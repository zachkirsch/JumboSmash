## JumboSmash

This is the repository for the 2017-2018 JumboSmash React Native App. If you
haven't dealt with React Native before, you should walk through the
[tutorial](https://facebook.github.io/react-native/releases/next/docs/tutorial.html)
(React knowledge is not a prerequisite).

### Initial Setup (for Mac)

```bash
brew install node
brew install watchman
npm install -g react-native-cli
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
   ```bash
   cat <<-"EOT" >> $HOME/.bash_profile
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   EOT
   source $HOME/.bash_profile
   ```

### Run the App

First, clone this repository.

```bash
git clone git@github.com:zachkirsch/JumboSmash.git
```

Running the app will:
  1. Open a new window to run the packager (if it's not already running)
  2. Keep the current window watching for changes to the typescript, and it will
     automatically compile to javascript when necessary

#### iOS

For iOS, the simulator does not have to already be running.

```bash
npm run ios
```

#### Android

For Android, the simulator must already be running.

```bash
npm run android
```

### Run Tests

```bash
npm run test
```

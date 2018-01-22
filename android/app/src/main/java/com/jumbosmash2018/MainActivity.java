package com.jumbosmash2018;

import com.facebook.react.ReactActivity;
import android.os.Bundle;

import com.facebook.common.logging.FLog;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "JumboSmash";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      Fabric.with(this, new Crashlytics());
      FLog.setLoggingDelegate(ReactNativeFabricLogger.getInstance());
    }
}

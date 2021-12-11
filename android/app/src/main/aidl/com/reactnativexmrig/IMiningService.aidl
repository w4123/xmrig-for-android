// IMiningService.aidl
package com.reactnativexmrig;

interface IMiningService {
    /**
     * Demonstrates some basic types that you can use as parameters
     * and return values in AIDL.
     */
    void startMiner(String config);
    void stopMiner();
}
package com.xmrigforandroid

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.FileObserver
import android.os.IBinder
import android.os.RemoteException
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.xmrigforandroid.data.serialization.Configuration
import com.xmrigforandroid.utils.XMRigConfigBuilder
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import org.greenrobot.eventbus.EventBus
import org.greenrobot.eventbus.Subscribe
import org.greenrobot.eventbus.ThreadMode
import java.lang.Exception
import com.facebook.react.bridge.ReactMethod
import com.xmrigforandroid.events.MinerStartEvent
import com.xmrigforandroid.events.MinerStopEvent
import com.xmrigforandroid.events.StdoutEvent
import java.io.File
import java.util.*


class XMRigForAndroid(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    var miningService:IMiningService? = null
    val configBuilder = XMRigConfigBuilder(this.reactApplicationContext.applicationContext)
    var isMining = false

    private val serverConnection = object: ServiceConnection {
        override fun onServiceConnected(className: ComponentName?, service: IBinder?) {
            miningService = IMiningService.Stub.asInterface(service)
        }
        override fun onServiceDisconnected(className: ComponentName?) {
            miningService = null
        }
    };

    init {
        val intent = Intent(context, MiningService::class.java)
        context.bindService(intent, serverConnection, Context.BIND_AUTO_CREATE)
        context.startForegroundService(intent)
    }

    private val fileObserver: FileObserver = object : FileObserver(File(configBuilder.getConfigPath()), FileObserver.MODIFY) {
        override fun onEvent(event: Int, path: String?) {
            Log.d("FileObserver", "fileObserver: ${event} ${path} | isMining: ${isMining}")
            if (!isMining)  {
                return
            }
            val payload = Arguments.createMap()
            payload.putString("config", configBuilder.readConfigFromDisk())
            reactApplicationContext
                    .getJSModule(RCTDeviceEventEmitter::class.java)
                    .emit("onConfigUpdate", payload)
        }
    }

    @Subscribe(threadMode = ThreadMode.ASYNC)
    fun onMessageEvent(event: StdoutEvent) {
        Log.d(this.name, "event name: " + event.javaClass.simpleName)
        val payload = Arguments.createMap()
        val strArr = arrayOf(event.value)
        payload.putArray("log", Arguments.fromArray(strArr))
        reactApplicationContext
                .getJSModule(RCTDeviceEventEmitter::class.java)
                .emit("onLog", payload)
    }

    @Subscribe(threadMode = ThreadMode.ASYNC)
    fun onMinerStartEvent(event: MinerStartEvent) {
        Log.d(this.name, "event name: " + event.javaClass.simpleName)
        this.isMining = true
    }

    @Subscribe(threadMode = ThreadMode.ASYNC)
    fun onMinerStopEvent(event: MinerStopEvent) {
        Log.d(this.name, "event name: " + event.javaClass.simpleName)
        this.isMining = false
    }

    @ReactMethod
    fun start(configurationJSON: String) {
        fileObserver.startWatching()
        val jsonFormat = Json { explicitNulls = false }
        val data = jsonFormat.decodeFromString<Configuration>(configurationJSON)

        Log.d(this.name, "Start XMRig (${data.xmrig_fork.toString().lowercase(Locale.getDefault())}) $configurationJSON")

        //val configBuilder = XMRigConfigBuilder(this.reactApplicationContext.applicationContext)
        configBuilder.reset()
        configBuilder.setConfiguration(data)
        val configPath = configBuilder.writeConfig()
        Log.d(this.name, configBuilder.getConfigString())
        try {
            miningService?.startMiner(configPath, data.xmrig_fork.toString())
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun stop() {
        Log.d(this.name, "Stop has benn called from RN")
        try {
            miningService?.stopMiner()
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun availableProcessors(promise: Promise) {
        Log.d(this.name, "availableProcessors=" + Runtime.getRuntime().availableProcessors().toString())
        try {
            val availableProcessors = Integer.valueOf(Runtime.getRuntime().availableProcessors())
            promise.resolve(availableProcessors)
        } catch (e: Exception) {
            promise.reject("Runtime.getRuntime().availableProcessors()", e)
        }
    }

    override fun getName(): String {
        return "XMRigForAndroid";
    }

    override fun initialize() {
        super.initialize()
        EventBus.getDefault().register(this)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        EventBus.getDefault().unregister(this)
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }


}
package com.xmrigforandroid.services

import android.app.Service
import android.content.Intent
import android.os.CountDownTimer
import android.os.IBinder
import android.util.Log
import androidx.work.*
import com.xmrigforandroid.workers.ThermalWorker

class ThermalService : Service() {

    val thermalWorkRequest: OneTimeWorkRequest.Builder = OneTimeWorkRequestBuilder<ThermalWorker>()

    val updateTimer = object: CountDownTimer(5000, 5000) {
        override fun onTick(millisUntilFinished: Long) {
        }

        override fun onFinish() {
            Log.d(ThermalService.LOG_TAG, "updateTimer")
            WorkManager.getInstance(applicationContext).enqueue(thermalWorkRequest.build())
            this.start()
        }
    }

    init {
        updateTimer.start()
    }

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    companion object {
        private val LOG_TAG = "XMRigAPIService"
        var IS_SERVICE_RUNNING = false
    }
}
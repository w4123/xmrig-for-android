package com.xmrigforandroid.utils

import java.io.RandomAccessFile
import java.io.File

class CPUTemperatureService {
    companion object {
        var tempPath: String = ""
        fun searchCpuTemperature(): String {
            val dirs = File("/sys/devices/virtual/thermal/").listFiles()
            dirs?.forEach {
                try {
                    val typeReader = RandomAccessFile(it.resolve("type"), "r")
                    val typeReaderVal = typeReader.readLine().toString()
                    if (typeReaderVal.lowercase().contains("cpu")) {
                        val reader = RandomAccessFile(it.resolve("temp"), "r")
                        val temp = reader.readLine().toFloat()
                        tempPath = it.resolve("temp").toString()
                        return (temp / 1000.0f).toString()
                    }
                } catch (e: Exception) {

                }
            }
            tempPath = "not_found"
            return "N/A"
        }
        fun getCpuTemperature(): String {
            if (tempPath == "not_found") {
                return "N/A"
            }
            if (tempPath == "") {
                return searchCpuTemperature()
            }
            try {
                val reader = RandomAccessFile(tempPath, "r")
                val temp = reader.readLine().toFloat()
                return (temp / 1000.0f).toString()
            } catch (e: Exception) {

            }
            return "N/A"
        }
    }
}
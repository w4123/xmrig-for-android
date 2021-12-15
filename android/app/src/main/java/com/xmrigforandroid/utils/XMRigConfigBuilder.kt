package com.xmrigforandroid.utils

import android.content.Context
import android.util.Base64
import android.util.Log
import com.xmrigforandroid.data.serialization.Configuration
import com.xmrigforandroid.data.serialization.ConfigurationMode
import com.xmrigforandroid.data.serialization.SimpleConfigurationPropertiesCPU
import com.xmrigforandroid.data.serialization.SimpleConfigurationPropertiesPool
import java.io.*
import java.lang.RuntimeException
import java.lang.StringBuilder
import java.io.File
import java.nio.charset.Charset


class XMRigConfigBuilder(val context: Context) {

    var config: String
    var mContext: Context

    init {
        this.mContext = context
        config = loadConfigTemplate()
    }

    fun reset() {
        config = loadConfigTemplate()
    }

    fun loadConfigTemplate(): String {
        return try {
            val buf = StringBuilder()
            val json = this.context.assets?.open("config.json")
            val inStream = BufferedReader(InputStreamReader(json, "UTF-8"))
            var str: String?
            while (inStream.readLine().also { str = it } != null) {
                buf.append(str)
            }
            inStream.close()
            buf.toString()
        } catch (e: IOException) {
            throw RuntimeException(e)
        }
        finally {
        }
    }

    fun setCPU(data: SimpleConfigurationPropertiesCPU) {
        config = config.replace("{cpu_yield}", if (data.yield) "true" else "false")
        if (data.priority != null) {
            config = config.replace("{cpu_priority}", data.priority.toString())
        } else {
            config = config.replace("{cpu_priority}", "null")
        }
        if (data.max_threads_hint != null) {
            config = config.replace("{max_threads_hint}", data.max_threads_hint.toString())
        }
        if (data.random_x_mode != null) {
            config = config.replace("{random_x_mode}", data.random_x_mode.toString())
        }
    }

    fun setPool(data: SimpleConfigurationPropertiesPool) {
        config = config.replace("{pool_hostname}", data.hostname)
        config = config.replace("{pool_port}", data.port.toString())
        if (data.password != null) {
            config = config.replace("{pool_password}", data.password)
        } else {
            config = config.replace("{pool_password}", "")
        }
        config = config.replace("{ssl_enabled}", if (data.sslEnabled) "true" else "false")
    }

    fun setWallet(wallet: String) {
        config = config.replace("{pool_username}", wallet)
    }

    fun setConfiguration(data: Configuration) {
        if (data.mode == ConfigurationMode.SIMPLE) {
            if (data.properties?.cpu != null) {
                setCPU(data.properties.cpu)
            }
            if (data.properties?.pool != null) {
                setPool(data.properties.pool)
            }
            if (data.properties?.wallet != null) {
                setWallet(data.properties.wallet)
            }
        }
        if (data.mode == ConfigurationMode.ADVANCE) {
            val configByte = Base64.decode(data.config, Base64.DEFAULT)
            config = String(configByte, Charset.defaultCharset())
        }
    }

    fun getConfigString(): String {
        return config
    }

    fun writeConfig(configContent: String? = null, customPath: String? = null): String {
        val privatePath = customPath ?: context.filesDir.absolutePath

        val f = File("$privatePath/config.json")
        Log.d(this.javaClass.name, "Write to $f")
        var writer: PrintWriter? = null

        try {
            writer = PrintWriter(FileOutputStream("$privatePath/config.json"))
            if (configContent != null) {
                writer.write(configContent)
            } else {
                writer.write(config)
            }
        } catch (e: IOException) {
            throw RuntimeException(e)
        } finally {
            writer?.close()
        }
        return f.absoluteFile.toString()
    }

}
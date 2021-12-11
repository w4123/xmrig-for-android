package com.reactnativexmrig.data.serialization

import androidx.annotation.Keep
import kotlinx.serialization.*
import kotlinx.serialization.json.*

@Keep
@Serializable
enum class ConfigurationMode {
    @SerialName("simple") SIMPLE,
    @SerialName("advance") ADVANCE
}

@Keep
@Serializable
enum class RandomXMode {
    @SerialName("auto") AUTO,
    @SerialName("fast") FAST,
    @SerialName("light") LIGHT
}

@Keep
@Serializable
data class SimpleConfigurationPropertiesPool (
        val hostname: String,
        val port: Int,
        val password: String?
)

@Keep
@Serializable
data class SimpleConfigurationPropertiesCPU (
        val yield: Boolean,
        val priority: Int?,
        val max_threads_hint: Int? = 100,
        val random_x_mode: RandomXMode?
)

@Keep
@Serializable
data class ConfigurationProperties(
        val wallet: String?,
        val pool: SimpleConfigurationPropertiesPool?,
        val cpu: SimpleConfigurationPropertiesCPU?
)

@Keep
@Serializable
data class Configuration(
        val id: String,
        val name: String,
        val mode: ConfigurationMode,
        val properties: ConfigurationProperties?,
        val config: String?
)

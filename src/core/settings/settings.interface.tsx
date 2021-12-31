import { Dispatch } from "react";
import { SettingsActionType } from "./settings.actions";

export enum ConfigurationMode {
    SIMPLE = "simple",
    ADVANCE = "advanced"
}
export interface IConfiguratioPropertiesPool {
    hostname?: string;
    port?: number;
    username?: string;
    password?: string;
    sslEnabled?: boolean;
}

export enum RandomXMode {
    AUTO = "auto",
    FAST = "fast",
    LIGHT = "light"
};

export enum XMRigFork {
    ORIGINAL = "original",
    MONEROOCEAN = "moneroocean"
}

export interface IConfiguratioPropertiesCPU {
    yield?: boolean;
    priority?: number;
    max_threads_hint?: number;
    random_x_mode?: RandomXMode;
}
export interface IConfiguratioProperties {
    wallet?: string;
    pool?: IConfiguratioPropertiesPool;
    cpu?: IConfiguratioPropertiesCPU;
}
export interface IConfiguration {
    id?: string;
    name: string;
    mode: ConfigurationMode;
    xmrig_fork: XMRigFork;
}
export interface ISimpleConfiguration extends IConfiguration {
    properties?: IConfiguratioProperties;
}
export interface IAdvanceConfiguration extends IConfiguration {
    config?: string;
}

export type Configuration = ISimpleConfiguration | IAdvanceConfiguration;
export interface ISettings {
    ready: boolean;
    uuid: string;
    configurations: Array<Configuration>;
    selectedConfiguration?: string;
}
export interface ISettingsReducerAction {
    type: SettingsActionType;
    value?: ISettings | string | number | Configuration | string[];
}

export interface ISettingsContext {
    state: ISettings;
    dispatch: Dispatch<ISettingsReducerAction>
}
import { Reducer } from 'react';
import { SettingsActionType } from './settings.actions';
import { defaultConfiguration } from './settings.context';
import { Configuration, ConfigurationMode, IConfiguration, ISettings, ISettingsReducerAction } from './settings.interface';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const SettingsReducer:Reducer<ISettings, ISettingsReducerAction> = (prevState: ISettings, action: ISettingsReducerAction) => {
    console.log("reducer", action);
    switch (action.type) {
        case SettingsActionType.SET:
            return {
                ...action.value as ISettings
            } as ISettings;
        case SettingsActionType.ADD_CONFIGURATION:
            const newConfig: Configuration = (action.value as Configuration).mode === ConfigurationMode.SIMPLE ? 
                {...defaultConfiguration, ...action.value as Configuration} : 
                action.value as Configuration;
            
            return {
                ...prevState,
                configurations: [
                    ...prevState.configurations,
                    {
                        ...newConfig,
                        id: uuidv4()
                    }
                ]
            } as ISettings;
        case SettingsActionType.UPDATE_CONFIGURATION:
            return {
                ...prevState,
                configurations: prevState.configurations.map(config => {
                    if (config.id == (action.value as IConfiguration).id) {
                        return action.value;
                    }
                    return config;
                })
            } as ISettings;
        case SettingsActionType.DELETE_CONFIGURATIONS:
            return {
                ...prevState,
                configurations: prevState.configurations.filter(config => !(action.value as string[]).includes(`${config.id}`))
            } as ISettings;
        case SettingsActionType.SET_SELECTED_CONFIGURAION:
            return {
                ...prevState,
                selectedConfiguration: action.value
            } as ISettings
    }
    return prevState;
};
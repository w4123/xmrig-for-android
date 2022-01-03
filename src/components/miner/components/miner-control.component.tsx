import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { SessionDataContext } from '../../../core/session-data/session-data.context';
import { StartMode, WorkingState } from '../../../core/session-data/session-data.interface';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { Button, Caption, useTheme } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { Configuration } from '../../../core/settings/settings.interface';

export const MinerControl:React.FC<ViewProps> = () => {
    const { colors } = useTheme();

    const { setWorking, workingState } = React.useContext(SessionDataContext);

    const handleStart = React.useCallback(() => setWorking(StartMode.START), []);
    const handleStop = React.useCallback(() => setWorking(StartMode.STOP), []);

    const [ showDropDown, setShowDropDown ] = React.useState(false);
    const { settings, settingsDispatcher } = React.useContext(SettingsContext);
    const [ selectedConfiguration, setSelectedConfiguration ] = React.useState<string | undefined>(settings.selectedConfiguration);
    const selectedConfigurationName = React.useMemo<string | undefined>(() => {
        return settings.configurations.find(config => config.id == settings.selectedConfiguration)?.name
    }, [settings.selectedConfiguration])

    const isStartButtonDisabled = React.useMemo<boolean>(() => workingState != WorkingState.NOT_WORKING && (selectedConfiguration != null || selectedConfiguration != undefined), [workingState]);
    const isStopButtonDisabled = React.useMemo<boolean>(() => workingState == WorkingState.NOT_WORKING, [workingState]);
    
    React.useEffect(() => settingsDispatcher({
        type: SettingsActionType.SET_SELECTED_CONFIGURAION,
        value: selectedConfiguration
    }), [selectedConfiguration]);

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.dropdownContainer}>
                    {workingState == WorkingState.NOT_WORKING && 
                        <DropDown
                            label={"Configurations"}
                            mode="flat"
                            value={settings.selectedConfiguration}
                            setValue={value => setSelectedConfiguration(value)}
                            list={settings.configurations.map((item: Configuration) => ({
                                label: `${item.name}`,
                                value: `${item.id}`
                            }))}
                            visible={showDropDown}
                            showDropDown={() => setShowDropDown(true)}
                            onDismiss={() => setShowDropDown(false)}
                        />
                    }
                    {workingState == WorkingState.MINING &&
                        <Caption>Using configuration: {selectedConfigurationName}</Caption>
                    }
                    {!settings.selectedConfiguration && <Caption>Please select a Configuration to start mining.</Caption>}
                </View>
                <View style={styles.buttonsContainer}>
                    <Button mode="contained" style={{flex: 1, marginRight: 10}} color={colors.primary} disabled={isStartButtonDisabled} onPress={handleStart}>Start</Button>
                    <Button mode="contained" style={{flex: 1, marginLeft: 10}} color={colors.error} disabled={isStopButtonDisabled} onPress={handleStop}>Stop</Button>
                </View>
            </View>
        </View>   
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 0
    },
    subContainer: {
        flexDirection: 'column',
        flex: 1
    },
    dropdownContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
    },
    buttonIcon: {
        width: 38,
        height: 38
    }
});
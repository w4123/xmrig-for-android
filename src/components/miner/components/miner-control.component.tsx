import _ from 'lodash';
import React from 'react';
import {
  StyleSheet, View, ViewProps, Text,
} from 'react-native';
import {
  Button, Paragraph, useTheme,
} from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { useToast } from 'react-native-paper-toast';
import { SessionDataContext } from '../../../core/session-data/session-data.context';
import { StartMode, WorkingState } from '../../../core/session-data/session-data.interface';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { Configuration } from '../../../core/settings/settings.interface';

export const MinerControl:React.FC<ViewProps> = () => {
  const { colors } = useTheme();
  const toaster = useToast();

  const { setWorking, workingState } = React.useContext(SessionDataContext);

  const [showDropDown, setShowDropDown] = React.useState(false);
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const [selectedConfiguration, setSelectedConfiguration] = React.useState<string | undefined>(
    settings.selectedConfiguration,
  );
  const selectedConfigurationName = React.useMemo<string | undefined>(
    () => settings.configurations.find(
      (config) => config.id === settings.selectedConfiguration,
    )?.name,
    [settings.selectedConfiguration],
  );
  const isStartButtonDisabled = React.useMemo<boolean>(
    () => workingState !== WorkingState.NOT_WORKING,
    [workingState],
  );
  const isStopButtonDisabled = React.useMemo<boolean>(
    () => workingState === WorkingState.NOT_WORKING,
    [workingState],
  );

  const handleStart = React.useCallback(() => {
    console.log(settings.selectedConfiguration);
    if (!settings.selectedConfiguration) {
      if (_.isEmpty(settings.configurations)) {
        toaster.show({ message: 'Please add a Configuration Profile from Settings menu', type: 'error', position: 'top' });
      } else {
        toaster.show({ message: 'Please select a Configuration to start mining', type: 'error', position: 'top' });
      }
    } else {
      setWorking(StartMode.START);
    }
  }, [settings]);

  const handleStop = React.useCallback(() => setWorking(StartMode.STOP), []);

  React.useEffect(() => settingsDispatcher({
    type: SettingsActionType.SET_SELECTED_CONFIGURAION,
    value: selectedConfiguration,
  }), [selectedConfiguration]);

  return (
    <View style={styles.container}>
      <View style={[styles.subContainer, { flex: 2, marginRight: 20 }]}>
        <View style={styles.dropdownContainer}>
          {workingState === WorkingState.NOT_WORKING && (
            <DropDown
              label="Configurations"
              mode="flat"
              value={settings.selectedConfiguration}
              setValue={setSelectedConfiguration}
              list={settings.configurations.map((item: Configuration) => ({
                label: `${item.name}`,
                value: `${item.id}`,
              }))}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
            />
          )}
          {workingState === WorkingState.MINING && (
            <Paragraph style={{ height: 60, textAlignVertical: 'center', fontSize: 18 }}>
              Using configuration:
              {' '}
              <Text style={{ fontWeight: 'bold' }}>{selectedConfigurationName}</Text>
            </Paragraph>
          )}
        </View>
      </View>
      <View style={[styles.subContainer, { flex: 1 }]}>
        <View style={{ flex: 1 }}>
          {!isStartButtonDisabled && <Button icon="play" mode="contained" style={{ flex: 1, justifyContent: 'center' }} color={colors.primary} disabled={isStartButtonDisabled} onPress={handleStart}>Start</Button>}
          {!isStopButtonDisabled && <Button icon="stop" mode="contained" style={{ flex: 1, justifyContent: 'center' }} color={colors.error} disabled={isStopButtonDisabled} onPress={handleStop}>Stop</Button>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    padding: 0,
    height: 66,
  },
  subContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  dropdownContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  buttonIcon: {
    width: 38,
    height: 38,
  },
});

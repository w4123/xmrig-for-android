import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { Headline } from 'react-native-paper';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { IPowerSettings } from '../../../core/settings/settings.interface';
import { SettingsPower } from '../containers/configurations/settings-power';

const SettingsScreen:React.FC<ViewProps> = () => {
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);

  const handlePowerUpdate = (data: Partial<IPowerSettings>) => {
    settingsDispatcher({
      type: SettingsActionType.UPDATE,
      value: {
        power: {
          ...settings.power,
          ...data,
        },
      },
    });
  };

  return (
    <SafeAreaView style={styles.layout}>
      <View style={[styles.row, { marginBottom: 0 }]}>
        <Headline style={styles.title}>Settings</Headline>
      </View>

      <SettingsPower powerSettings={settings.power} onUpdate={handlePowerUpdate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    padding: 5,
  },
  title: {
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
});

export default SettingsScreen;

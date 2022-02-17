import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Headline } from 'react-native-paper';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { IPowerSettings, IThermalSettings, ISettings } from '../../../core/settings/settings.interface';
import { SettingsOthers } from '../containers/configurations/settings-others';
import { SettingsPower } from '../containers/configurations/settings-power';
import { SettingsThermal } from '../containers/configurations/settings-thermal';

const SettingsScreen:React.FC<ViewProps> = () => {
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);

  const handleUpdate = (data: Partial<ISettings>) => {
    settingsDispatcher({
      type: SettingsActionType.UPDATE,
      value: data,
    });
  };

  const handlePowerUpdate = (data: Partial<IPowerSettings>) => {
    handleUpdate({
      power: {
        ...settings.power,
        ...data,
      },
    });
  };

  const handleThermalUpdate = (data: Partial<IThermalSettings>) => {
    handleUpdate({
      thermal: {
        ...settings.thermal,
        ...data,
      },
    });
  };

  return (
    <SafeAreaView style={styles.layout}>
      <View style={[styles.row, { marginBottom: 0 }]}>
        <Headline style={styles.title}>Settings</Headline>
      </View>

      <ScrollView>
        <SettingsPower powerSettings={settings.power} onUpdate={handlePowerUpdate} />
        <SettingsThermal thermalSettings={settings.thermal} onUpdate={handleThermalUpdate} />
        <SettingsOthers settings={settings} onUpdate={handleUpdate} />
      </ScrollView>
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

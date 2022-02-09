import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Slider from '@react-native-community/slider';
import {
  Card,
  Paragraph,
  Switch,
  Caption,
  Subheading,
} from 'react-native-paper';
import { IThermalSettings } from '../../../../core/settings/settings.interface';

type SettingsThermalProps = ViewProps & {
    thermalSettings: IThermalSettings;
    onUpdate: (data: Partial<IThermalSettings>) => void;
};

export const SettingsThermal:React.FC<SettingsThermalProps> = ({
  thermalSettings,
  onUpdate,
}) => (
  <Card style={styles.card}>
    <Card.Title title="Thermal Settings" />
    <Card.Content>
      <Caption>Pause / Resume mining based on CPU Temperature to prevent overheating.</Caption>
      <View style={styles.input}>
        <Subheading>Pause mining on</Subheading>
        <View style={styles.intend}>
          <View style={[styles.row, { margin: 0 }]}>
            <Paragraph>CPU is Over Heated</Paragraph>
            <Switch
              value={thermalSettings.pauseOnCPUTemperatureOverHeat}
              onValueChange={(value) => onUpdate({ pauseOnCPUTemperatureOverHeat: value })}
            />
          </View>
          <View style={[styles.row, { margin: 0, alignItems: 'center' }]}>
            <Paragraph style={{ marginRight: 20 }}>Temperature</Paragraph>
            <Slider
              style={{ flex: 1 }}
              minimumValue={10}
              maximumValue={120}
              step={1}
              value={thermalSettings.pauseOnCPUTemperatureOverHeatValue}
              onSlidingComplete={
                (value) => onUpdate({ pauseOnCPUTemperatureOverHeatValue: value })
              }
              disabled={!thermalSettings.pauseOnCPUTemperatureOverHeat}
            />
            <Caption style={{ marginLeft: 20 }}>
              {thermalSettings.pauseOnCPUTemperatureOverHeatValue}
              {' ℃'}
            </Caption>
          </View>
        </View>
      </View>
      <View style={styles.input}>
        <Subheading>Resume mining on</Subheading>
        <View style={styles.intend}>
          <View style={[styles.row, { margin: 0 }]}>
            <Paragraph>CPU Temp is Normal</Paragraph>
            <Switch
              value={thermalSettings.resumeCPUTemperatureNormal}
              onValueChange={(value) => onUpdate({ resumeCPUTemperatureNormal: value })}
            />
          </View>
          <View style={[styles.row, { margin: 0, alignItems: 'center' }]}>
            <Paragraph style={{ marginRight: 20 }}>Temperature</Paragraph>
            <Slider
              style={{ flex: 1 }}
              minimumValue={10}
              maximumValue={120}
              step={1}
              value={thermalSettings.resumeCPUTemperatureNormalValue}
              onSlidingComplete={
                (value) => onUpdate({ resumeCPUTemperatureNormalValue: value })
              }
              disabled={!thermalSettings.resumeCPUTemperatureNormal}
            />
            <Caption style={{ marginLeft: 20 }}>
              {thermalSettings.resumeCPUTemperatureNormalValue}
              {' ℃'}
            </Caption>
          </View>
        </View>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  intend: {
    marginLeft: 10,
  },
  card: {
    margin: 10,
  },
  input: {
    marginVertical: 10,
  },
});

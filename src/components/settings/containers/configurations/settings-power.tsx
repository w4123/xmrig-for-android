import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

import {
  Card,
  Paragraph,
  Switch,
  Caption,
  Subheading,
} from 'react-native-paper';
import { IPowerSettings } from '../../../../core/settings/settings.interface';

type SettingsPowerProps = ViewProps & {
    powerSettings: IPowerSettings;
    onUpdate: (data: Partial<IPowerSettings>) => void;
};

export const SettingsPower:React.FC<SettingsPowerProps> = ({
  powerSettings,
  onUpdate,
}) => (
  <Card style={styles.card}>
    <Card.Title title="Power Settings" />
    <Card.Content>
      <View style={styles.input}>
        <Subheading>Pause mining on</Subheading>
        <View style={styles.intend}>
          <Caption>
            Will pause the miner (sends pause commands via RPC).
            Can resume from same point.
          </Caption>
          <View style={[styles.row, { margin: 0 }]}>
            <Paragraph>Charger Disconnected</Paragraph>
            <Switch
              value={powerSettings.pauseOnChargerDisconnected}
              onValueChange={(value) => onUpdate({ pauseOnChargerDisconnected: value })}
            />
          </View>
          <View style={[styles.row, { margin: 0 }]}>
            <Paragraph>Low Battery</Paragraph>
            <Switch
              value={powerSettings.pauseOnLowBattery}
              onValueChange={(value) => onUpdate({ pauseOnLowBattery: value })}
            />
          </View>
        </View>
      </View>
      <View style={styles.input}>
        <Subheading>Resume mining on</Subheading>
        <View style={styles.intend}>
          <Caption>
            Will resume the miner (sends pause commands via RPC).
            Will resume only if the miner is paused.
          </Caption>
          <View style={[styles.row, { margin: 0 }]}>
            <Paragraph>Charger Connected</Paragraph>
            <Switch
              value={powerSettings.resumeOnChargerConnected}
              onValueChange={(value) => onUpdate({ resumeOnChargerConnected: value })}
            />
          </View>
          <View style={[styles.row, { margin: 0 }]}>
            <Paragraph>Battery Ok</Paragraph>
            <Switch
              value={powerSettings.resumeOnBatteryOk}
              onValueChange={(value) => onUpdate({ resumeOnBatteryOk: value })}
            />
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

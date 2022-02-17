import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Slider from '@react-native-community/slider';
import {
  Card,
  Caption,
  Subheading,
} from 'react-native-paper';
import { ISettings } from '../../../../core/settings/settings.interface';

type SettingsOthersProps = ViewProps & {
    settings: ISettings;
    onUpdate: (data: Partial<ISettings>) => void;
};

export const SettingsOthers:React.FC<SettingsOthersProps> = ({
  settings,
  onUpdate,
}) => (
  <Card style={styles.card}>
    <Card.Title title="Other Settings" />
    <Card.Content>
      <View style={styles.input}>
        <Subheading>Print Time</Subheading>
        <Caption>Print hashrate report every specified number of seconds.</Caption>
        <View style={[styles.row, { margin: 0, alignItems: 'center' }]}>
          <Slider
            style={{ flex: 1 }}
            minimumValue={1}
            maximumValue={600}
            step={10}
            value={settings.printTime}
            onSlidingComplete={
              (value) => onUpdate({ printTime: value })
            }
          />
          <Caption style={{ marginLeft: 20 }}>
            {settings.printTime}
            s
          </Caption>
        </View>
      </View>
      <View style={styles.input}>
        <Subheading>Donate Level</Subheading>
        <Caption>Donate level percentage, min 1% (1 minute in 100 minutes)</Caption>
        <View style={[styles.row, { margin: 0, alignItems: 'center' }]}>
          <Slider
            style={{ flex: 1 }}
            minimumValue={1}
            maximumValue={100}
            step={1}
            value={settings.donation}
            onSlidingComplete={
              (value) => onUpdate({ donation: value })
            }
          />
          <Caption style={{ marginLeft: 20 }}>
            {settings.donation}
            %
          </Caption>
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
  card: {
    margin: 10,
  },
  input: {
    marginVertical: 10,
  },
});

import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Appbar } from 'react-native-paper';
import { version } from '../../version';

type AppHeaderComponentProps = {
    navigation: StackNavigationProp<ParamListBase>;
    back: any;
}

const AppHeaderComponent:React.FC<AppHeaderComponentProps> = ({ navigation, back }) => (
  <Appbar.Header>
    {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
    <Appbar.Content title="XMRig" subtitle="for Android" />
    <Appbar.Content title="Version" subtitle={version} style={{ alignItems: 'flex-end' }} />
  </Appbar.Header>
);

export default AppHeaderComponent;

import React, { useEffect } from 'react';
import {
  Tabs,
  TabScreen,
} from 'react-native-paper-tabs';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';
import { ViewProps } from 'react-native';
import { LazyLoader } from './lazy-loader';
import AppHeader from './app-header';
import ConfigurationEditScreen from '../settings/screens/configuration-edit.screen';

const Stack = createStackNavigator();

const Settings = React.lazy(() => import('../settings/settings-view'));
const Miner = React.lazy(() => import('../miner/miner-view'));

const LazySettings = () => (<LazyLoader><Settings /></LazyLoader>);
const LazyMiner = () => (<LazyLoader><Miner /></LazyLoader>);

const AppTabs:React.FC<ViewProps> = () => (
  <Tabs>
    <TabScreen label="Miner" icon="engine">
      <LazyMiner />
    </TabScreen>
    <TabScreen label="Settings" icon="tune">
      <LazySettings />
    </TabScreen>
  </Tabs>
);

export const AppNavigator:React.FC<ViewProps> = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        // eslint-disable-next-line react/no-unstable-nested-components
        header: ({ navigation, back }) => <AppHeader navigation={navigation} back={back} />,
      }}
    >
      <Stack.Screen name="Main" component={AppTabs} />
      <Stack.Screen name="Configuration" component={ConfigurationEditScreen} getId={({ params }: any) => params.id} />
    </Stack.Navigator>
  );
};

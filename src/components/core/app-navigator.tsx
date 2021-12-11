import React, {useEffect} from 'react';
import {
    Tabs,
    TabScreen
} from 'react-native-paper-tabs';
import SplashScreen from 'react-native-splash-screen';
import { LazyLoader } from './lazy-loader';
import { createStackNavigator } from '@react-navigation/stack';
import { AppHeader } from '..';
import ConfigurationEditScreen from '../settings/screens/configuration-edit.screen';

const Stack = createStackNavigator();

const Settings = React.lazy(() => import('../settings/settings-view'));
const Miner = React.lazy(() => import('../miner/miner-view'));

const LazySettings = () => (<LazyLoader><Settings /></LazyLoader>);
const LazyMiner = () => (<LazyLoader><Miner /></LazyLoader>);

const AppTabs = () => {

    return (
        <Tabs>
            <TabScreen label="Miner" icon="engine">
                <LazyMiner />
            </TabScreen>
            <TabScreen label="Settings" icon="tune">
                <LazySettings />
            </TabScreen>
        </Tabs>
    );
};

export const AppNavigator = () => {

    useEffect(()=>{
        SplashScreen.hide();
      }, []);
      
    return (
        <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
                header: (props) => <AppHeader {...props} />,
            }}
        >
            <Stack.Screen name="Main" component={AppTabs} />
            <Stack.Screen name="Configuration" component={ConfigurationEditScreen} getId={({ params }: any) => params.id} />
        </Stack.Navigator>
    );
};
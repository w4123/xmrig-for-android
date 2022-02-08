import React from 'react';
import { ViewProps } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { LazyLoader } from '../core/lazy-loader';

const ConfigurationsScreen = React.lazy(() => import('./screens/configurations.screen'));
const LazyConfigurationsScreen = () => (<LazyLoader><ConfigurationsScreen /></LazyLoader>);

const SettingsScreen = React.lazy(() => import('./screens/settings.screen'));
const LazySettingsScreen = () => (<LazyLoader><SettingsScreen /></LazyLoader>);

export const TabNavigator: React.FC<ViewProps> = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'configurations', title: 'Configurations', icon: 'cog' },
    { key: 'settings', title: 'Settings', icon: 'tune' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    configurations: LazyConfigurationsScreen,
    settings: LazySettingsScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

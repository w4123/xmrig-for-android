import React from 'react';
import { ViewProps } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { LazyLoader } from '../core/lazy-loader';

const ConfigurationsScreen = React.lazy(() => import('./screens/configurations.screen'));

const LazyConfigurationsScreen = () => (<LazyLoader><ConfigurationsScreen /></LazyLoader>);

export const TabNavigator: React.FC<ViewProps> = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'configurations', title: 'Configurations', icon: 'cog' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    configurations: LazyConfigurationsScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

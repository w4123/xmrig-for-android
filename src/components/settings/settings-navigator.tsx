import React from 'react';
import { LazyLoader } from '../core/lazy-loader';

import { BottomNavigation, } from 'react-native-paper';

const ConfigurationsScreen = React.lazy(() => import('./screens/configurations.screen'));

const LazyConfigurationsScreen = () => (<LazyLoader><ConfigurationsScreen /></LazyLoader>)


export const TabNavigator = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'configurations', title: 'Configurations', icon: 'cog' }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    configurations: LazyConfigurationsScreen
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
import React from 'react';
import { ViewProps } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { LazyLoader } from '../core/lazy-loader';

const MinerScreen = React.lazy(() => import('./screens/advanced/miner.screen'));
const LogScreen = React.lazy(() => import('./screens/advanced/log.screen'));

const LazyMinerScreen = () => (<LazyLoader><MinerScreen /></LazyLoader>);
const LazyLogScreen = () => (<LazyLoader><LogScreen /></LazyLoader>);

export const TabNavigator:React.FC<ViewProps> = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'miner', title: 'Miner', icon: 'engine' },
    { key: 'log', title: 'Log', icon: 'album' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    miner: LazyMinerScreen,
    log: LazyLogScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

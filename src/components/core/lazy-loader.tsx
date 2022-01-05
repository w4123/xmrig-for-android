import React from 'react';
import { ActivityIndicator, Colors, Title } from 'react-native-paper';
import { StyleSheet, View, ViewProps } from 'react-native';
import Shimmer from 'react-native-shimmer';

export const Lazy = (componentImportFn:Function) => React.lazy(async () => {
  const obj = await componentImportFn();
  return typeof obj.default === 'function' ? obj : obj.default;
});

export const SpinnerLayout:React.FC<ViewProps> = () => (
  <View style={styles.spinnerContainer}>
    <ActivityIndicator animating color={Colors.red800} size="large">
      {' '}
    </ActivityIndicator>
    <Shimmer>
      <Title>Loading</Title>
    </Shimmer>
  </View>
);

export const LazyLoader:React.FC = ({ children }) => (
  <React.Suspense fallback={<SpinnerLayout />}>
    {children}
  </React.Suspense>
);

const styles = StyleSheet.create({
  spinnerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
});

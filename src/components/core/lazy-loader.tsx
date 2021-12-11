import React from 'react';
import { ActivityIndicator, Colors, Title } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import Shimmer from 'react-native-shimmer';

export const Lazy = (componentImportFn:Function) => React.lazy(async () => {
    let obj = await componentImportFn()
    return typeof obj.default === 'function' ? obj : obj.default
})

export const SpinnerLayout = () => (
    <View style={styles.spinnerContainer}>
        <ActivityIndicator animating={true} color={Colors.red800} size="large">
            {' '}
        </ActivityIndicator>
        <Shimmer>      
            <Title>Loading</Title>
        </Shimmer>
    </View>
)

export const LazyLoader:React.FC = ({children}) => (
    <React.Suspense fallback={<SpinnerLayout />}>
        {children}
    </React.Suspense>
)

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
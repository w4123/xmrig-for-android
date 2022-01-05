import React from 'react';
import { SafeAreaView } from 'react-native';

import { enableScreens } from 'react-native-screens';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsContextProvider } from './core/settings';
import { AppNavigator } from './components';
import { SessionDataContextProvider } from './core/session-data/session-data.context';

enableScreens(false);

const AppWithSettings:React.FC = () => (
  <SettingsContextProvider>
    <App />
  </SettingsContextProvider>
);

const App = () => (
  <PaperProvider>
    <SessionDataContextProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SessionDataContextProvider>
  </PaperProvider>
);

export default AppWithSettings;

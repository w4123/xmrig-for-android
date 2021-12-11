import React from 'react';
import { SafeAreaView } from 'react-native';

import { SettingsContextProvider, SettingsContext } from './core/settings'
import { AppNavigator } from './components';
import { SessionDataContextProvider } from './core/session-data/session-data.context';

import { enableScreens } from 'react-native-screens';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

enableScreens(false);


const AppWithSettings:React.FC = () => (
  <>
    <SettingsContextProvider>
      <App />
    </SettingsContextProvider>
  </>
);

const App = () => {
  const {settings} = React.useContext(SettingsContext);

  return (
    <PaperProvider>
      <SessionDataContextProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </SessionDataContextProvider>
    </PaperProvider>
  )
}

export default AppWithSettings;
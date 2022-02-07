import React from 'react';
import { SafeAreaView } from 'react-native';
import { ToastProvider } from 'react-native-paper-toast';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsContextProvider } from './core/settings';
import { AppNavigator } from './components';
import { SessionDataContextProvider } from './core/session-data/session-data.context';
import { PowerContextProvider } from './core/power/power.context';
import { LoggerContextProvider } from './core/logger';

enableScreens(false);

const AppWithSettings:React.FC = () => (
  <SettingsContextProvider>
    <App />
  </SettingsContextProvider>
);


const App = () => (
  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
    <PaperProvider>
      <ToastProvider>
        <LoggerContextProvider>
          <PowerContextProvider>
            <SessionDataContextProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </SafeAreaView>
            </SessionDataContextProvider>
          </PowerContextProvider>
        </LoggerContextProvider>
      </ToastProvider>
    </PaperProvider>
  </SafeAreaProvider>
);

export default AppWithSettings;

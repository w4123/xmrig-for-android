import React from 'react';
import { SafeAreaView, StyleSheet, ViewProps } from 'react-native';
import { Provider } from 'react-native-paper';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { ConfigurationsListView } from '../containers/configurations/list-view';
import AddConfigurationsModal from '../modals/add-configuration.modal';

const ConfigurationsScreen:React.FC<ViewProps> = () => {
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);

  const [showAddNewDialogVisible, setShowAddNewDialogVisible] = React.useState<boolean>(false);

  return (
    <Provider>
      <SafeAreaView style={styles.cards}>
        <ConfigurationsListView
          configurations={settings.configurations}
          onAddNew={() => setShowAddNewDialogVisible(true)}
          onDelete={(ids: string[]) => {
            settingsDispatcher({
              type: SettingsActionType.DELETE_CONFIGURATIONS,
              value: ids,
            });
          }}
        />

        <AddConfigurationsModal
          onAdd={(name, mode) => {
            console.log('onAdd', name, mode);
            settingsDispatcher({
              type: SettingsActionType.ADD_CONFIGURATION,
              value: {
                name,
                mode,
              },
            });
          }}
          onClose={() => setShowAddNewDialogVisible(false)}
          isVisible={showAddNewDialogVisible}
        />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    padding: 15,
  },
  cards: {
    flex: 1,
  },
});

export default ConfigurationsScreen;

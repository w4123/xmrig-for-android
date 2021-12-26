import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Caption, Colors, Dialog, Divider, HelperText, Portal, RadioButton, Subheading, TextInput } from 'react-native-paper';
import Shimmer from 'react-native-shimmer';
import { SettingsContext } from '../../../core/settings';
import { ConfigurationMode } from '../../../core/settings/settings.interface';
import { configurationNameValidator, configurationValidator, getConfigurationNameValidator, getConfigurationValidator } from '../../../core/utils/validators';

export type AddConfigurationsModalProps = {
    onAdd: (name: string, mode: ConfigurationMode) => void;
    onClose: () => void;
    isVisible: boolean;
}

const AddConfigurationsModal:React.FC<AddConfigurationsModalProps> = (
    {
        onAdd,
        onClose,
        isVisible=false
    }
) => {

    const {settings, settingsDispatcher} = React.useContext(SettingsContext);
    const existsNames = React.useMemo<string[]>(
        () => settings.configurations.map(c => c.name), [settings.configurations]
    );

    const [name, setName] = React.useState('');
    const [configMode, setConfigMode] = React.useState(ConfigurationMode.SIMPLE);

    const [visible, setVisible] = React.useState(isVisible);

    React.useEffect(() => {
        setVisible(isVisible);
    }, [isVisible]);

    React.useEffect(() => { if (!visible) { onClose() }}, [visible]);

    const isValid = React.useMemo(() => {
        return getConfigurationValidator(existsNames).validate({
            name: name,
            mode: configMode
        }).error == null;
    }, [name, configMode]);

    const hide = (isOk: boolean = false) => {
        if (isOk === true) {
            onAdd(name, configMode);
        }
        setVisible(false);
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hide}>
                <Dialog.Title>New Configuration</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Name"
                        dense
                        placeholder="Friendly name for identification"
                        value={name}
                        onChangeText={text => setName(text)}
                        children={undefined}
                        autoComplete={undefined}
                        error={getConfigurationNameValidator(existsNames).validate(name).error != null}                  
                    />
                    {getConfigurationNameValidator(existsNames).validate(name).error != null && 
                        <HelperText type='error' visible={getConfigurationNameValidator(existsNames).validate(name).error != null}>
                            {getConfigurationNameValidator(existsNames).validate(name).error?.message}
                        </HelperText>
                    }
                    <Divider style={styles.divider} />
                    <Subheading>Editor Mode</Subheading>
                    <RadioButton.Group onValueChange={value => setConfigMode(value as ConfigurationMode)} value={configMode}>
                        <RadioButton.Item label="Simple Mode" value={ConfigurationMode.SIMPLE} style={styles.radioItem} />
                        <RadioButton.Item label="Advance Mode" value={ConfigurationMode.ADVANCE} style={styles.radioItem} />
                    </RadioButton.Group>
                    {configMode == ConfigurationMode.ADVANCE && (
                        <View style={styles.warningContainer}>
                            <Avatar.Icon style={styles.warningIcon} size={24} icon="information-variant" />
                            <Shimmer opacity={0.7}><Caption style={styles.warningText}>Warning for Advance mode: Direct XMRig`s configuration JSON file edit.</Caption></Shimmer>
                        </View>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button disabled={!isValid} mode="contained" onPress={() => hide(true)} icon="check" style={{marginRight: 10}}>Add</Button>
                    <Button onPress={hide} icon="close">Cancel</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        padding: 15
    },
    cards: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    radioItem: {
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    warningText: {
        color: Colors.deepOrange900
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    warningIcon: {
        backgroundColor: Colors.deepOrange900,
        marginRight: 10
    },
    divider: {
        marginBottom: 10,
        marginTop: 15
    }
});

export default AddConfigurationsModal;
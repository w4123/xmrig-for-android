import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Colors, Dialog, Portal } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { IConfiguratioPropertiesPool } from '../../../core/settings/settings.interface';
import { C3Pool, HashVault, IPoolState, MineXMR, MoneroOcean, Nano, SupportXMR, XMRPoolEU } from './pools';

export type PoolListModalProps = {
    onAdd: (pool: IConfiguratioPropertiesPool) => void;
    onClose: () => void;
    isVisible: boolean;
}

const PoolListModal:React.FC<PoolListModalProps> = (
    {
        onAdd,
        onClose,
        isVisible=false
    }
) => {

    const [selected, setSelected] = React.useState<string>();
    const [pool, setPool] = React.useState<IConfiguratioPropertiesPool>({
        hostname: '',
        port: 0,
        username: '',
        password: '',
        sslEnabled: false,
    })

    const onChange = React.useMemo(() => ({
        onChange: (state: IPoolState) => {
            setPool({
                hostname: state.hostname,
                port: state.port,
                username: state.username,
                password: state.password,
                sslEnabled: false,
            })
        }
    }), []);

    const pools = React.useMemo<string[]>(() => [
        'MoneroOcean',
        'MineXMR',
        'SupportXMR',
        'nanopool',
        'C3Pool',
        'xmrpool-eu',
        'HashVault'
    ], []);

    const [visible, setVisible] = React.useState(isVisible);
    const [showDropDown, setShowDropDown] = React.useState(false);

    React.useEffect(() => {
        setVisible(isVisible);
    }, [isVisible]);

    React.useEffect(() => { if (!visible) { onClose() }}, [visible]);

    const hide = (isOk: boolean = false) => {
        if (isOk === true) {
            onAdd(pool);
        }
        setVisible(false);
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hide}>
                <Dialog.Title>Predefinded Pools</Dialog.Title>
                <Dialog.Content>

                    <View style={{ marginBottom: 20}}>
                        <DropDown
                            label={"Pool"}
                            mode="flat"
                            value={selected}
                            setValue={item => setSelected(item)}
                            list={pools.map((item: string) => ({label: item, value: item}))}
                            visible={showDropDown}
                            showDropDown={() => setShowDropDown(true)}
                            onDismiss={() => setShowDropDown(false)}
                        />
                    </View>

                    {selected && selected == 'MoneroOcean' && <MoneroOcean {...onChange} /> }
                    {selected && selected == 'MineXMR' && <MineXMR {...onChange} /> }
                    {selected && selected == 'SupportXMR' && <SupportXMR {...onChange} /> }
                    {selected && selected == 'nanopool' && <Nano {...onChange} /> }
                    {selected && selected == 'C3Pool' && <C3Pool {...onChange} /> }
                    {selected && selected == 'xmrpool-eu' && <XMRPoolEU {...onChange} /> }
                    {selected && selected == 'HashVault' && <HashVault {...onChange} /> }
                    
                </Dialog.Content>
                <Dialog.Actions>
                    <Button  mode="contained" onPress={() => hide(true)} icon="check" style={{marginRight: 10}}>Add</Button>
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

export default PoolListModal;
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, Button, Colors, Dialog, Portal } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { IConfiguratioPropertiesPool } from '../../../core/settings/settings.interface';
import { C3Pool, Hashcity, HashVault, IPoolState, IPredefinedPool, IPredefinedPoolInfo, MineXMR, MoneroOcean, Nano, PredefinedPoolName, predefinedPools, predefinedPoolsList, SupportXMR, XMRPoolEU } from './pools';

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

    const pools = React.useMemo<IPredefinedPool[]>(() => predefinedPoolsList, []);
    const poolInfo = React.useMemo<IPredefinedPoolInfo>(() => predefinedPools[selected as PredefinedPoolName], [selected]);

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
                <Dialog.Title>Pools Presets</Dialog.Title>
                <Dialog.Content>

                    <View style={{ marginBottom: 10}}>
                        <DropDown
                            label={"Pool"}
                            mode="flat"
                            value={selected}
                            setValue={item => setSelected(item)}
                            list={pools.map((item: IPredefinedPool) => ({label: item.info.displayName, value: item.name}))}
                            visible={showDropDown}
                            showDropDown={() => setShowDropDown(true)}
                            onDismiss={() => setShowDropDown(false)}
                        />
                    </View>

                    {poolInfo && (
                        <View style={{marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Badge size={26}>
                                {poolInfo.fee}% fee
                            </Badge>
                            <Badge size={26}>
                                {poolInfo.threshold} XMR min. payout
                            </Badge>
                            <Badge size={26}>
                                {poolInfo.method}
                            </Badge>
                        </View>
                    )}

                    {selected && selected == PredefinedPoolName.MoneroOcean && <MoneroOcean {...onChange} /> }
                    {selected && selected == PredefinedPoolName.MineXMR && <MineXMR {...onChange} /> }
                    {selected && selected == PredefinedPoolName.SupportXMR && <SupportXMR {...onChange} /> }
                    {selected && selected == PredefinedPoolName.nanopool && <Nano {...onChange} /> }
                    {selected && selected == PredefinedPoolName.C3Pool && <C3Pool {...onChange} /> }
                    {selected && selected == PredefinedPoolName.XMRPoolEU && <XMRPoolEU {...onChange} /> }
                    {selected && selected == PredefinedPoolName.HashVault && <HashVault {...onChange} /> }
                    {selected && selected == PredefinedPoolName.Hashcity && <Hashcity {...onChange} /> }
                    
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
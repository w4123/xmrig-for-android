import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { IPool } from '.';
import { validateWalletAddress } from '../../../../core/utils';

const hostname = 'gulf.moneroocean.stream';
const port = 10032;

export const MoneroOcean:React.FC<IPool> = ({onChange}) => {
    const [wallet, setWallet] = React.useState<string>('');
    const [worker, setWorker] = React.useState<string>('');
    const [difficulty, setDifficulty] = React.useState<string>('');

    React.useEffect(() => {
        onChange({
            hostname: hostname,
            port: port,
            username: `${wallet}${difficulty ? '+' : ''}${difficulty}`,
            password: `${worker}`,
        })
    }, [wallet, worker, difficulty]);

    return (
        <>
            <TextInput
                style={styles.input}
                label="Wallet Address"
                dense
                value={wallet}
                onChangeText={setWallet}
                children={undefined}
                autoComplete={undefined}
                error={!validateWalletAddress(wallet)}            
            />
            <TextInput
                style={styles.input}
                label="Worker Name (Optional)"
                placeholder='Worker1'
                dense
                value={worker}
                onChangeText={setWorker}
                children={undefined}
                autoComplete={undefined}                
            />
            <TextInput
                style={styles.input}
                label="Fixed Difficulty (Optional)"
                keyboardType='numeric'
                placeholder='128000'
                dense
                value={difficulty}
                onChangeText={setDifficulty}
                children={undefined}
                autoComplete={undefined}                
            />
        </>
    )
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 20
    }
});

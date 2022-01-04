import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { IPool } from '.';
import { validateWalletAddress } from '../../../../core/utils';

const hostname = 'pool.hashvault.pro';
const port = 80;

export const HashVault:React.FC<IPool> = ({ onChange }) => {
  const [wallet, setWallet] = React.useState<string>('');
  const [worker, setWorker] = React.useState<string>('');

  React.useEffect(() => {
    onChange({
      hostname,
      port,
      username: `${wallet}`,
      password: `${worker}`,
    });
  }, [wallet, worker]);

  return (
    <>
      <TextInput
        style={styles.input}
        label="Wallet Address"
        dense
        value={wallet}
        onChangeText={setWallet}
        error={!validateWalletAddress(wallet)}
      />
      <TextInput
        style={styles.input}
        label="Worker Name (Optional)"
        placeholder="Worker1"
        dense
        value={worker}
        onChangeText={setWorker}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
  },
});

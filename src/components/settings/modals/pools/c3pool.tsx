import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { IPool } from '.';
import { validateWalletAddress } from '../../../../core/utils';

const hostname = 'auto.c3pool.org';
const port = 19999;

export const C3Pool:React.FC<IPool> = ({ onChange }) => {
  const [wallet, setWallet] = React.useState<string>('');
  const [worker, setWorker] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');

  React.useEffect(() => {
    onChange({
      hostname,
      port,
      username: `${wallet}`,
      password: `${worker}${email ? ':' : ''}${email}`,
    });
  }, [wallet, worker, email]);

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
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        label="EMail (Optional)"
        placeholder="example@example.com"
        dense
        value={email}
        onChangeText={setEmail}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
  },
});

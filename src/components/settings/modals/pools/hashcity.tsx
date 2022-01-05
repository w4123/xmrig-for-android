import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { IPool } from '.';

const hostname = 'xmr.hashcity.org';
const port = 4444;

export const Hashcity:React.FC<IPool> = ({ onChange }) => {
  const [username, setUsername] = React.useState<string>('');
  const [worker, setWorker] = React.useState<string>('');

  React.useEffect(() => {
    const tmpWorker = worker.length > 0 ? `.${worker}` : '';

    onChange({
      hostname,
      port,
      username: `${username}${tmpWorker}`,
      password: '',
    });
  }, [username, worker]);

  return (
    <>
      <TextInput
        style={styles.input}
        label="Username"
        dense
        value={username}
        onChangeText={setUsername}
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

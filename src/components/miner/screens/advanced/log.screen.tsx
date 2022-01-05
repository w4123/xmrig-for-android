import React from 'react';
import {
  ScrollView, StyleSheet, View, ViewProps,
} from 'react-native';
import { Button, Headline, Snackbar } from 'react-native-paper';
import Clipboard from '@react-native-community/clipboard';
import { SessionDataContext } from '../../../../core/session-data/session-data.context';
import { StartMode } from '../../../../core/session-data/session-data.interface';
import { XMRigLogView } from '../../containers/xmrig-log';

const LogScreen:React.FC<ViewProps> = () => {
  const { working, minerLog } = React.useContext(SessionDataContext);

  const [snackbarCopyVisible, setSnackbarCopyVisible] = React.useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(minerLog.map((item) => `${item?.ts} ${item?.module} ${item.message}`).join('\n'));
    setSnackbarCopyVisible(true);
  };

  return (
    <View>
      <ScrollView
        nestedScrollEnabled
        style={working === StartMode.STOP ? [styles.layout, styles.hidden] : styles.layout}
      >
        <View style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,
        }}
        >
          <Headline>Miner Log</Headline>
          <Button icon="content-copy" mode="contained" onPress={copyToClipboard}>
            Copy
          </Button>
        </View>
        <XMRigLogView disabled={working === StartMode.STOP} data={minerLog} />
      </ScrollView>
      <Snackbar
        visible={snackbarCopyVisible}
        onDismiss={() => setSnackbarCopyVisible(false)}
        duration={3000}
      >
        The Log has been copied to clipboard.
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    marginHorizontal: 15,
    marginBottom: 10,
    height: '100%',
  },
  hidden: {
    opacity: 1,
  },
});

export default LogScreen;

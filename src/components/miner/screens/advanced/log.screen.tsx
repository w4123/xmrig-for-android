import React from 'react';
import {
  ScrollView, StyleSheet, View, ViewProps,
} from 'react-native';
import Anser from 'anser';
import { useToast } from 'react-native-paper-toast';
import { Button, Headline } from 'react-native-paper';
import Clipboard from '@react-native-community/clipboard';
import { XMRigLogView } from '../../containers/xmrig-log';
import { ILoggerLine, LoggerActionType, LoggerContext } from '../../../../core/logger';

const LogScreen:React.FC<ViewProps> = () => {
  const { loggerState, loggerDispatcher } = React.useContext(LoggerContext);
  const toaster = useToast();

  const scrollViewRef = React.useRef<ScrollView | null>();

  const copyToClipboard = () => {
    Clipboard.setString(loggerState.map((item: ILoggerLine) => `${item.ts} ${Anser.ansiToText(item.message)}`).join('\n'));
    toaster.show({
      message: 'The Log has been copied to clipboard',
      type: 'success',
      position: 'top',
    });
  };

  const clearLog = () => {
    loggerDispatcher({
      type: LoggerActionType.RESET,
    });
  };

  return (
    <View>
      <ScrollView
        style={styles.layout}
        ref={(ref) => { scrollViewRef.current = ref; }}
        onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd({ animated: true })}
      >
        <View style={styles.header}>
          <Headline>Miner Log</Headline>
          <Button icon="content-copy" mode="contained" onPress={copyToClipboard}>
            Copy
          </Button>
          <Button icon="delete" mode="contained" onPress={clearLog}>
            Clear
          </Button>
        </View>
        <XMRigLogView data={loggerState} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    marginHorizontal: 0,
    marginBottom: 10,
    height: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 15,
  },
});

export default LogScreen;

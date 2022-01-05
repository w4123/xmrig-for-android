import React from 'react';
import {
  LayoutChangeEvent, ScrollView, StyleSheet, View,
} from 'react-native';
import { Headline } from 'react-native-paper';
import { SessionDataContext } from '../../../../core/session-data/session-data.context';
import { XMRigView } from '../../containers/xmrig-view';
import { StartMode } from '../../../../core/session-data/session-data.interface';
import { MinerControl } from '../../components/miner-control.component';

const MinerScreen = () => {
  const {
    workingState, minerData, hashrateHistoryRef, working,
  } = React.useContext(SessionDataContext);
  const [sparklineWidth, setSparklineWidth] = React.useState<number>(0);

  return (
    <View>
      <ScrollView
        nestedScrollEnabled
        style={working === StartMode.STOP ? [styles.layout, styles.hidden] : styles.layout}
      >
        <MinerControl />
        <View
          onLayout={(event:LayoutChangeEvent) => setSparklineWidth(event.nativeEvent.layout.width)}
        >
          <Headline>Miner Statistics</Headline>
        </View>
        <XMRigView
          disabled={working === StartMode.STOP}
          workingState={workingState}
          fullWidth={sparklineWidth}
          minerData={minerData}
          hashrateHistory={hashrateHistoryRef}
        />
      </ScrollView>
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

export default MinerScreen;

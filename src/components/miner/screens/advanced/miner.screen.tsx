import React from 'react';
import {
  LayoutChangeEvent, ScrollView, StyleSheet, View,
} from 'react-native';
import { Headline } from 'react-native-paper';
import { Battery } from '@pxblue/react-native-progress-icons';
import { SessionDataContext } from '../../../../core/session-data/session-data.context';
import { XMRigView } from '../../containers/xmrig-view';
import { StartMode } from '../../../../core/session-data/session-data.interface';
import { MinerControl } from '../../components/miner-control.component';
import { PowerContext } from '../../../../core/power/power.context';

const MinerScreen = () => {
  const {
    workingState, minerData, hashrateHistoryRef, working,
  } = React.useContext(SessionDataContext);
  const [sparklineWidth, setSparklineWidth] = React.useState<number>(0);
  const powerContext = React.useContext(PowerContext);

  const battryColor = React.useMemo(() => {
    if (powerContext.batteryLevel > 70) {
      return 'green';
    }
    if (powerContext.batteryLevel > 40) {
      return 'orange';
    }
    return 'red';
  }, [powerContext.batteryLevel]);

  return (
    <View>
      <ScrollView
        nestedScrollEnabled
        style={working === StartMode.STOP ? [styles.layout, styles.hidden] : styles.layout}
      >
        <MinerControl />
        <View
          onLayout={(event:LayoutChangeEvent) => setSparklineWidth(event.nativeEvent.layout.width)}
          style={styles.header}
        >
          <Headline>Miner Statistics</Headline>
          <View>
            <Battery
              percent={powerContext.batteryLevel}
              size={36}
              color={battryColor}
              charging={powerContext.isPowerConnected}
              outlined={false}
            />
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MinerScreen;

import React from 'react';
import {
  LayoutChangeEvent, ScrollView, StyleSheet, View,
} from 'react-native';
import { Headline } from 'react-native-paper';
import { Battery } from '@pxblue/react-native-progress-icons';
import chroma from 'chroma-js';
import Shimmer from 'react-native-shimmer';
import { SessionDataContext } from '../../../../core/session-data/session-data.context';
import { XMRigView } from '../../containers/xmrig-view';
import { StartMode } from '../../../../core/session-data/session-data.interface';
import { MinerControl } from '../../components/miner-control.component';
import { PowerContext } from '../../../../core/power/power.context';

const MinerScreen = () => {
  const {
    workingState, minerData, hashrateTotals, hashrateTotalsMA, working,
  } = React.useContext(SessionDataContext);
  const [sparklineWidth, setSparklineWidth] = React.useState<number>(0);
  const powerContext = React.useContext(PowerContext);

  const battryColor = React.useMemo(() => {
    const cScale = chroma.scale(['red', 'orange', 'green']);
    return cScale(powerContext.batteryLevel / 100).hex();
  }, [powerContext.batteryLevel]);

  const battryLabelColor = React.useMemo(() => {
    const cScale = chroma.scale(['#000000', '#ffffff']).domain([0, 0.7]);
    return cScale(powerContext.batteryLevel / 100).hex();
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
            {powerContext.isPowerConnected && (
              <Shimmer animating intensity={1} duration={3000}>
                <Battery
                  percent={powerContext.batteryLevel}
                  size={50}
                  color={battryColor}
                  charging={powerContext.isPowerConnected}
                  outlined={false}
                  labelColor={battryLabelColor}
                  showPercentLabel={!powerContext.isPowerConnected}
                />
              </Shimmer>
            )}
            {!powerContext.isPowerConnected && (
              <Battery
                percent={powerContext.batteryLevel}
                size={50}
                color={battryColor}
                charging={powerContext.isPowerConnected}
                outlined={false}
                labelColor={battryLabelColor}
                showPercentLabel={!powerContext.isPowerConnected}
              />
            )}
          </View>
        </View>
        <XMRigView
          disabled={working === StartMode.STOP}
          workingState={workingState}
          fullWidth={sparklineWidth}
          minerData={minerData}
          hashrateHistory={hashrateTotals}
          hashrateHistoryMA={hashrateTotalsMA}
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
    alignItems: 'center',
  },
});

export default MinerScreen;

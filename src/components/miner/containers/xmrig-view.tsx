import React from 'react';
import {
  View,
  StyleSheet,
  ViewProps,
} from 'react-native';
import _ from 'lodash';
import prettyBytes from 'pretty-bytes';
// @ts-ignore
import { hashrateToString } from 'hashrate';
import { VictoryArea } from 'victory-native';
import Shimmer from 'react-native-shimmer';
import {
  Title,
  Paragraph,
  Divider,
  ActivityIndicator,
  Switch,
} from 'react-native-paper';
import { IMinerSummary } from '../../../core/hooks';
import { MinerCard } from '../components/miner-card.component';
import { IHashrateHistory } from '../../../core/session-data/session-data.interface';

type XMRigViewProps = ViewProps & {
    hashrateHistory: IHashrateHistory;
    hashrateHistoryMA: IHashrateHistory;
    fullWidth: number;
    minerData: IMinerSummary | null;
    workingState: string;
    disabled: boolean;
}

export const XMRigView:React.FC<XMRigViewProps> = ({
  hashrateHistory,
  hashrateHistoryMA,
  fullWidth,
  minerData,
  workingState,
  disabled,
}) => {
  const [isMovingAverage, setIsMovingAverage] = React.useState<boolean>(false);

  const selectedHashrateHistory = React.useMemo<IHashrateHistory>(
    () => (isMovingAverage ? hashrateHistoryMA : hashrateHistory),
    [isMovingAverage, hashrateHistoryMA, hashrateHistory],
  );

  const RenderHashrateChartVictory = React.useCallback(() => (
    <View style={{ left: 0, bottom: 0, width: fullWidth }}>
      <Shimmer opacity={0.8} tilt={30} direction="left" pauseDuration={2500}>
        <VictoryArea width={fullWidth} padding={0} height={70} data={selectedHashrateHistory.historyCurrent} style={{ data: { fill: 'rgba(134, 65, 244)' } }} interpolation="natural" standalone />
      </Shimmer>
    </View>
  ), [fullWidth, selectedHashrateHistory]);

  const RenderSmallHashrateChartVictory:React.FC<
    {hashrateHistoryData: number[], pauseDuration: number, show?: boolean}
  > = React.useCallback(({ hashrateHistoryData, pauseDuration, show = false }) => (
    <View style={{ width: (fullWidth / 4) - 10, alignSelf: 'stretch' }}>
      {show ? (
        <View style={styles.smallChart}>
          <Shimmer opacity={0.7} tilt={20} direction="left" pauseDuration={pauseDuration}>
            <VictoryArea width={fullWidth / 4} padding={0} height={50} data={hashrateHistoryData} style={{ data: { fill: 'rgba(134, 65, 244)' } }} interpolation="natural" standalone />
          </Shimmer>
        </View>
      ) : (<ActivityIndicator hidesWhenStopped animating={!disabled} color="#8641f4" style={{ paddingTop: 10, alignSelf: 'stretch' }} />)}
    </View>
  ), [fullWidth, selectedHashrateHistory]);

  return (
    <>
      <View style={styles.row}>
        <MinerCard title="Mode" style={{ flex: 2, marginRight: 10 }} disabled={disabled}>
          <Paragraph adjustsFontSizeToFit numberOfLines={1}>{workingState}</Paragraph>
        </MinerCard>
        <MinerCard title="Algo" style={{ flex: 2 }} disabled={disabled}>
          <Paragraph adjustsFontSizeToFit numberOfLines={1}>{minerData?.algo}</Paragraph>
        </MinerCard>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Title>Hashrate</Title>
        <View style={styles.switchRow}>
          <Paragraph style={{ paddingHorizontal: 5 }}>Moving Average</Paragraph>
          <Switch value={isMovingAverage} onValueChange={setIsMovingAverage} disabled={disabled} />
        </View>
      </View>
      <View style={styles.row}>
        <MinerCard
          title="10s"
          style={styles.hashrateCard}
          disabled={disabled}
        >
          <View style={styles.hashrateChartContainer}>
            {(_.last(selectedHashrateHistory.history10s) || 0) > 0 && (
              <Paragraph adjustsFontSizeToFit numberOfLines={1} style={styles.hashrateValue}>
                {hashrateToString(_.last(selectedHashrateHistory.history10s))}
                /s
              </Paragraph>
            )}
            <RenderSmallHashrateChartVictory
              hashrateHistoryData={selectedHashrateHistory.history10s}
              pauseDuration={10 * 1000}
              show={(_.last(selectedHashrateHistory.history10s) || 0) > 0}
            />
          </View>
        </MinerCard>
        <MinerCard
          title="60s"
          style={styles.hashrateCard}
          disabled={disabled}
        >
          <View style={styles.hashrateChartContainer}>
            {(_.last(selectedHashrateHistory.history60s) || 0) > 0 && (
              <Paragraph adjustsFontSizeToFit numberOfLines={1} style={styles.hashrateValue}>
                {hashrateToString(_.last(selectedHashrateHistory.history60s))}
                /s
              </Paragraph>
            )}
            <RenderSmallHashrateChartVictory
              hashrateHistoryData={selectedHashrateHistory.history60s}
              pauseDuration={60 * 1000}
              show={(_.last(selectedHashrateHistory.history60s) || 0) > 0}
            />
          </View>
        </MinerCard>
        <MinerCard
          title="15m"
          style={styles.hashrateCard}
          disabled={disabled}
        >
          <View style={styles.hashrateChartContainer}>
            {(_.last(selectedHashrateHistory.history15m) || 0) > 0 && (
              <Paragraph adjustsFontSizeToFit numberOfLines={1} style={styles.hashrateValue}>
                {hashrateToString(_.last(selectedHashrateHistory.history15m))}
                /s
              </Paragraph>
            )}
            <RenderSmallHashrateChartVictory
              hashrateHistoryData={selectedHashrateHistory.history15m}
              pauseDuration={15 * 6000}
              show={(_.last(selectedHashrateHistory.history15m) || 0) > 0}
            />
          </View>
        </MinerCard>
        <MinerCard
          title="max"
          style={[styles.hashrateCard, { marginRight: 0 }]}
          disabled={disabled}
        >
          <View style={styles.hashrateChartContainer}>
            {(_.last(selectedHashrateHistory.historyMax) || 0) > 0 && (
              <Paragraph adjustsFontSizeToFit numberOfLines={1} style={styles.hashrateValue}>
                {hashrateToString(_.last(selectedHashrateHistory.historyMax))}
                /s
              </Paragraph>
            )}
            <RenderSmallHashrateChartVictory
              hashrateHistoryData={selectedHashrateHistory.historyMax}
              pauseDuration={100000}
              show={(_.last(selectedHashrateHistory.historyMax) || 0) > 0}
            />
          </View>
        </MinerCard>
      </View>
      <View style={styles.row}>
        <MinerCard title="Live Hashrate" style={{ flex: 1 }} disabled={disabled} wrapInContent={false}>
          {selectedHashrateHistory.historyCurrent.length > 2 && <RenderHashrateChartVictory />}
        </MinerCard>
      </View>
      <Divider style={{ marginTop: 2, marginBottom: 10 }} />
      <View style={styles.row}>
        <MinerCard title="Accepted" style={{ flex: 2, marginRight: 10 }} disabled={disabled}>
          <Paragraph adjustsFontSizeToFit numberOfLines={1}>
            {minerData?.results.shares_good}
          </Paragraph>
        </MinerCard>
        <MinerCard title="Difficulty" style={{ flex: 2 }} disabled={disabled}>
          <Paragraph adjustsFontSizeToFit numberOfLines={1}>
            {minerData?.results.diff_current}
          </Paragraph>
        </MinerCard>
      </View>
      <View style={styles.row}>
        <MinerCard title="Threads" style={{ flex: 2, marginRight: 10 }} disabled={disabled}>
          <Paragraph adjustsFontSizeToFit numberOfLines={1}>
            {minerData?.cpu.threads}
          </Paragraph>
        </MinerCard>
        <MinerCard title="Avg Time" style={{ flex: 2 }} disabled={disabled}>
          <Paragraph adjustsFontSizeToFit numberOfLines={1}>
            {minerData?.results.avg_time}
          </Paragraph>
        </MinerCard>
      </View>
      <View style={[styles.row]}>
        <MinerCard title="Free Mem" style={{ flex: 2, marginRight: 10 }} disabled={disabled}>
          <Paragraph adjustsFontSizeToFit numberOfLines={1}>
            {prettyBytes(minerData?.resources.memory.free || 0)}
          </Paragraph>
        </MinerCard>
        <MinerCard title="Res. Mem" style={{ flex: 2 }} disabled={disabled}>
          <Paragraph adjustsFontSizeToFit numberOfLines={1}>
            {prettyBytes(minerData?.resources.memory.resident_set_memory || 0)}
          </Paragraph>
        </MinerCard>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  smallChart: {
    left: 0,
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  hashrateChartContainer: {
    position: 'absolute',
  },
  hashrateValue: {
    textAlign: 'center',
    bottom: 10,
    position: 'absolute',
    alignSelf: 'center',
    color: 'white',
    zIndex: 100,
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  hashrateCard: {
    flex: 2,
    marginRight: 10,
    overflow: 'hidden',
    height: 100,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 0,
    marginRight: 0,
  },
});

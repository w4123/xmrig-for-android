import React from 'react';
import {
  View,
  StyleSheet,
  ViewProps,
  Text,
} from 'react-native';
import { VictoryArea } from 'victory-native';
import Shimmer from 'react-native-shimmer';
import { Title, Paragraph, Divider } from 'react-native-paper';
import { formatHashrate } from '../../../core/utils/formatters';
import { IMinerSummary } from '../../../core/hooks';
import { MinerCard } from '../components/miner-card.component';
import { IHashrateHistory } from '../../../core/session-data/session-data.interface';

type PoolViewProps = ViewProps & {
    hashrateHistory: IHashrateHistory;
    fullWidth: number;
    minerData: IMinerSummary | null;
    workingState: string;
    disabled: boolean;
}

export const XMRigView:React.FC<PoolViewProps> = ({
  hashrateHistory,
  fullWidth,
  minerData,
  workingState,
  disabled,
}) => {
  const RenderHashrateChartVictory = React.useCallback(() => (
    <View style={{ left: 0, bottom: 0, width: fullWidth }}>
      <Shimmer opacity={0.8} tilt={30} direction="left" pauseDuration={2500}>
        <VictoryArea width={fullWidth} padding={0} height={70} data={hashrateHistory.historyCurrent} style={{ data: { fill: 'rgba(134, 65, 244)' } }} interpolation="natural" standalone />
      </Shimmer>
    </View>
  ), [fullWidth, hashrateHistory]);

  const RenderSmallHashrateChartVictory:React.FC<
    {hashrateHistoryData: number[], pauseDuration: number}
  > = React.useCallback(({ hashrateHistoryData, pauseDuration }) => (
    <View style={styles.smallChart}>
      <Shimmer opacity={0.7} tilt={20} direction="left" pauseDuration={pauseDuration}>
        <VictoryArea width={fullWidth / 4} padding={0} height={50} data={hashrateHistoryData} style={{ data: { fill: 'rgba(134, 65, 244)' } }} interpolation="natural" standalone />
      </Shimmer>
    </View>
  ), [fullWidth, hashrateHistory]);

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
      <Title>Hashrate</Title>
      <View style={styles.row}>
        <MinerCard
          title="10s"
          style={{ flex: 2, marginRight: 10, overflow: 'hidden' }}
          disabled={disabled}
        >
          <Paragraph adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center' }}>
            {formatHashrate(minerData?.hashrate.total[0])[0]}
            <Text style={{ fontSize: 11 }}>{` ${formatHashrate(minerData?.hashrate.total[0])[1] || 'H'}/s`}</Text>
          </Paragraph>
          <RenderSmallHashrateChartVictory
            hashrateHistoryData={hashrateHistory.history10s}
            pauseDuration={10 * 1000}
          />
        </MinerCard>
        <MinerCard
          title="60s"
          style={{ flex: 2, marginRight: 10, overflow: 'hidden' }}
          disabled={disabled}
        >
          <Paragraph adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center' }}>
            {formatHashrate(minerData?.hashrate.total[1])[0]}
            <Text style={{ fontSize: 11 }}>{` ${formatHashrate(minerData?.hashrate.total[1])[1] || 'H'}/s`}</Text>
          </Paragraph>
          <RenderSmallHashrateChartVictory
            hashrateHistoryData={hashrateHistory.history60s}
            pauseDuration={60 * 1000}
          />
        </MinerCard>
        <MinerCard
          title="15m"
          style={{ flex: 2, marginRight: 10, overflow: 'hidden' }}
          disabled={disabled}
        >
          <Paragraph adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center' }}>
            {formatHashrate(minerData?.hashrate.total[2])[0]}
            <Text style={{ fontSize: 11 }}>{` ${formatHashrate(minerData?.hashrate.total[2])[1] || 'H'}/s`}</Text>
          </Paragraph>
          <RenderSmallHashrateChartVictory
            hashrateHistoryData={hashrateHistory.history15m}
            pauseDuration={15 * 6000}
          />
        </MinerCard>
        <MinerCard
          title="max"
          style={{ flex: 2, overflow: 'hidden' }}
          disabled={disabled}
        >
          <Paragraph adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center' }}>
            {formatHashrate(minerData?.hashrate.highest)[0]}
            <Text style={{ fontSize: 11 }}>{` ${formatHashrate(minerData?.hashrate.highest)[1] || 'H'}/s`}</Text>
          </Paragraph>
          <RenderSmallHashrateChartVictory
            hashrateHistoryData={hashrateHistory.historyMax}
            pauseDuration={100000}
          />
        </MinerCard>
      </View>
      <View style={styles.row}>
        <MinerCard title="Live Hashrate" style={{ flex: 1 }} disabled={disabled} wrapInContent={false}>
          {hashrateHistory.historyCurrent.length > 2 && <RenderHashrateChartVictory />}
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
            {minerData?.resources.memory.free}
          </Paragraph>
        </MinerCard>
        <MinerCard title="Res. Mem" style={{ flex: 2 }} disabled={disabled}>
          <Paragraph adjustsFontSizeToFit numberOfLines={1}>
            {minerData?.resources.memory.resident_set_memory}
          </Paragraph>
        </MinerCard>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  smallChart: {
    left: -25,
    marginBottom: -15,
    bottom: -5,
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
});

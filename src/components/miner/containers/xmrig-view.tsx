import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { VictoryArea } from 'victory-native';
import Shimmer from 'react-native-shimmer';
import { Pie } from '@pxblue/react-native-progress-icons';
import chroma from 'chroma-js';
import { Title, Paragraph, Divider } from 'react-native-paper';
import { formatHashrate } from '../../../core/utils/formatters';
import { IMinerSummary } from '../../../core/hooks';
import { MinerCard } from '../components/miner-card.component';

const cScale = chroma.scale(['red', 'orange', 'green']).domain([0, 0.3, 1]);
const cLabelScale = chroma.scale(['black', 'white', 'white']).domain([0, 0.3, 1]);

type PoolViewProps = ViewProps & {
    hashrateHistory: number[];
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
        <VictoryArea width={fullWidth} padding={0} height={70} data={hashrateHistory} style={{ data: { fill: 'rgba(134, 65, 244)' } }} interpolation="natural" standalone />
      </Shimmer>
    </View>
  ), [fullWidth, hashrateHistory]);


  const hp10s = React.useMemo(() => {
    const val = minerData?.hashrate.total[0] || 0;
    const max = minerData?.hashrate.highest || 0;
    return (100 / max) * val || 0;
  }, [minerData?.hashrate]);

  const hp60s = React.useMemo(() => {
    const val = minerData?.hashrate.total[1] || 0;
    const max = minerData?.hashrate.highest || 0;
    return (100 / max) * val || 0;
  }, [minerData?.hashrate]);

  const hp15m = React.useMemo(() => {
    const val = minerData?.hashrate.total[2] || 0;
    const max = minerData?.hashrate.highest || 0;
    return (100 / max) * val || 0;
  }, [minerData?.hashrate]);

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
          subTitle={`${formatHashrate(minerData?.hashrate.total[0])[1] || 'H'}/s`}
          style={{ flex: 2, marginRight: 10 }}
          disabled={disabled}
        >
          <Paragraph adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center' }}>
            {formatHashrate(minerData?.hashrate.total[0])[0]}
          </Paragraph>
          <Pie
            color={cScale(hp10s / 100).hex()}
            labelColor={cLabelScale(hp10s / 100).hex()}
            percent={Math.round(hp10s)}
            size={50}
            ring={10}
            showPercentLabel
          />
        </MinerCard>
        <MinerCard
          title="60s"
          subTitle={`${formatHashrate(minerData?.hashrate.total[1])[1] || 'H'}/s`}
          style={{ flex: 2, marginRight: 10 }}
          disabled={disabled}
        >
          <Paragraph adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center' }}>
            {formatHashrate(minerData?.hashrate.total[1])[0]}
          </Paragraph>
          <Pie
            color={cScale(hp60s / 100).hex()}
            labelColor={cLabelScale(hp60s / 100).hex()}
            percent={Math.round(hp60s)}
            size={50}
            ring={10}
            showPercentLabel
          />
        </MinerCard>
        <MinerCard
          title="15m"
          subTitle={`${formatHashrate(minerData?.hashrate.total[2])[1] || 'H'}/s`}
          style={{ flex: 2, marginRight: 10 }}
          disabled={disabled}
        >
          <Paragraph adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center' }}>
            {formatHashrate(minerData?.hashrate.total[2])[0]}
          </Paragraph>
          <Pie
            color={cScale(hp15m / 100).hex()}
            labelColor={cLabelScale(hp15m / 100).hex()}
            percent={Math.round(hp15m)}
            size={50}
            ring={10}
            showPercentLabel
          />
        </MinerCard>
        <MinerCard
          title="max"
          subTitle={`${formatHashrate(minerData?.hashrate.highest)[1] || 'H'}/s`}
          style={{ flex: 2 }}
          disabled={disabled}
        >
          <Paragraph adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center' }}>
            {formatHashrate(minerData?.hashrate.highest)[0]}
          </Paragraph>
        </MinerCard>
      </View>
      <View style={styles.row}>
        <MinerCard title="Live Hashrate" style={{ flex: 1 }} disabled={disabled} wrapInContent={false}>
          {hashrateHistory.length > 2 && <RenderHashrateChartVictory />}
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
});

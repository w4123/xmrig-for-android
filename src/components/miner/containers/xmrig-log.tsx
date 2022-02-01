/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  View, StyleSheet, ViewProps, useWindowDimensions,
} from 'react-native';
import Shimmer from 'react-native-shimmer';
import { AnsiComponent, AnsiComponentProps } from 'react-native-ansi-view';
import { MinerCard } from '../components/miner-card.component';
import { ILoggerLine } from '../../../core/logger';

type LogViewProps = ViewProps & {
    data: ILoggerLine[];
}

type AnsiComponentPropsWithLast = AnsiComponentProps & {
  isLast: Boolean
}

const RenderLogItem: React.FC<AnsiComponentPropsWithLast> = ({ isLast, ...rest }) => {
  if (isLast) {
    return (
      <Shimmer>
        <AnsiComponent {...rest} />
      </Shimmer>
    );
  }
  return <AnsiComponent {...rest} />;
};

export const XMRigLogView:React.FC<LogViewProps> = ({
  data,
}) => {
  const { height } = useWindowDimensions();

  return (
    <View>
      <MinerCard
        style={{ flex: 0, backgroundColor: 'black', minHeight: height - 230 }}
        wrapInContent={false}
      >
        {data.map((value, index) => (
          <RenderLogItem
            textStyle={styles.logTextDefault}
            containerStyle={styles.logContainer}
            ansi={value.message}
            key={`key-${value.id}`}
            isLast={index === data.length - 1}
          />
        ))}
      </MinerCard>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 0,
    backgroundColor: 'black',
    color: 'white',
  },
  module: {
    alignSelf: 'center',
  },
  logContainer: {
    backgroundColor: 'black',
    paddingVertical: 2,
  },
  logTextDefault: {
    color: 'white',
    fontSize: 13,
  },
});

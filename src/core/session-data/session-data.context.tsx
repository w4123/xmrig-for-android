import React from 'react';
import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';
import cloneDeep from 'lodash/fp/cloneDeep';
import * as JSON5 from 'json5';
import { IMinerSummary, useMinerHttpd, useHashrateHistory } from '../hooks';
import {
  StartMode, IXMRigLogEvent, WorkingState, IHashrateHistory,
} from './session-data.interface';
import { SettingsActionType, SettingsContext } from '../settings';
import { cleanAnsiLogLineRegex, filterLogLineRegex } from '../utils/parsers';
import { Configuration, ConfigurationMode, ISimpleConfiguration } from '../settings/settings.interface';
import ConfigBuilder from '../xmrig-config/config-builder';
import { LoggerContext } from '../logger';

const { XMRigForAndroid } = NativeModules;

const configBuilder = new ConfigBuilder();

type SessionDataContextType = {
  working: StartMode,
  workingState: string,
  minerData: IMinerSummary | null,
  setWorking: Function,
  hashrateTotals: IHashrateHistory,
}

// @ts-ignore
export const SessionDataContext:React.Context<SessionDataContextType> = React.createContext();

export const SessionDataContextProvider:React.FC = ({ children }) => {
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const { log } = React.useContext(LoggerContext);

  const hashrateHistory = useHashrateHistory([0, 0]);
  const hashrateHistory10s = useHashrateHistory([0, 0]);
  const hashrateHistory60s = useHashrateHistory([0, 0]);
  const hashrateHistory15m = useHashrateHistory([0, 0]);
  const hashrateHistoryMax = useHashrateHistory([0, 0]);

  const [working, setWorking] = React.useState<StartMode>(StartMode.STOP);

  const [workingState, setWorkingState] = React.useState<WorkingState>(WorkingState.NOT_WORKING);

  const { minerStatus, minerData } = useMinerHttpd(50080);

  React.useEffect(() => {
    if (!Number.isNaN(parseFloat(`${minerData?.hashrate.total[0]}`))) {
      hashrateHistory.add(parseFloat(`${minerData?.hashrate.total[0]}`));
    }
    if (!Number.isNaN(parseFloat(`${minerData?.hashrate.total[0]}`))) {
      hashrateHistory10s.add(parseFloat(`${minerData?.hashrate.total[0]}`));
    }
    if (!Number.isNaN(parseFloat(`${minerData?.hashrate.total[1]}`))) {
      hashrateHistory60s.add(parseFloat(`${minerData?.hashrate.total[1]}`));
    }
    if (!Number.isNaN(parseFloat(`${minerData?.hashrate.total[2]}`))) {
      hashrateHistory15m.add(parseFloat(`${minerData?.hashrate.total[2]}`));
    }
    if (!Number.isNaN(parseFloat(`${minerData?.hashrate.highest}`))) {
      hashrateHistoryMax.add(parseFloat(`${minerData?.hashrate.highest}`));
    }
  }, [minerData]);

  React.useEffect(() => {
    if (minerStatus) {
      setWorkingState(WorkingState.MINING);
    }
    if (!minerStatus && workingState === WorkingState.MINING) {
      setWorking(StartMode.STOP);
    }
  }, [minerStatus]);

  React.useEffect(() => {
    switch (working) {
      case StartMode.START:
        setWorkingState(WorkingState.MINING);
        if (settings.selectedConfiguration) {
          const cConfig:Configuration | undefined = settings.configurations.find(
            (config) => config.id === settings.selectedConfiguration,
          );
          if (cConfig) {
            const configCopy:Configuration = cloneDeep(cConfig);

            if (configCopy && configCopy.mode === ConfigurationMode.SIMPLE) {
              configBuilder.reset();
              configBuilder.setPool({
                user: (configCopy as ISimpleConfiguration).properties?.pool?.username,
                pass: (configCopy as ISimpleConfiguration).properties?.pool?.password,
                url: `${(configCopy as ISimpleConfiguration).properties?.pool?.hostname}:${(configCopy as ISimpleConfiguration).properties?.pool?.port}`,
                tls: (configCopy as ISimpleConfiguration).properties?.pool?.sslEnabled,
              });
              configBuilder.setProps({
                cpu: {
                  priority: (configCopy as ISimpleConfiguration).properties?.cpu?.priority,
                  yield: (configCopy as ISimpleConfiguration).properties?.cpu?.yield,
                  'max-threads-hint': (configCopy as ISimpleConfiguration).properties?.cpu?.max_threads_hint,
                },
                randomx: {
                  mode: (configCopy as ISimpleConfiguration).properties?.cpu?.random_x_mode,
                },
              });
              configBuilder.setProps({
                cpu: {
                  ...(configCopy as ISimpleConfiguration).properties?.algos,
                },
              });
              configBuilder.setProps({
                'algo-perf': (configCopy as ISimpleConfiguration).properties?.algo_perf,
              });
            }
            if (configCopy && configCopy.mode === ConfigurationMode.ADVANCE) {
              configBuilder.setConfig(JSON5.parse(configCopy.config || '{}'));
              configBuilder.setProps({
                http: {
                  enabled: true,
                  host: '127.0.0.1',
                  port: 50080,
                  'access-token': null,
                  restricted: true,
                },
                background: false,
                colors: true,
              });
            }

            const sendConfiguration = {
              id: cConfig.id,
              name: cConfig.name,
              mode: cConfig.mode,
              xmrig_fork: cConfig.xmrig_fork,
              config: configBuilder.getConfigBase64(),
            };

            console.log(sendConfiguration);
            XMRigForAndroid.start(
              JSON.stringify(
                sendConfiguration,
                // eslint-disable-next-line consistent-return
                (k, v) => {
                  if (v !== null) return v;
                },
              ),
            );
          }
        }
        break;
      case StartMode.STOP:
        setWorkingState(WorkingState.NOT_WORKING);
        XMRigForAndroid.stop();
        break;
      default:
    }
  }, [working]);

  React.useEffect(() => {
    const configbuilder = new ConfigBuilder();
    console.log('ConfigBuilder', configbuilder);

    const MinerEmitter = new NativeEventEmitter(XMRigForAndroid);

    const onLogSub:EmitterSubscription = MinerEmitter.addListener('onLog', (data:IXMRigLogEvent) => {
      const cleanData = [...data.log.filter((item) => !filterLogLineRegex.test(item))];
      cleanData.forEach((itemLog) => log(itemLog.replace(cleanAnsiLogLineRegex, '$2').toString()));
    });

    const onConfigUpdateSub:EmitterSubscription = MinerEmitter.addListener('onConfigUpdate', (data) => {
      console.log('onConfigUpdate', data.config);
      const cConfig:Configuration | undefined = settings.configurations.find(
        (config) => config.id === settings.selectedConfiguration,
      );
      if (cConfig && cConfig.mode === ConfigurationMode.SIMPLE) {
        try {
          const parsedConfig = JSON.parse(data.config);
          console.log('parsedConfig', parsedConfig);
          settingsDispatcher({
            type: SettingsActionType.UPDATE_CONFIGURATION,
            value: {
              ...cConfig,
              properties: {
                ...(cConfig as ISimpleConfiguration).properties,
                algo_perf: parsedConfig['algo-perf'],
              },
            },
          });
        } catch (e) {
          console.log('ERROR PARSE ALGO PERF', e);
        }
      }
      if (cConfig && cConfig.mode === ConfigurationMode.ADVANCE) {
        settingsDispatcher({
          type: SettingsActionType.UPDATE_CONFIGURATION,
          value: {
            ...cConfig,
            config: data.config,
          },
        });
      }
    });

    return () => {
      onLogSub.remove();
      onConfigUpdateSub.remove();
      XMRigForAndroid.stop();
    };
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <SessionDataContext.Provider value={{
      working,
      workingState,
      minerData,
      setWorking,
      hashrateTotals: {
        historyCurrent: hashrateHistory.history,
        history10s: hashrateHistory10s.history,
        history60s: hashrateHistory60s.history,
        history15m: hashrateHistory15m.history,
        historyMax: hashrateHistoryMax.history,
      },
    }}
    >
      {children}
    </SessionDataContext.Provider>
  );
};

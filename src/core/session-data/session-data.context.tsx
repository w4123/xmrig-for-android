import React from 'react';
import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';
import cloneDeep from 'lodash/fp/cloneDeep';
import * as JSON5 from 'json5';
import { IMinerSummary, useMinerHttpd, useHashrateHistory, useInterval } from '../hooks';
import {
  StartMode, IXMRigLogEvent, WorkingState, IHashrateHistory,
} from './session-data.interface';
import { SettingsActionType, SettingsContext } from '../settings';
import { cleanAnsiLogLineRegex, filterLogLineRegex } from '../utils/parsers';
import { Configuration, ConfigurationMode, ISimpleConfiguration } from '../settings/settings.interface';
import ConfigBuilder from '../xmrig-config/config-builder';
import { LoggerContext } from '../logger';
import { PowerContext } from '../power/power.context';

const { XMRigForAndroid } = NativeModules;

const configBuilder = new ConfigBuilder();

type SessionDataContextType = {
  working: StartMode,
  workingState: string,
  minerData: IMinerSummary | null,
  setWorking: Function,
  hashrateTotals: IHashrateHistory,
  hashrateTotalsMA: IHashrateHistory,
  minerActions: {
    pause: () => {},
    resume: () => {},
  },
  CPUTemp: string,
}

// @ts-ignore
export const SessionDataContext:React.Context<SessionDataContextType> = React.createContext();

export const SessionDataContextProvider:React.FC = ({ children }) => {
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const { log } = React.useContext(LoggerContext);
  const { isLowBattery, isPowerConnected } = React.useContext(PowerContext);
  const [CPUTemp, setCPUTemp] = React.useState<string>('N/A');

  const hashrateHistory = useHashrateHistory([0, 0]);
  const hashrateHistory10s = useHashrateHistory([0, 0]);
  const hashrateHistory60s = useHashrateHistory([0, 0]);
  const hashrateHistory15m = useHashrateHistory([0, 0]);
  const hashrateHistoryMax = useHashrateHistory([0, 0]);

  const [working, setWorking] = React.useState<StartMode>(StartMode.STOP);

  const [workingState, setWorkingState] = React.useState<WorkingState>(WorkingState.NOT_WORKING);

  const {
    minerStatus,
    minerData,
    minerPause,
    minerResume,
  } = useMinerHttpd(50080);

  React.useEffect(() => {
    hashrateHistory.add(parseFloat(`${minerData?.hashrate.total[0]}`) || 0);
    hashrateHistory10s.add(parseFloat(`${minerData?.hashrate.total[0]}`) || 0);
    hashrateHistory60s.add(parseFloat(`${minerData?.hashrate.total[1]}`) || 0);
    hashrateHistory15m.add(parseFloat(`${minerData?.hashrate.total[2]}`) || 0);
    hashrateHistoryMax.add(parseFloat(`${minerData?.hashrate.highest}`) || 0);

    if (minerData?.paused) {
      setWorkingState(WorkingState.PAUSED);
    } else {
      setWorkingState(WorkingState.MINING);
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
        hashrateHistory.reset();
        hashrateHistory10s.reset();
        hashrateHistory60s.reset();
        hashrateHistory15m.reset();
        hashrateHistoryMax.reset();
        break;
      default:
    }
  }, [working]);

  useInterval(async () => setCPUTemp(await XMRigForAndroid.cpuTemperature()), 10000);

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

  React.useEffect(() => {
    if (settings.power.pauseOnLowBattery && isLowBattery === true) {
      minerPause();
    } else if (settings.power.resumeOnBatteryOk && isLowBattery === false) {
      minerResume();
    }
  }, [isLowBattery]);

  React.useEffect(() => {
    if (
      settings.power.resumeOnChargerConnected
      && isPowerConnected === true
      && workingState === WorkingState.PAUSED) {
      minerResume();
    } else if (
      settings.power.pauseOnChargerDisconnected
      && isPowerConnected === false
      && workingState === WorkingState.MINING
    ) {
      minerPause();
    }
  }, [isPowerConnected]);

  React.useEffect(() => {
    if (CPUTemp === 'N/A') {
      return;
    }
    const currTemp = parseFloat(CPUTemp);
    if (!Number.isNaN(currTemp)) {
      if (
        settings.thermal.pauseOnCPUTemperatureOverHeat
        && currTemp > settings.thermal.pauseOnCPUTemperatureOverHeatValue
        && workingState === WorkingState.MINING
      ) {
        minerPause();
      } else if (
        settings.thermal.resumeCPUTemperatureNormal
        && currTemp < settings.thermal.resumeCPUTemperatureNormalValue
        && workingState === WorkingState.PAUSED
      ) {
        minerResume();
      }
    }
  }, [CPUTemp]);

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
      hashrateTotalsMA: {
        historyCurrent: hashrateHistory.sma,
        history10s: hashrateHistory10s.sma,
        history60s: hashrateHistory60s.sma,
        history15m: hashrateHistory15m.sma,
        historyMax: hashrateHistoryMax.sma,
      },
      minerActions: {
        pause: minerPause,
        resume: minerResume,
      },
      CPUTemp,
    }}
    >
      {children}
    </SessionDataContext.Provider>
  );
};

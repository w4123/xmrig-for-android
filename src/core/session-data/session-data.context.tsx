import React from "react";
import { IMinerSummary, useMinerHttpd } from "../hooks";
import { useHashrateHistory } from "../hooks";
import { IMinerLog, StartMode, IXMRigLogEvent, WorkingState } from "./session-data.interface";
import { SettingsActionType, SettingsContext } from "../settings";
import { NativeModules, NativeEventEmitter, EmitterSubscription } from "react-native";
import { filterLogLineRegex, parseLogLine } from "../utils/parsers";
import _ from 'lodash';
import cloneDeep from 'lodash/fp/cloneDeep'

const { XMRigForAndroid } = NativeModules;

import base64 from 'react-native-base64'
import { Configuration, ConfigurationMode, IAdvanceConfiguration, ISimpleConfiguration } from "../settings/settings.interface";


type SessionDataContextType = {
  minerLog: IMinerLog[],
  hashrateHistoryRef: number[],
  working: StartMode,
  workingState: string,
  minerData: IMinerSummary | null,
  setWorking: Function
}

//@ts-ignore
export const SessionDataContext:React.Context<SessionDataContextType> = React.createContext(); 

export const SessionDataContextProvider:React.FC = ({children}) =>  {

  const {settings, settingsDispatcher} = React.useContext(SettingsContext);
  
  const [minerLog, setMinerLog] = React.useState<IMinerLog[]>([]);

  const hashrateHistory = useHashrateHistory([0,0]);
  const hashrateHistoryRef = React.useMemo(() => hashrateHistory.history, [hashrateHistory.history]);

  const [working, setWorking] = React.useState<StartMode>(StartMode.STOP);

  const [workingState, setWorkingState] = React.useState<WorkingState>(WorkingState.NOT_WORKING);

  const { minerStatus, minerData } = useMinerHttpd(50080);

  React.useEffect(() => {
    if (!isNaN(parseFloat(`${minerData?.hashrate.total[0]}`))) {
        hashrateHistory.add(parseFloat(`${minerData?.hashrate.total[0]}`));
    }
  }, [minerData])
  
  React.useEffect(() => {
    if (minerStatus) {
      setWorkingState(WorkingState.MINING);
    }
    if (!minerStatus && workingState == WorkingState.MINING) {
      setWorking(StartMode.STOP);
    }
  }, [minerStatus]);

  React.useEffect(() => {
    switch(working) {
        case StartMode.START:
            setWorkingState(WorkingState.MINING);
            if (settings.selectedConfiguration) {
              const cConfig:Configuration | undefined = settings.configurations.find(
                config => config.id == settings.selectedConfiguration
              );
              if (cConfig) {
                const configCopy:Configuration = cloneDeep(cConfig)
                
                if (configCopy && configCopy.mode == ConfigurationMode.ADVANCE) {
                  (configCopy as IAdvanceConfiguration).config = base64.encode(`${(configCopy as IAdvanceConfiguration)?.config}`);
                }
                
                if (configCopy && configCopy.mode == ConfigurationMode.SIMPLE) {
                  // Temp workaround to use deprecated wallet field as username 
                  if (!(configCopy as ISimpleConfiguration).properties?.pool?.username && (configCopy as ISimpleConfiguration).properties?.wallet) {
                    (configCopy as ISimpleConfiguration).properties = _.merge(
                      (configCopy as ISimpleConfiguration).properties,
                      {
                        pool: {
                          username: (configCopy as ISimpleConfiguration).properties?.wallet
                        }
                      }
                    );
                  }

                  // create algos partial json string from algos obj
                  (configCopy as ISimpleConfiguration).properties = _.merge(
                    (configCopy as ISimpleConfiguration).properties,
                    {
                      algos: JSON.stringify((configCopy as ISimpleConfiguration).properties?.algos)
                    }
                  );
                }
                console.log(cConfig);
                XMRigForAndroid.start(
                  JSON.stringify(
                    configCopy, 
                    (k, v) => {
                      if (v !== null) return v
                    }
                  )
                )
              }
            }
            break;
        case StartMode.STOP:
            setWorkingState(WorkingState.NOT_WORKING);
            XMRigForAndroid.stop();
            break;
    }
  }, [working]);

  React.useEffect(() => {
    const MinerEmitter = new NativeEventEmitter(XMRigForAndroid);

    const onLogSub:EmitterSubscription = MinerEmitter.addListener('onLog', (data:IXMRigLogEvent) => {
        console.log(data);
        const cleanData = [...data.log.filter(item => !filterLogLineRegex.test(item))]
        setMinerLog(old => [...cleanData.reverse().map(value => parseLogLine(value)), ...old])
    });

    const onConfigUpdateSub:EmitterSubscription = MinerEmitter.addListener('onConfigUpdate', (data) => {
      console.log("onConfigUpdate", data.config)
      const cConfig:Configuration | undefined = settings.configurations.find(
        config => config.id == settings.selectedConfiguration
      );
      if (cConfig && cConfig.mode === ConfigurationMode.ADVANCE) {
        settingsDispatcher({
          type: SettingsActionType.UPDATE_CONFIGURATION,
          value: {
            ...cConfig,
            config: data.config
          }
        })
      }
    });

    return () => {
        onLogSub.remove();
        onConfigUpdateSub.remove()
        XMRigForAndroid.stop();
    }
}, [])

  return (
    <SessionDataContext.Provider value={{minerLog, hashrateHistoryRef, working, workingState, minerData, setWorking}}>
      {children}
    </SessionDataContext.Provider>
  );
}
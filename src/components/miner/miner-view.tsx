import React from 'react';
import { ViewProps, View} from 'react-native';
import { TabNavigator } from './miner-navigator';

export const MinerView:React.FC<ViewProps> = () => {
    return (
        <>
            <TabNavigator />
        </>
    )
}

export default MinerView;
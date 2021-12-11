import React from 'react';
import {ScrollView, StyleSheet, View } from 'react-native';
import { SessionDataContext } from '../../../../core/session-data/session-data.context';
import { StartMode } from '../../../../core/session-data/session-data.interface';
import { Headline } from 'react-native-paper';
import { XMRigLogView } from '../../containers/xmrig-log';

const LogScreen = () => {
    
    const {working, minerLog} = React.useContext(SessionDataContext);

    return (
        <View>
            <ScrollView nestedScrollEnabled={true} style={working == StartMode.STOP ? [styles.layout, styles.hidden] : styles.layout}>
                <View>
                    <Headline>Miner Log</Headline>
                </View>
                <XMRigLogView disabled={working == StartMode.STOP} data={minerLog} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    layout: {
        marginHorizontal: 15,
        marginBottom: 10,
        height: '100%'
    },
    hidden: {
        opacity: 1
    },
});

export default LogScreen;
import React from 'react';
import { Appbar } from 'react-native-paper';

export const AppHeader = ({ navigation, back }: any) => {
    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title="XMRig" subtitle="for Android" />
            <Appbar.Content title="Version" subtitle="1.2.45" style={{alignItems: 'flex-end'}} />
        </Appbar.Header>
    )
}
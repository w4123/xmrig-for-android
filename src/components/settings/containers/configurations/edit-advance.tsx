import React from 'react';
import {View, StyleSheet, ViewProps, ScrollView } from 'react-native';
import { List, Colors, Button, TextInput, Card, Headline, Caption, HelperText } from 'react-native-paper';
import { IAdvanceConfiguration, XMRigFork } from '../../../../core/settings/settings.interface';
import { useNavigation } from '@react-navigation/native';
import DropDown from 'react-native-paper-dropdown';
import merge from 'lodash/fp/merge';


type ConfigurationEditAdvanceProps = ViewProps & {
    configuration: IAdvanceConfiguration;
    onUpdate: (configurationData: IAdvanceConfiguration) => void;
};

const ListIconSuccess:React.FC<any> = (props)  => <List.Icon {...props} icon="check"  color={Colors.greenA700} />
const ListIconError:React.FC<any> = (props)  => <List.Icon {...props} icon="close" color={Colors.redA700} />

export const ConfigurationEditAdvance:React.FC<ConfigurationEditAdvanceProps> = ({
    configuration,
    onUpdate
}) => {
    const navigation = useNavigation();

    const [localState, setLocalState] = React.useState<IAdvanceConfiguration>(configuration);

    const [showForkDropDown, setShowForkDropDown] = React.useState(false);

    const [cardHeight, setCardHeight] = React.useState<number>(0);
    const isJSONValid = React.useMemo<boolean>(() => {
        try {
            JSON.parse(localState?.config || "");
            return true;
        } catch(e) {
            return false;
        }
    }, [localState.config])

    return (
        <>
            <View style={[styles.row, {}]}>
                <Headline style={styles.title}>{localState.name}</Headline>
                <Button 
                    icon="check"
                    mode="contained"
                    onPress={() => {
                        onUpdate(localState);
                        navigation.goBack();
                    }}
                    style={styles.topActionButton}
                    disabled={!isJSONValid}
                >
                    Save
                </Button>
            </View>
            
            <ScrollView contentContainerStyle={{height: '97%'}}>
                <Card style={[styles.card, {marginTop: 0, marginBottom: 0}]}>
                    <Card.Title
                        title="General"
                    />
                    <Card.Content>
                        <View>
                            <DropDown
                                label={"XMRig Fork"}
                                mode="flat"
                                value={localState.xmrig_fork}
                                setValue={text => {
                                    console.log("set", text);
                                    setLocalState(oldState => merge(
                                        oldState,
                                        {
                                            xmrig_fork: text
                                        }
                                    ))
                                }}
                                list={[
                                    { label: "Original", value: XMRigFork.ORIGINAL },
                                    { label: "MoneroOcean", value: XMRigFork.MONEROOCEAN }
                                ]}
                                visible={showForkDropDown}
                                showDropDown={() => setShowForkDropDown(true)}
                                onDismiss={() => setShowForkDropDown(false)}
                            />
                            <Caption>You can choose between original XMRig and MoneroOcean's fork that supports algo switching.</Caption>
                            {localState.xmrig_fork == XMRigFork.MONEROOCEAN && (
                                <HelperText type="error">
                                    Warning: Benchmarking may stuck on some algos, to disable these algos use custom configuration in "Advanced Mode" 
                                </HelperText>
                            )}
                        </View>
                    </Card.Content>
                </Card>
                <Card style={[styles.card, {flex: 1 }]} onLayout={event => setCardHeight(event.nativeEvent.layout.height)}>
                    <Card.Title
                        title="Config JSON"
                        right={isJSONValid ? ListIconSuccess : ListIconError}
                    />
                    <Card.Content>
                        <TextInput
                            style={{height: cardHeight-90, textAlignVertical: 'top'}}
                            label="XMRig config.json content"
                            multiline
                            value={localState.config}
                            textAlignVertical="top"
                            textAlign="left"
                            autoCorrect={false}
                            autoCapitalize='none'
                            underlineColorAndroid='transparent'
                            onChangeText={value =>
                                setLocalState(oldState => ({
                                    ...oldState,
                                    config: value
                                }))
                            }
                        />
                    </Card.Content>
                </Card>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'space-between'
    },
    listSection: {
        flex: 1,
        marginBottom: 0
    },
    card: {
        margin: 10,
        flex: 0
    },
    title: {
        margin: 10
    },
    input: {
        marginBottom: 20
    },
    topActionButton: {
        marginRight: 10
    }
});
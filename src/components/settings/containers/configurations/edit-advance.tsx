import React from 'react';
import {View, StyleSheet, ViewProps, ScrollView } from 'react-native';
import { List, Colors, Button, TextInput, Card, Headline } from 'react-native-paper';
import { IAdvanceConfiguration } from '../../../../core/settings/settings.interface';
import { useNavigation } from '@react-navigation/native';

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
                <Card style={[styles.card, {marginTop: 0}]} onLayout={event => setCardHeight(event.nativeEvent.layout.height)}>
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
        flex: 1
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
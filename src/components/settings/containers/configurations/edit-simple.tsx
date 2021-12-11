import React from 'react';
import {View, StyleSheet, ViewProps, ScrollView, NativeModules} from 'react-native';
import { Paragraph, List, Colors, Button, TextInput, Card, Headline, Switch, Caption } from 'react-native-paper';
import { ISimpleConfiguration, RandomXMode } from '../../../../core/settings/settings.interface';
import { validateWalletAddress } from '../../../../core/utils';
import { cpuValidator, hostnameValidator, maxThreadsHintValidator, passwordValidator, poolValidator, portValidator, priorityValidator } from '../../../../core/utils/validators';
import { useNavigation } from '@react-navigation/native';
import DropDown from "react-native-paper-dropdown";

const { XMRigForAndroid } = NativeModules;


type ConfigurationEditSimpleProps = ViewProps & {
    configuration: ISimpleConfiguration;
    onUpdate: (configurationData: ISimpleConfiguration) => void;
};

const ListIconSuccess:React.FC<any> = (props)  => <List.Icon {...props} icon="check"  color={Colors.greenA700} />
const ListIconError:React.FC<any> = (props)  => <List.Icon {...props} icon="close" color={Colors.redA700} />

export const ConfigurationEditSimple:React.FC<ConfigurationEditSimpleProps> = ({
    configuration,
    onUpdate
}) => {
    const navigation = useNavigation();

    const [localState, setLocalState] = React.useState<ISimpleConfiguration>(configuration);

    const [isWalletValid, setIsWalletValid] = React.useState<boolean>(false);
    const [isPoolValid, setIsPoolValid] = React.useState<boolean>(false);
    const [isCPUValid, setIsCPUValid] = React.useState<boolean>(false);

    const [deviceCores, setDeviceCores] = React.useState<number>(2);

    React.useEffect(() => {
        XMRigForAndroid.availableProcessors()
            .then((cores:number) => setDeviceCores(cores))
            .catch(() => setDeviceCores(2))
    }, []);

    React.useEffect(() => {
        setIsWalletValid(validateWalletAddress(localState.properties?.wallet))
        setIsPoolValid(
            poolValidator.validate(localState.properties?.pool || {}).error == null
        );
        setIsCPUValid(
            cpuValidator.validate(localState.properties?.cpu || {}).error == null
        );
    }, [localState.properties]);

    const [showDropDown, setShowDropDown] = React.useState(false);

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
                >
                    Save
                </Button>
            </View>
            
            <ScrollView>
                <Card style={[styles.card, {marginTop: 0}]}>
                    <Card.Title
                        title="Wallet"
                        right={isWalletValid ? ListIconSuccess : ListIconError}
                    />
                    <Card.Content>
                        <TextInput
                            label="Wallet XMR Address"
                            dense
                            value={localState.properties?.wallet}
                            onChangeText={text => setLocalState(oldState => {
                                return {
                                    ...oldState,
                                    properties: {
                                        ...oldState.properties,
                                        wallet: text
                                    }
                                }
                            })}
                            autoComplete={undefined}
                            error={!isWalletValid}                     
                        />
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Title
                        title="Pool"
                        right={isPoolValid ? ListIconSuccess : ListIconError}
                    />
                    <Card.Content>
                        <TextInput
                            style={styles.input}
                            label="Hostname / IP"
                            dense
                            value={localState.properties?.pool?.hostname}
                            onChangeText={text => setLocalState(oldState => {
                                return {
                                    ...oldState,
                                    properties: {
                                        ...oldState.properties,
                                        pool: {
                                            ...oldState.properties?.pool,
                                            hostname: text
                                        }
                                    }
                                }
                            })}
                            autoComplete={undefined}
                            error={hostnameValidator.validate(localState.properties?.pool?.hostname).error != null}               
                        />
                        <TextInput
                            style={styles.input}
                            label="Port"
                            dense
                            value={`${localState.properties?.pool?.port || ''}`}
                            onChangeText={text => setLocalState(oldState => {
                                return {
                                    ...oldState,
                                    properties: {
                                        ...oldState.properties,
                                        pool: {
                                            ...oldState.properties?.pool,
                                            port: Number(text)
                                        }
                                    }
                                }
                            })}
                            error={portValidator.validate(localState.properties?.pool?.port).error != null}
                            autoComplete={undefined}
                            keyboardType="numeric"           
                        />
                        <TextInput
                            label="Password"
                            dense
                            value={`${localState.properties?.pool?.password || ''}`}
                            onChangeText={text => setLocalState(oldState => {
                                return {
                                    ...oldState,
                                    properties: {
                                        ...oldState.properties,
                                        pool: {
                                            ...oldState.properties?.pool,
                                            password: text || undefined
                                        }
                                    }
                                }
                            })}
                            error={passwordValidator.validate(localState.properties?.pool?.password).error != null}
                            autoComplete={undefined}                    
                        />
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Title
                        title="CPU"
                        right={isCPUValid ? ListIconSuccess : ListIconError}
                    />
                    <Card.Content>
                        <View style={styles.input}>
                            <View style={[styles.row, {margin: 0}]}>
                                <Paragraph>Yield</Paragraph>
                                <Switch
                                    value={localState.properties?.cpu?.yield}
                                    onValueChange={value => setLocalState(oldState => {
                                        return {
                                            ...oldState,
                                            properties: {
                                                ...oldState.properties,
                                                cpu: {
                                                    ...oldState.properties?.cpu,
                                                    yield: value
                                                }
                                            }
                                        }
                                    })}
                                />
                            </View>
                            <Caption>Prefer system better system response/stability `ON` (default value) or maximum hashrate `OFF`.</Caption>
                        </View>

                        <View style={styles.input}>
                            <DropDown
                                label={"Random X Mode"}
                                mode="flat"
                                
                                value={localState.properties?.cpu?.random_x_mode}
                                setValue={text => setLocalState(oldState => {
                                    return {
                                        ...oldState,
                                        properties: {
                                            ...oldState.properties,
                                            cpu: {
                                                ...oldState.properties?.cpu,
                                                random_x_mode: text
                                            }
                                        }
                                    }
                                })}
                                list={[
                                    { label: "Auto", value: RandomXMode.AUTO },
                                    { label: "Fast", value: RandomXMode.FAST },
                                    { label: "Light", value: RandomXMode.LIGHT }
                                ]}
                                visible={showDropDown}
                                showDropDown={() => setShowDropDown(true)}
                                onDismiss={() => setShowDropDown(false)}
                            />
                            <Caption>RandomX mining mode: "auto", "fast" (2 GB memory), "light" (256 MB memory).</Caption>
                        </View>

                        <View style={styles.input}>
                            <TextInput
                                label="Priority"
                                placeholder="1 - 12"
                                dense
                                value={localState.properties?.cpu?.priority ? String(localState.properties?.cpu?.priority) : ''}
                                onChangeText={text => setLocalState(oldState => {
                                    return {
                                        ...oldState,
                                        properties: {
                                            ...oldState.properties,
                                            cpu: {
                                                ...oldState.properties?.cpu,
                                                priority: Number(text) || undefined
                                            }
                                        }
                                    }
                                })}
                                autoComplete={undefined}
                                error={priorityValidator.validate(localState.properties?.cpu?.priority).error != null}     
                                keyboardType="numeric"          
                            />
                            <Caption>Threads priority, from 1 (lowest) to 5 (highest). Default: null - doesn't change priority.</Caption>
                        </View>

                        <View>
                            <TextInput
                                label="Max Threads Hint"
                                dense
                                value={localState.properties?.cpu?.max_threads_hint ? `${localState.properties?.cpu?.max_threads_hint}` : ''}
                                right={<TextInput.Affix text={`% of ${deviceCores} cores`} />}
                                onChangeText={text => setLocalState(oldState => {
                                    return {
                                        ...oldState,
                                        properties: {
                                            ...oldState.properties,
                                            cpu: {
                                                ...oldState.properties?.cpu,
                                                max_threads_hint: Number(text)
                                            }
                                        }
                                    }
                                })}
                                error={maxThreadsHintValidator.validate(localState.properties?.cpu?.max_threads_hint).error != null}
                                autoComplete={undefined}
                                keyboardType="numeric"              
                            />
                            <Caption>For 1 core CPU this option has no effect, for 2 core CPU only 2 values possible 50% and 100%, for 4 cores: 25%, 50%, 75%, 100%. etc.</Caption>
                        </View>
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
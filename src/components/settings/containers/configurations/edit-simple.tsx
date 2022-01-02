import React from 'react';
import {View, StyleSheet, ViewProps, ScrollView, NativeModules} from 'react-native';
import { Paragraph, List, Colors, Button, TextInput, Card, Headline, Switch, Caption, HelperText } from 'react-native-paper';
import { Algorithems, Algorithm, IConfiguratioPropertiesPool, ISimpleConfiguration, RandomXMode, XMRigFork } from '../../../../core/settings/settings.interface';
import { cpuValidator, hostnameValidator, maxThreadsHintValidator, passwordValidator, poolValidator, portValidator, priorityValidator, usernameValidator } from '../../../../core/utils/validators';
import { useNavigation } from '@react-navigation/native';
import DropDown from "react-native-paper-dropdown";
import merge from 'lodash/fp/merge';
import PoolListModal from '../../modals/pool-list.modal';

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

    const [isPoolValid, setIsPoolValid] = React.useState<boolean>(false);
    const [isCPUValid, setIsCPUValid] = React.useState<boolean>(false);

    const [deviceCores, setDeviceCores] = React.useState<number>(2);

    React.useEffect(() => {
        XMRigForAndroid.availableProcessors()
            .then((cores:number) => setDeviceCores(cores))
            .catch(() => setDeviceCores(2))
    }, []);

    React.useEffect(() => {
        setIsPoolValid(
            poolValidator.validate(localState.properties?.pool || {}).error == null
        );
        setIsCPUValid(
            cpuValidator.validate(localState.properties?.cpu || {}).error == null
        );
    }, [localState.properties]);

    React.useEffect(() => {
       console.log(localState)
    }, [localState]);

    const [showDropDown, setShowDropDown] = React.useState(false);
    const [showForkDropDown, setShowForkDropDown] = React.useState(false);

    const [showPoolListDialog, setShowPoolListDialog] = React.useState<boolean>(false);

    return (
        <>
            <PoolListModal 
                onAdd={(pool: IConfiguratioPropertiesPool) => {
                    setLocalState(oldState => merge(
                        oldState,
                        {
                            properties: {
                                pool: pool
                            }
                        }
                    ))
                }}
                onClose={() => setShowPoolListDialog(false)}
                isVisible={showPoolListDialog}
            />

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
            
            <ScrollView contentContainerStyle={{paddingBottom: 60}}>
                <Card style={[styles.card, {marginTop: 0}]}>
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
                <Card style={[styles.card, {marginTop: 0}]}>
                    <Card.Title
                        title="Pool"
                        right={isPoolValid ? ListIconSuccess : ListIconError}
                    />
                    <Card.Content>
                        <Button
                            mode="contained"
                            style={styles.input}
                            onPress={() => setShowPoolListDialog(true)}
                        >
                            Select from Presets
                        </Button>
                        <TextInput
                            style={styles.input}
                            label="Hostname / IP"
                            dense
                            value={localState.properties?.pool?.hostname}
                            onChangeText={text => setLocalState(oldState => merge(
                                oldState,
                                {
                                    properties: {
                                        pool: {
                                            hostname: text
                                        }
                                    }
                                }
                            ))}
                            autoComplete={undefined}
                            error={hostnameValidator.validate(localState.properties?.pool?.hostname).error != null}               
                        />
                        <TextInput
                            style={styles.input}
                            label="Port"
                            dense
                            value={`${localState.properties?.pool?.port || ''}`}
                            onChangeText={text => setLocalState(oldState => merge(
                                oldState,
                                {
                                    properties: {
                                        pool: {
                                            port: text
                                        }
                                    }
                                }
                            ))}
                            error={portValidator.validate(localState.properties?.pool?.port).error != null}
                            autoComplete={undefined}
                            keyboardType="numeric"           
                        />
                        <TextInput
                            label="Username"
                            dense
                            value={localState.properties?.pool?.username || localState.properties?.wallet}
                            onChangeText={text => setLocalState(oldState => merge(
                                oldState,
                                {
                                    properties: {
                                        pool: {
                                            username: text
                                        }
                                    }
                                }
                            ))}
                            autoComplete={undefined}
                            error={usernameValidator.validate(localState.properties?.pool?.username).error != null}               
                        />
                        <HelperText type='info' style={{marginBottom: 2}}>
                            Wallet address on most pools
                        </HelperText>
                        <TextInput
                            label="Password"
                            dense
                            value={`${localState.properties?.pool?.password || ''}`}
                            onChangeText={text => setLocalState(oldState => merge(
                                oldState,
                                {
                                    properties: {
                                        pool: {
                                            password: text || ''
                                        }
                                    }
                                }
                            ))}
                            error={passwordValidator.validate(localState.properties?.pool?.password).error != null}
                            autoComplete={undefined}                    
                        />
                        <HelperText type='info' style={{marginBottom: 2}}>
                        Optional on most pools
                        </HelperText>
                        <View style={[styles.row, {margin: 0, marginTop: 20}]}>
                            <Paragraph>SSL</Paragraph>
                            <Switch
                                value={localState.properties?.pool?.sslEnabled}
                                onValueChange={value => setLocalState(oldState => merge(
                                    oldState,
                                    {
                                        properties: {
                                            pool: {
                                                sslEnabled: value
                                            }
                                        }
                                    }
                                ))}
                            />
                        </View>
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
                                    onValueChange={value => setLocalState(oldState => merge(
                                        oldState,
                                        {
                                            properties: {
                                                cpu: {
                                                    yield: value
                                                }
                                            }
                                        }
                                    ))}
                                />
                            </View>
                            <Caption>Prefer system better system response/stability `ON` (default value) or maximum hashrate `OFF`.</Caption>
                        </View>

                        <View style={styles.input}>
                            <DropDown
                                label={"Random X Mode"}
                                mode="flat"
                                
                                value={localState.properties?.cpu?.random_x_mode}
                                setValue={text => setLocalState(oldState => merge(
                                    oldState,
                                    {
                                        properties: {
                                            cpu: {
                                                random_x_mode: text
                                            }
                                        }
                                    }
                                ))}
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
                            {localState.properties?.cpu?.random_x_mode == RandomXMode.FAST && <HelperText type="error" visible={localState.properties?.cpu?.random_x_mode == RandomXMode.FAST}>
                                Warning: The App may crash if the phone doesn't have enough ram
                            </HelperText>}
                        </View>

                        <View style={styles.input}>
                            <TextInput
                                label="Priority"
                                placeholder="1 - 5"
                                dense
                                value={localState.properties?.cpu?.priority ? String(localState.properties?.cpu?.priority) : ''}
                                onChangeText={text => setLocalState(oldState => merge(
                                    oldState,
                                    {
                                        properties: {
                                            cpu: {
                                                priority: Number(text) || null
                                            }
                                        }
                                    }
                                ))}
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
                                onChangeText={text => setLocalState(oldState => merge(
                                    oldState,
                                    {
                                        properties: {
                                            cpu: {
                                                max_threads_hint: Number(text) || null
                                            }
                                        }
                                    }
                                ))}
                                error={maxThreadsHintValidator.validate(localState.properties?.cpu?.max_threads_hint).error != null}
                                autoComplete={undefined}
                                keyboardType="numeric"              
                            />
                            <Caption>For 1 core CPU this option has no effect, for 2 core CPU only 2 values possible 50% and 100%, for 4 cores: 25%, 50%, 75%, 100%. etc.</Caption>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Title
                        title="Algorithems"
                    />
                    <Card.Content>
                        <Caption>Enable/Disable miner supported algorithems, some of the algorithems can casue problems on some devices. If the miner is stuck/crash on some algorithem you can disable these algorithem.</Caption>
                        {Algorithems.map((algo: Algorithm, index) => (
                            <View style={styles.input} key={`algo-${index}`}>
                                <View style={[styles.row, {margin: 0}]}>
                                    <Paragraph>{algo}</Paragraph>
                                    <Switch
                                        value={localState.properties?.algos[algo]}
                                        onValueChange={value => setLocalState(oldState => merge(
                                            oldState,
                                            {
                                                properties: {
                                                    algos: {
                                                        [`${algo}`]: value
                                                    }
                                                }
                                            }
                                        ))}
                                    />
                                </View>
                            </View>
                        ))}
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
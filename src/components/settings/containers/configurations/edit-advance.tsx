import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  View, StyleSheet, ViewProps, ScrollView, KeyboardAvoidingView,
} from 'react-native';
import {
  List, Colors, Button, Card, Headline, Caption, HelperText, Paragraph, useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as JSON5 from 'json5';
import DropDown from 'react-native-paper-dropdown';
import merge from 'lodash/fp/merge';
import { IAdvanceConfiguration, XMRigFork } from '../../../../core/settings/settings.interface';
import Editor from '../../../editor/editor.component';

type ConfigurationEditAdvanceProps = ViewProps & {
    configuration: IAdvanceConfiguration;
    onUpdate: (configurationData: IAdvanceConfiguration) => void;
};

const ListIconSuccess:React.FC<any> = () => <List.Icon icon="check" color={Colors.greenA700} />;
const ListIconError:React.FC<any> = () => <List.Icon icon="close" color={Colors.redA700} />;

export const ConfigurationEditAdvance:React.FC<ConfigurationEditAdvanceProps> = ({
  configuration,
  onUpdate,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const [localState, setLocalState] = React.useState<IAdvanceConfiguration>(configuration);

  const [showForkDropDown, setShowForkDropDown] = React.useState(false);

  const editorRef = React.useRef<{ simulateKeyPress:(key: any) => void; }>(null);

  const [cardHeight, setCardHeight] = React.useState<number>(0);
  const isJSONValid = React.useMemo<boolean>(() => {
    try {
      JSON5.parse(localState?.config || '');
      return true;
    } catch (e) {
      return false;
    }
  }, [localState.config]);

  const handleKeyPress = (key: any) => {
    editorRef?.current?.simulateKeyPress(key);
  };

  const codeCopy = React.useMemo<string>(() => {
    const data = localState.config?.toString() || '';
    try {
      return JSON.stringify(JSON5.parse(data), null, 2);
    } catch (er) {
      console.log(er);
    }

    return '{}';
  }, []);

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

      <ScrollView contentContainerStyle={{ height: '97%' }}>
        <Card style={[styles.card, { marginTop: 0, marginBottom: 0 }]}>
          <Card.Title
            title="General"
          />
          <Card.Content>
            <View>
              <DropDown
                label="XMRig Fork"
                mode="flat"
                value={localState.xmrig_fork}
                setValue={(text) => {
                  console.log('set', text);
                  setLocalState((oldState) => merge(
                    oldState,
                    {
                      xmrig_fork: text,
                    },
                  ));
                }}
                list={[
                  { label: 'Original', value: XMRigFork.ORIGINAL },
                  { label: 'MoneroOcean', value: XMRigFork.MONEROOCEAN },
                ]}
                visible={showForkDropDown}
                showDropDown={() => setShowForkDropDown(true)}
                onDismiss={() => setShowForkDropDown(false)}
              />
              <Caption>
                You can choose between original XMRig and MoneroOcean's
                fork that supports algo switching.
              </Caption>
              {localState.xmrig_fork === XMRigFork.MONEROOCEAN && (
                <HelperText type="error">
                  Warning: Benchmarking may stuck on some algos, Please disable the
                  algos that cause the problem.
                </HelperText>
              )}
            </View>
          </Card.Content>
        </Card>
        <Card
          style={[styles.card, { flex: 1 }]}
          onLayout={(event) => setCardHeight(event.nativeEvent.layout.height)}
        >
          <Card.Title
            title="Config JSON"
            right={isJSONValid ? ListIconSuccess : ListIconError}
          />
          <Card.Content style={{ padding: 0, marginHorizontal: -15 }}>
            <KeyboardAvoidingView
              style={{ flexGrow: 1 }}
            >
              <Editor
                code={codeCopy}
                language="json"
                theme={theme.dark ? 'dark' : 'light'}
                ref={editorRef}
                onCodeChange={(data) => setLocalState((oldState) => ({
                  ...oldState,
                  config: data,
                }))}
                style={{ height: cardHeight - 120 }}
              />
              <View style={[styles.bar, { margin: 10 }]}>
                <TouchableOpacity onPress={() => handleKeyPress('Enter')}>
                  <Paragraph>ENTER</Paragraph>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleKeyPress('Tab')}>
                  <Paragraph>TAB</Paragraph>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleKeyPress('ArrowRight')}>
                  <Paragraph>&#8594;</Paragraph>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleKeyPress('ArrowLeft')}>
                  <Paragraph>&#8592;</Paragraph>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleKeyPress('ArrowUp')}>
                  <Paragraph>&#8593;</Paragraph>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleKeyPress('ArrowDown')}>
                  <Paragraph>&#8595;</Paragraph>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  listSection: {
    flex: 1,
    marginBottom: 0,
  },
  card: {
    margin: 10,
    flex: 0,
  },
  title: {
    margin: 10,
  },
  input: {
    marginBottom: 20,
  },
  topActionButton: {
    marginRight: 10,
  },
  bar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 5,
  },
});

import React from 'react';
// @ts-ignore
import redeyed from 'redeyed';
import colors from 'ansi-colors';
import { AnsiComponent } from 'react-native-ansi-view';
import {
  View, StyleSheet, ViewProps, ScrollView, KeyboardAvoidingView, TextInput,
} from 'react-native';
import {
  List, Colors, Button, Card, Headline, Caption, HelperText, useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as JSON5 from 'json5';
import DropDown from 'react-native-paper-dropdown';
import merge from 'lodash/fp/merge';
import { IAdvanceConfiguration, XMRigFork } from '../../../../core/settings/settings.interface';

type ConfigurationEditAdvanceProps = ViewProps & {
    configuration: IAdvanceConfiguration;
    onUpdate: (configurationData: IAdvanceConfiguration) => void;
};

const ListIconSuccess:React.FC<any> = () => <List.Icon icon="check" color={Colors.greenA700} />;
const ListIconError:React.FC<any> = () => <List.Icon icon="close" color={Colors.redA700} />;

const cleanAnsi = (str: string) => str
  .replace(/\s\u2713/g, '')
  .replace(/\s\u2715/g, '');

export const ConfigurationEditAdvance:React.FC<ConfigurationEditAdvanceProps> = ({
  configuration,
  onUpdate,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [editorHeight, setEditorHeight] = React.useState<number>(0);

  const [localState, setLocalState] = React.useState<IAdvanceConfiguration>(configuration);
  const [code, setCode] = React.useState<string>('{}');

  const cleanCode = React.useMemo(() => cleanAnsi(code), [code]);

  React.useEffect(() => {
    const data = localState.config?.toString() || '{}';
    try {
      setCode(JSON.stringify(JSON5.parse(data), null, 2));
    } catch (er) {
      console.log(er);
    }
  }, []);

  React.useEffect(() => {
    setLocalState((oldState) => ({
      ...oldState,
      config: cleanCode,
    }));
    console.log(cleanCode);
  }, [code]);

  const applyWithBold = (color: colors.StyleFunction): ((s:string) => string) => {
    console.log('applyWithBold');
    return (txt: string): string => colors.bold(color(txt));
  };

  const styledCode = React.useMemo(() => {
    try {
      const parsed = redeyed(cleanCode, {
        String: {
          _default: (s: any, info: any) => {
            const nextToken = info.tokens[info.tokenIndex + 1];

            // show keys of object literals and json in different color
            return nextToken
              && nextToken.type === 'Punctuator'
              && nextToken.value === ':'
              ? colors.green(s)
              : applyWithBold(colors.magenta)(s);
          },
        },
        Boolean: {
          true: () => applyWithBold(colors.green)('true \u2713'),
          false: () => applyWithBold(colors.red)('false \u2715'),
        },
        Numeric: {
          _default: applyWithBold(colors.magenta),
        },
        Null: {
          _default: applyWithBold(colors.red),
        },
        Punctuator: {
          '{': theme.dark ? colors.whiteBright : colors.blackBright,
          '}': theme.dark ? colors.whiteBright : colors.blackBright,
          '(': theme.dark ? colors.whiteBright : colors.blackBright,
          ')': theme.dark ? colors.whiteBright : colors.blackBright,
          '[': theme.dark ? colors.whiteBright : colors.blackBright,
          ']': theme.dark ? colors.whiteBright : colors.blackBright,
          ',': colors.green,
          _default: theme.dark ? colors.whiteBright : colors.blackBright,
        },
      });
      console.log('parse');
      return parsed.code;
    } catch (er) {
      console.log('err', er);
    }
    return code;
  }, [code, theme.dark]);

  const [showForkDropDown, setShowForkDropDown] = React.useState(false);

  const isJSONValid = React.useMemo<boolean>(() => {
    try {
      JSON5.parse(localState?.config || '');
      return true;
    } catch (e) {
      return false;
    }
  }, [localState.config]);

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
        >
          <Card.Title
            title="Config JSON"
            right={isJSONValid ? ListIconSuccess : ListIconError}
          />
          <Card.Content style={{ padding: 0, marginHorizontal: -15 }}>
            <KeyboardAvoidingView
              style={{ height: '90%' }}
              onLayout={(event) => setEditorHeight(event.nativeEvent.layout.height)}
            >
              <TextInput
                multiline
                onChangeText={setCode}
                autoCorrect={false}
                spellCheck={false}
                style={{
                  height: editorHeight,
                }}
                textAlignVertical="top"
              >
                <AnsiComponent
                  ansi={styledCode}
                  textStyle={{
                    color: theme.dark ? 'white' : 'black',
                  }}
                />
              </TextInput>
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

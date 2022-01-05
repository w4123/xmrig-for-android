import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View, StyleSheet, ViewProps, ScrollView,
} from 'react-native';

import {
  List, Checkbox, Colors, Button, Card, Headline,
} from 'react-native-paper';
import { Configuration } from '../../../../core/settings/settings.interface';

type ConfigurationsListViewProps = ViewProps & {
    configurations: Configuration[];
    onAddNew: () => void;
    onDelete: (ids: string[]) => void;
};

export const ConfigurationsListView:React.FC<ConfigurationsListViewProps> = ({
  configurations = [],
  onAddNew,
  onDelete,
}) => {
  const navigation = useNavigation();
  const [selected, setSelected] = React.useState<string[]>([]);

  const ListRightCheckbox = React.useCallback(({ item }) => (
    <View style={{ alignSelf: 'center' }}>
      <Checkbox
        status={selected.includes(item.id as string) ? 'checked' : 'unchecked'}
        onPress={() => {
          if (selected.includes(item.id as string)) {
            setSelected((oldVal) => oldVal.filter((v) => v !== item.id));
          } else {
            setSelected((oldVal) => [...oldVal, item.id as string]);
          }
        }}
      />
    </View>
  ), [selected, configurations]);

  return (
    <>
      <View style={[styles.row, { marginBottom: 0 }]}>
        <Headline style={styles.title}>Configurations</Headline>
        <Button
          icon="plus"
          mode="contained"
          onPress={onAddNew}
          style={styles.topActionButton}
        >
          New
        </Button>
      </View>

      <Card style={styles.card}>
        <Card.Content style={{ flex: 1 }}>
          <ScrollView>
            {configurations.map((item) => (
              <List.Item
                key={`key-${item.id}`}
                style={{ paddingHorizontal: 0 }}
                title={item.name}
                description={`${item.mode} mode`.toUpperCase()}
                onPress={() => {
                  navigation.navigate('Configuration' as never, { id: item.id } as never);
                }}
                right={() => <ListRightCheckbox item={item} />}
              />
            ))}
          </ScrollView>

          {selected.length > 0 && (
            <Card.Actions>
              <Button
                icon="delete"
                mode="contained"
                color={Colors.deepOrange900}
                onPress={() => {
                  onDelete([...selected]);
                  setSelected([]);
                }}
              >
                Delete
                {' '}
                {selected.length}
                {' '}
                Selected
              </Button>
            </Card.Actions>
          )}
        </Card.Content>
      </Card>
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
    flex: 1,
  },
  title: {
    margin: 10,
  },
  input: {
    marginVertical: 10,
  },
  topActionButton: {
    marginRight: 10,
  },
});

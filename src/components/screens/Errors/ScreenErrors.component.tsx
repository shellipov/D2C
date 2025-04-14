import { FlatList, StyleSheet, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { Row } from '../../shared/Row';
import { NavBar } from '../../shared/NavBar';
import { Screen } from '../../shared/Screen';
import { ColorsVars } from '../../../settings';
import { First } from '../../shared/Firts';
import { ErrorDataStore } from '../../../api';

export interface IScreenErrorsProps {}

export const ScreenErrors = observer((props: { route: { params: IScreenErrorsProps } }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const errorStore = ErrorDataStore;
  const errors = errorStore.errors;

  useEffect(() => {
    errorStore.refresh().then();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const itemStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
  };

  return (
    <Screen style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>
      <NavBar title={'Ошибки'} />
      <View style={[backgroundStyle, { flex: 1, paddingTop: 8 }]}>
        <First>

          {!errors?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextUI size={'title'} text={'Tут пока ничего нет'} />
            </View>
          )}

          <FlatList
            data={errors}
            keyExtractor={(item) => `item_${item.id}`}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => (
              <View style={itemStyle}>
                <View style={{ paddingBottom: 6 }}>
                  <Row style={[styles.item]}>
                    <TextUI size={'medium'} text={item.title} style={{ color: ColorsVars.red }} />
                  </Row>
                  <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'center' }]}>
                    <TextUI
                      size={'small'}
                      numberOfLines={1}
                      text={item.date} />
                  </Row>
                  <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'center' }]}>
                    <TextUI size={'small'} text={item.description} />
                  </Row>
                  <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'center' }]}>
                    <TextUI size={'small'} text={item.message} />
                  </Row>
                </View>
              </View>
            )} />
        </First>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  item: {
    paddingVertical: 4,
  },
});

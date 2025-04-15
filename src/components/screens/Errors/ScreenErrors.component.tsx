import { StyleSheet, View } from 'react-native';
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
import { FlatListWithPagination } from '../../shared/FlatListWithPagination';

export interface IScreenErrorsProps {}

export const ScreenErrors = observer((props: { route: { params: IScreenErrorsProps } }) => {
  const errorStore = ErrorDataStore;
  const errors = errorStore.errors;

  useEffect(() => {
    errorStore.refresh().then();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <View style={{ paddingBottom: 6 }}>
        <Row style={[styles.row]}>
          <TextUI size={'medium'} text={item.title} style={{ color: ColorsVars.red }} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TextUI
            size={'small'}
            numberOfLines={1}
            text={item.date} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TextUI size={'small'} text={item.description} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TextUI size={'small'} text={item.message} />
        </Row>
      </View>
    </View>
  );

  return (
    <Screen
      style={styles.screen}
      isError={ErrorDataStore.isError}
      onRefresh={ErrorDataStore.refresh}>
      <NavBar title={'Ошибки'} />
      <View style={{ flex: 1, paddingTop: 8, backgroundColor: Colors.lighter }}>
        <First>
          {!errors?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextUI size={'title'} text={'Tут пока ничего нет'} />
            </View>
          )}
          <FlatListWithPagination data={errors} renderItem={renderItem} />
        </First>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ColorsVars.white,
  },
  item: {
    backgroundColor: ColorsVars.white,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  row: {
    paddingVertical: 4,
  },
});

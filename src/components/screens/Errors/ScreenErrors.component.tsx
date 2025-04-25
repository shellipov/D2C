import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { Row } from '@shared/Row';
import { NavBar } from '@shared/NavBar';
import { Screen } from '@shared/Screen';
import { First } from '@shared/Firts';
import { FlatListWithPagination } from '@shared/FlatListWithPagination';
import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';
import { IScreenErrorsProps, IScreenErrorsVM } from './ScreenErrors.types';
import { useAppState } from '@/hooks/useAppState';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Loader } from '@shared/Loader';

export const ScreenErrors = observer((props: { route: { params: IScreenErrorsProps } }) => {
  const { isActive } = useAppState();
  const vm = useInjection<IScreenErrorsVM>(TYPES.ScreenErrorsVM);
  const theme = useAppTheme();
  const contentStyles = { flex: 1, paddingTop: 8, backgroundColor: theme.color.bgAdditional };

  useEffect(() => {
    vm.initialize(() => ({ ...props.route.params, isActive }));

    return () => {
      vm.dispose();
    };
  }, [isActive]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.item, { backgroundColor: theme.color.bgAdditionalTwo }]}>
      <Row style={[styles.row]}>
        <TextUI size={'medium'} text={item.title} style={{ color: theme.color.textRed }} />
      </Row>
      <Row style={styles.row}>
        <TextUI
          size={'small'}
          numberOfLines={1}
          text={item.date} />
      </Row>
      <Row style={styles.row}>
        <TextUI size={'small'} text={item.description} />
      </Row>
      <Row style={styles.row}>
        <TextUI size={'small'} text={item.message} />
      </Row>
    </View>
  );

  return (
    <Screen isError={vm.errorDataStore?.isError} onRefresh={vm.errorDataStore?.refresh}>
      <NavBar title={'Ошибки'} />
      <View style={contentStyles}>
        <First>
          {vm.errorDataStore.isLoading && (
            <Loader />
          )}
          {!vm.errorDataStore?.model.data?.length && (
            <View style={styles.errorView}>
              <TextUI size={'title'} text={'Tут пока ничего нет'} />
            </View>
          )}
          <FlatListWithPagination data={vm.errorDataStore?.model.data} renderItem={renderItem} />
        </First>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  errorView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  row: {
    paddingVertical: 4,
  },
});

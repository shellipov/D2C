import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { OrderDataStore } from '../../../api/OrderDataStore';
import { Row } from '../../shared/Row';
import { NavBar } from '../../shared/NavBar';
import { UserDataStore } from '../../../api/UserDataStore';
import { Screen } from '../../shared/Screen';
import { ColorsVars } from '../../../settings';
import { First } from '../../shared/Firts';
import { FlatListWithPagination } from '../../shared/FlatListWithPagination';

export interface IScreenOrderListProps {}

export const ScreenOrderList = observer((props: { route: { params: IScreenOrderListProps } }) => {
  const user = UserDataStore.user;
  const orders = OrderDataStore.orders.filter(i => i.user.id === user?.id);
  const navigation = useNavigationHook();

  useEffect(() => {
    OrderDataStore.refresh().then();
  }, []);

  const isError = UserDataStore.isError || OrderDataStore.isError;

  const onRefresh = () => {
    if (UserDataStore.isError) {
      UserDataStore.refresh().then();
    }

    if (OrderDataStore.isError) {
      OrderDataStore.refresh().then();
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Order', { order: item })}>
      <View style={{ paddingBottom: 6 }}>
        <Row style={[styles.row]}>
          <TextUI size={'large'} text={`Заказ № ${item.id}`} style={{ color: ColorsVars.green }} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TextUI size={'large'} text={'Время'} />
          <TextUI
            size={'medium'}
            numberOfLines={1}
            style={{ maxWidth: '70%' }}
            text={`${item.date}`} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TextUI size={'large'} text={'Кол-во товаров'} />
          <TextUI
            size={'medium'}
            numberOfLines={1}
            style={{ maxWidth: '70%' }}
            text={`${item.cart.reduce((acc, i) => acc + i.numberOfProducts, 0)} шт`} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TextUI size={'large'} text={'Стоимость'} />
          <TextUI
            size={'medium'}
            numberOfLines={1}
            style={{ maxWidth: '70%' }}
            text={`${item.totalSum || 0} ₽`} />
        </Row>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen
      style={styles.screen}
      isError={isError}
      onRefresh={onRefresh}>
      <NavBar title={'Заказы'} />
      <View style={{ flex: 1, paddingTop: 8, backgroundColor: Colors.lighter }}>
        <First>
          {!orders?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextUI size={'title'} text={'Tут пока ничего нет'} />
            </View>
          )}
          <FlatListWithPagination data={orders} renderItem={renderItem} />
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

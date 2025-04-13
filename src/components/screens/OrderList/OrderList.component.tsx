import { FlatList, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
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

export interface IScreenOrderListProps {}

export const ScreenOrderList = observer((props: { route: { params: IScreenOrderListProps } }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const user = UserDataStore.user;
  const orders = OrderDataStore.orders.filter(i => i.user.id === user?.id);
  const navigation = useNavigationHook();

  useEffect(() => {
    OrderDataStore.refresh().then();
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
      <NavBar title={'Заказы'} />
      <View style={[backgroundStyle, { flex: 1, paddingTop: 8 }]}>
        <First>

          {!orders?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextUI size={'title'} text={'Tут пока ничего нет'} />
            </View>
          )}

          <FlatList
            data={orders}
            keyExtractor={(item) => `item_${item.id}`}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => (
              <TouchableOpacity style={itemStyle} onPress={() => navigation.navigate('Order', { order: item })}>
                <View style={{ paddingBottom: 6 }}>
                  <Row style={[styles.item]}>
                    <TextUI size={'large'} text={`Заказ № ${item.id}`} style={{ color: ColorsVars.green }} />
                  </Row>
                  <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'center' }]}>
                    <TextUI size={'large'} text={'Время'} />
                    <TextUI
                      size={'medium'}
                      numberOfLines={1}
                      style={{ maxWidth: '70%' }}
                      text={`${item.date}`} />
                  </Row>
                  <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'center' }]}>
                    <TextUI size={'large'} text={'Кол-во товаров'} />
                    <TextUI
                      size={'medium'}
                      numberOfLines={1}
                      style={{ maxWidth: '70%' }}
                      text={`${item.cart.reduce((acc, i) => acc + i.numberOfProducts, 0)} шт`} />
                  </Row>
                  <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'center' }]}>
                    <TextUI size={'large'} text={'Стоимость'} />
                    <TextUI
                      size={'medium'}
                      numberOfLines={1}
                      style={{ maxWidth: '70%' }}
                      text={`${item.totalSum || 0} ₽`} />
                  </Row>
                </View>
              </TouchableOpacity>
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

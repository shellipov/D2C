import { FlatList, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React from 'react';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { CartBlockComponent } from '../../blocks/CartBlock';
import { OrderDataStore } from '../../../api/OrderDataStore';
import { Row } from '../../shared/Row';
import { ButtonUI } from '../../ui/ButtonUI';
import { NavBar } from '../../shared/NavBar';

export interface IScreenOrderListProps {
}

export const ScreenOrderList = observer((props: { route: { params: IScreenOrderListProps }}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const orders = OrderDataStore.orders;
  const navigation = useNavigationHook();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const viewStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    borderColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const itemStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    borderColor: isDarkMode ? 'black' : 'white',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>
      <NavBar title={'Заказы'} />
      <View style={[backgroundStyle, { flex: 1, position: 'relative' }]}>
        <ScrollView style={[viewStyle, styles.scrollView]}>
          <FlatList
            data={orders}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={[itemStyle, { marginVertical: 4, marginHorizontal: 16, borderRadius: 8 }]}
                  onPress={()=> navigation.navigate('Order', { order: item })}>
                  <View style={[itemStyle, { marginBottom: 10, paddingTop: 4, paddingBottom: 2, borderRadius: 8 }]}>
                    <Row style={[styles.item, { justifyContent: 'space-between' }]}>
                      <TextUI size={'large'} text={'Время'} />
                      <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={`${item.date}`} />
                    </Row>
                    <Row style={[styles.item, { justifyContent: 'space-between' }]}>
                      <TextUI size={'large'} text={'Кол-во товаров'} />
                      <TextUI
                        size={'medium'}
                        numberOfLines={1}
                        style={{ maxWidth: '70%', alignSelf: 'flex-end' }}
                        text={`${item.cart.reduce((acc, i) => acc + i.numberOfProducts, 0)} шт`} />
                    </Row>
                    <Row style={[styles.item, { justifyContent: 'space-between' }]}>
                      <TextUI size={'large'} text={'Стоимость'} />
                      <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={`${item.totalSum || 0} ₽`} />
                    </Row>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => `item_${item.id}`}
            scrollEnabled={false}
            numColumns={1}
            contentContainerStyle={styles.container} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  container: {
    marginBottom: 10,
  },
  item: {
    paddingVertical: 2,
    paddingHorizontal: 16,
  },
});

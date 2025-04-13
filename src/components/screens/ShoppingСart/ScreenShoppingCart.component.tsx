import React, { useEffect } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { CartDataStore } from '../../../api/CartDataStore';
import { ButtonUI } from '../../ui/ButtonUI';
import { First } from '../../shared/Firts';
import { ColorsVars, SettingsVars } from '../../../settings';
import { Row } from '../../shared/Row';
import { Col } from '../../shared/Col';

export interface IScreenShoppingCartProps {}

export const ScreenShoppingCart = observer((props: { route: { params: IScreenShoppingCartProps }}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const dataStore = CartDataStore;
  const navigation = useNavigationHook();
  const cart = dataStore.cart;

  useEffect(() => {
    CartDataStore.refresh().then();
  }, []);

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
      <Row style={{ paddingHorizontal: 16 }}>
        <ButtonUI title={'Назад'} style={{ height: 40, borderRadius: 20, alignSelf: 'flex-start' }} onPress={()=> navigation.goBack()} />
      </Row>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TextUI size={'bigTitle'} text={'Корзина'} style={{ paddingVertical: 35 }} />
      </View>
      <View style={[backgroundStyle, { flex: 1 }]}>
        <First>

          {!cart?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextUI size={'title'} text={'Корзина пуста'} />
            </View>
          )}

          <ScrollView style={[viewStyle, styles.scrollView]}>
            <FlatList
              data={cart}
              keyExtractor={(item) => `item_${item.product.id}`}
              scrollEnabled={false}
              numColumns={1}
              contentContainerStyle={styles.container}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity style={[itemStyle, styles.item]} onPress={()=> navigation.navigate('ProductCard', { id: item.product.id })}>
                    <Row style={{ flex: 1 }}>
                      <Col style={{ flex: 1, marginRight: 16, backgroundColor: 'gray', borderRadius: 12 }}>
                        <Image src={item.product.image} resizeMode="cover" style={styles.image} />
                      </Col>
                      <Col style={{ flex: 2 }}>
                        <View style={{ marginVertical: 6 }}>
                          <TextUI text={item.product.name} size={'large'} numberOfLines={1} />
                        </View>
                        <View style={{ marginVertical: 4 }}>
                          <TextUI text={item.product.description} size={'small'} numberOfLines={1} />
                        </View>
                        <View style={{ marginVertical: 4 }}>
                          <TextUI text={item.product.price + ' ₽'} size={'medium'} style={{ color: 'green' }} />
                        </View>
                        <Row style={{ marginVertical: 4, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <TextUI text={`в корзине - ${item.numberOfProducts} шт.`} size={'medium'} />
                          <Row>
                            <ButtonUI title={'-'} style={[styles.button, { marginRight: 8 }]} onPress={()=> dataStore.deleteFromCart(item.product) } />
                            <ButtonUI title={'+'} style={styles.button} onPress={()=> dataStore.addToCart(item.product)} />
                          </Row>
                        </Row>
                      </Col>
                    </Row>
                  </TouchableOpacity>
                );
              }} />
          </ScrollView>

        </First>
      </View>
      <View style={{ alignItems: 'flex-end', padding: 12 }}>
        <TextUI size={'title'} style={{ color: 'green' }} text={`итого: ${CartDataStore.cartSum} ₽`} />
      </View>
      <View style={{ alignItems: 'center', height: 80, justifyContent: 'center' }}>
        <First>
          {CartDataStore.isCreateOrderDisabled && (
            <ButtonUI title={`Минимальная сумма - ${SettingsVars.minCartSum} ₽`} disabled={true}>
              <TextUI
                size={'small'} style={{ color: ColorsVars.disabledText }}
                text={`еще ${SettingsVars.minCartSum - CartDataStore.cartSum} ₽`} />
            </ButtonUI>
          )}
          <ButtonUI title={'Оформить заказ'} style={{ width: '50%' }} onPress={() => navigation.navigate('CreateOrder')} />
        </First>
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
  },
  container: {
    padding: 8,
  },
  item: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    margin: 8,
    padding: 6,
  },
  image: {
    flex: 1,
    borderRadius: 12,
  },
  button: {
    marginVertical: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 20,
    minWidth: 20,
    borderRadius: 20,
  },
});

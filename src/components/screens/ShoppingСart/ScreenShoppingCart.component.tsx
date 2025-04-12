import React, { useEffect } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { CartDataStore } from '../../../api/CartDataStore';
import { ButtonUI } from '../../ui/ButtonUI';
import { First } from '../../shared/Firts';
import { SettingsVars } from '../../../settings';

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
      <View style={{ paddingHorizontal: 16 }}>
        <ButtonUI title={'Back'} style={{ height: 40, width: 80, borderRadius: 20 }} onPress={()=> navigation.goBack()} />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TextUI size={'title'} text={'Cart'} style={{ paddingVertical: 35 }} />
      </View>
      <View style={[backgroundStyle, { flex: 1 }]}>
        <First>

          {!cart?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextUI size={'title'} text={'Cart is empty'} />
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
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 1, flexDirection: 'column', marginRight: 16, backgroundColor: 'gray', borderRadius: 12 }}>
                        <Image src={item.product.image} resizeMode="cover" style={styles.image} />
                      </View>
                      <View style={{ flex: 2, flexDirection: 'column' }}>
                        <View style={{ marginVertical: 6 }}>
                          <TextUI text={item.product.name} size={'large'} numberOfLines={1} />
                        </View>
                        <View style={{ marginVertical: 4 }}>
                          <TextUI text={item.product.description} size={'small'} numberOfLines={1} />
                        </View>
                        <View style={{ marginVertical: 4 }}>
                          <TextUI text={item.product.price + ' ₽'} size={'medium'} style={{ color: 'green' }} />
                        </View>
                        <View style={{ marginVertical: 4, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <TextUI text={`в корзине - ${item.numberOfProducts} шт.`} size={'medium'} />
                          <View style={{ flexDirection: 'row' }}>
                            <ButtonUI title={'-'} style={[styles.button, { marginRight: 8 }]} onPress={()=> dataStore.deleteFromCart(item.product) } />
                            <ButtonUI title={'+'} style={styles.button} onPress={()=> dataStore.addToCart(item.product)} />
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }} />
          </ScrollView>

        </First>
      </View>
      <View style={{ alignItems: 'flex-end', padding: 12 }}>
        <TextUI size={'title'} style={{ color: 'green' }} text={`total: ${CartDataStore.cartSum} ₽`} />
      </View>
      <View style={{ alignItems: 'center', height: 80, justifyContent: 'center' }}>
        <First>
          {CartDataStore.isCreateOrderDisabled && (
            <ButtonUI title={`Minimum order amount ${SettingsVars.minCartSum} ₽`} style={{ backgroundColor: 'gray' }} disabled={true}>
              <TextUI size={'small'} text={`another ${SettingsVars.minCartSum - CartDataStore.cartSum} ₽`} />
            </ButtonUI>
          )}
          <ButtonUI title={'Create order'} style={{ width: '50%' }} onPress={() => navigation.navigate('CreateOrder')} />
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

import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { CartDataStore } from '../../../api/CartDataStore';
import { ButtonUI } from '../../ui/ButtonUI';
import { First } from '../../shared/Firts';
import { ColorsVars, SettingsVars } from '../../../settings';
import { Row } from '../../shared/Row';
import { Screen } from '../../shared/Screen';
import { CardItem } from './components';
import { FlatListWithPagination } from '../../shared/FlatListWithPagination';

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

  return (
    <Screen
      style={styles.screen}
      isError={CartDataStore.isError}
      onRefresh={CartDataStore.refresh}>
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
          <FlatListWithPagination data={cart} renderItem={({ item }: { item: any }) => <CardItem key={item?.product?.id} item={item} />} />
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
    </Screen>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ColorsVars.white,
  },
  scrollView: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
  },
  container: {
    padding: 8,
  },
});

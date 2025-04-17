import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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
import { FlatListWithPagination, IListData } from '../../shared/FlatListWithPagination';
import { Theme } from '../../../store';

export interface IScreenCartProps {}

export const ScreenCart = observer((props: { route: { params: IScreenCartProps }}) => {
  const dataStore = CartDataStore;
  const navigation = useNavigationHook();
  const cart = dataStore.cart;

  useEffect(() => {
    CartDataStore.refresh().then();
  }, []);

  return (
    <Screen
      isError={CartDataStore.isError}
      onRefresh={CartDataStore.refresh}>
      <Row style={{ paddingHorizontal: 16 }}>
        <ButtonUI title={'Назад'} style={{ height: 40, borderRadius: 20, alignSelf: 'flex-start' }} onPress={()=> navigation.goBack()} />
      </Row>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TextUI size={'bigTitle'} text={'Корзина'} style={{ paddingVertical: 35 }} />
      </View>
      <View style={{ flex: 1 }}>
        <First>
          {!cart?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextUI size={'title'} text={'Корзина пуста'} />
            </View>
          )}
          <FlatListWithPagination
            data={cart as IListData}
            style={{ backgroundColor: Theme.color.bgAdditional }}
            renderItem={({ item }: { item: any }) => <CardItem key={item?.product?.id} item={item} />} />
        </First>
      </View>
      <View style={{ alignItems: 'flex-end', padding: 12 }}>
        <TextUI size={'title'} style={{ color: Theme.color.textGreen }} text={`итого: ${CartDataStore.cartSum} ₽`} />
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
  block: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
});

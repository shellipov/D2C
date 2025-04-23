import React, { useEffect } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '@/hooks/useNavigation';
import { ButtonUI } from '../../ui/ButtonUI';
import { First } from '@shared/Firts';
import { SettingsVars } from '@/settings';
import { Row } from '@shared/Row';
import { Screen } from '@shared/Screen';
import { CardItem } from './components';
import { FlatListWithPagination, IListData } from '@shared/FlatListWithPagination';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { ICartDataStore } from '@/api';
import { TYPES } from '@/boot/IoC/types';

export interface IScreenCartProps {}

export const ScreenCart = observer((props: { route: { params: IScreenCartProps }}) => {
  const cartStore = useInjection<ICartDataStore>(TYPES.CartDataStore);
  const navigation = useNavigationHook();
  const cart = cartStore.model.data;
  const Theme = useAppTheme();

  useEffect(() => {
    cartStore.refresh().then();
  }, []);

  return (
    <Screen
      isError={cartStore.isError }
      onRefresh={cartStore.refresh}>
      <Row style={{ paddingHorizontal: 16 }}>
        <ButtonUI title={'Назад'} style={{ height: 40, borderRadius: 20, alignSelf: 'flex-start' }} onPress={()=> navigation.goBack()} />
      </Row>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TextUI size={'bigTitle'} text={'Корзина'} style={{ paddingVertical: 35 }} />
      </View>
      <View style={{ flex: 1 }}>
        <First>
          {!cart?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.color.bgAdditional }}>
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
        <TextUI size={'title'} style={{ color: Theme.color.textGreen }} text={`итого: ${cartStore.model.cartSum} ₽`} />
      </View>
      <View style={{ alignItems: 'center', height: 80, justifyContent: 'center' }}>
        <First>
          {cartStore.model.isCreateOrderDisabled && (
            <ButtonUI title={`Минимальная сумма - ${SettingsVars.minCartSum} ₽`} disabled={true}>
              <TextUI
                size={'small'} style={{ color: Theme.color.disabledPrimary }}
                text={`еще ${SettingsVars.minCartSum - cartStore.model.cartSum} ₽`} />
            </ButtonUI>
          )}
          <ButtonUI title={'Оформить заказ'} style={{ width: '50%' }} onPress={() => navigation.navigate('CreateOrder')} />
        </First>
      </View>
    </Screen>
  );
});

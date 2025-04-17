import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { ButtonUI } from '../../ui/ButtonUI';
import { ColorsVars, SettingsVars } from '../../../settings';
import { Row } from '../../shared/Row';
import { Col } from '../../shared/Col';
import { Chip } from '../../shared/Chip';
import { dateFormatter, eventCreator } from '../../../helpers';
import { Screen } from '../../shared/Screen';
import { DeliveryOptionsEnum, IOrder, OrderCreateStatusEnum, OrderDataStore, PaymentMethodsEnum } from '../../../api/OrderDataStore';
import { CartDataStore } from '../../../api/CartDataStore';
import { UserDataStore } from '../../../api/UserDataStore';
import { EventDataStore, EventTypeEnum, ISimplifiedEventData } from '../../../api/EventDataStore';
import { ProductDataStore } from '../../../api';
import { phoneFormatter } from '../../../helpers/phoneFormatter';
import { OrderCartItem } from '../Order/components';
import {Theme} from "../../../store";

export interface IScreenCreateOrderProps {}

export const ScreenCreateOrder = observer((props: { route: { params: IScreenCreateOrderProps }}) => {
  const navigation = useNavigationHook();
  const cartStore = CartDataStore;
  const user = UserDataStore.user;
  const orderStore = OrderDataStore;
  const eventStore = EventDataStore;
  const cart = cartStore.cart;
  const totalSum = CartDataStore.cartSum + SettingsVars.shippingCost;
  const isValidPhone = useMemo(() => phoneFormatter(user?.phone).isValid, [user?.phone]);
  const isUserProfileError = !user?.name || !user?.phone || !user?.address || !isValidPhone;
  const isUserProfileErrorText = [user?.name, user?.phone, user?.address].join('').length ? 'Исправьте данные профиля' : 'Заполните данные профиля';

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodsEnum>(PaymentMethodsEnum.Card);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOptionsEnum>(DeliveryOptionsEnum.Hand);

  const isError = CartDataStore.isError || EventDataStore.isError || UserDataStore.isError || ProductDataStore.isError || OrderDataStore.isError;

  const onRefresh = () => {
    if (CartDataStore.isError) {
      CartDataStore.refresh().then();
    }
    if (EventDataStore.isError) {
      EventDataStore.refresh().then();
    }
    if (UserDataStore.isError) {
      UserDataStore.refresh().then();
    }
    if (ProductDataStore.isError) {
      ProductDataStore.refresh().then();
    }
    if (OrderDataStore.isError) {
      OrderDataStore.refresh().then();
    }
  };

  const getEventData = () => ({
    user: UserDataStore.simplifiedUser,
    orderOptions: {
      paymentMethod, deliveryOption,
    },
    cartInfo: cartStore.cartInfo,
  }) as ISimplifiedEventData;

  useEffect(() => {
    orderStore.refresh().then();
  }, []);

  const onPressConfirm = useCallback(async ()=>{
    const date = dateFormatter(new Date());
    const order = {
      id: orderStore.orders.length + 1,
      date,
      user,
      cart,
      shippingCost: SettingsVars.shippingCost,
      totalSum,
      deliveryOption: orderStore.deliveryOptions.find(i => i.type === deliveryOption),
      paymentMethod: orderStore.paymentMethods.find(i => i.type === paymentMethod),
    } as IOrder;

    const status = await orderStore.addOrder(order);
    if (status === OrderCreateStatusEnum.Success) {
      CartDataStore.deleteCart().then();
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Main' },
          { name: 'Order', params: { order: orderStore.lastOrder } },
        ],
      });
      const newEvent = eventCreator({ ...getEventData(), eventType: EventTypeEnum.CreateOrder });
      if (!!newEvent) {
        eventStore.addEvent(newEvent).then();
      }
    } else {
      // TODO: add ScreenError
    }
  }, [paymentMethod, deliveryOption, user?.name, user?.phone, user?.address]);

  return (
    <Screen isError={isError} onRefresh={onRefresh}>
      <Row style={{ paddingHorizontal: 16 }}>
        <ButtonUI title={'Назад'} style={{ height: 40, borderRadius: 20, alignSelf: 'flex-start' }} onPress={()=> navigation.goBack()} />
      </Row>
      <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TextUI size={'bigTitle'} text={'Создать заказ'} style={{ paddingVertical: 35 }} />
      </Row>
      <View style={styles.block}>
        <ScrollView style={styles.scrollView}>

          <TouchableOpacity onPress={()=> navigation.navigate('Profile')}>
            <View style={[styles.item, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
              <Row style={[styles.row, { justifyContent: 'space-between' }]}>
                <TextUI size={'large'} style={{ color: !user?.name ? ColorsVars.red : ColorsVars.black }} text={'Имя'} />
                <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={user?.name} />
              </Row>
              <Row style={[styles.row, { justifyContent: 'space-between' }]}>
                <TextUI size={'large'} style={{ color: !user?.phone || !isValidPhone ? ColorsVars.red : ColorsVars.black }} text={'Телефон'} />
                <TextUI
                  size={'medium'}
                  numberOfLines={1}
                  style={{
                    maxWidth: '70%',
                    alignSelf: 'flex-end',
                    color: !isValidPhone ? ColorsVars.red : ColorsVars.black }}
                  text={user?.phone} />
              </Row>
              <Row style={[styles.row, { justifyContent: 'space-between' }]}>
                <TextUI size={'large'} style={{ color: !user?.address ? ColorsVars.red : ColorsVars.black }} text={'Адрес'} />
                <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={user?.address} />
              </Row>
            </View>
          </TouchableOpacity>

          <Col style={styles.container}>
            {cart?.map(OrderCartItem)}
          </Col>

          <View style={[styles.item, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
            <Row style={[styles.row, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Стоимость доставки'} />
              <TextUI size={'medium'} text={`${SettingsVars.shippingCost} ₽`} />
            </Row>
          </View>

          <View style={[styles.item, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
            <Row style={[styles.row, { justifyContent: 'center', marginBottom: 12 }]}>
              <TextUI size={'large'} text={'Доставка'} />
            </Row>
            <Row style={[{ justifyContent: 'space-around' }]}>
              {orderStore.deliveryOptions.map(i => {
                const isSelected = i.type === deliveryOption;

                return (
                  <Chip key={`_${i.type}`} label={i.title} isSelected={isSelected} onPress={()=> {setDeliveryOption(i.type);}} />
                );
              })}
            </Row>
          </View>

          <View style={[styles.item, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
            <Row style={[styles.row, { justifyContent: 'center', marginBottom: 12 }]}>
              <TextUI size={'large'} text={'Оплата'} />
            </Row>
            <Row style={[{ justifyContent: 'space-around' }]}>
              {orderStore.paymentMethods.map(i => {
                const isSelected = i.type === paymentMethod;

                return (
                  <Chip key={`_${i.type}`} label={i.title} isSelected={isSelected} onPress={()=> {setPaymentMethod(i.type);}} />
                );
              })}
            </Row>
          </View>

          <View style={styles.item}>
            <Row style={{ justifyContent: 'flex-end', padding: 12 }}>
              <TextUI size={'title'} style={{ color: Theme.color.textGreen }} text={`итого: ${totalSum} ₽`} />
            </Row>
            <Row style={{ justifyContent: 'center' }}>
              {isUserProfileError && (
                <TextUI size={'medium'} text={isUserProfileErrorText} style={{ color: ColorsVars.red }} />
              )}
            </Row>
            <Row style={{ alignItems: 'center', height: 80, justifyContent: 'center' }}>
              <ButtonUI
                title={'Подтвердить'}
                style={{ width: '50%' }}
                disabled={isUserProfileError}
                onPress={onPressConfirm} />
            </Row>
          </View>

        </ScrollView>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
  scrollView: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    overflow: 'hidden',
    backgroundColor: Colors.lighter,
    borderColor: Colors.lighter,
  },
  container: {
    marginBottom: 10,
  },
  item: {
    backgroundColor: ColorsVars.white,
    borderColor: ColorsVars.white,
  },
  row: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});

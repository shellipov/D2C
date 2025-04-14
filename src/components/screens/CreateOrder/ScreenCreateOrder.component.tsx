import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { ButtonUI } from '../../ui/ButtonUI';
import { ColorsVars, SettingsVars } from '../../../settings';
import { Row } from '../../shared/Row';
import { Col } from '../../shared/Col';
import { Chip } from '../../shared/Chip';
import { dateFormatter } from '../../../helpers';
import { FlatListVars } from '../../../settings/FlatList.vars';
import { Screen } from '../../shared/Screen';
import { eventCreator } from '../../../helpers';
import { DeliveryOptionsEnum, IOrder, OrderCreateStatusEnum, OrderDataStore, PaymentMethodsEnum } from '../../../api/OrderDataStore';
import { CartDataStore } from '../../../api/CartDataStore';
import { UserDataStore } from '../../../api/UserDataStore';
import { EventDataStore, EventTypeEnum, ISimplifiedEventData } from '../../../api/EventDataStore';
import { ProductDataStore } from '../../../api';

export interface IScreenCreateOrderProps {}

export const ScreenCreateOrder = observer((props: { route: { params: IScreenCreateOrderProps }}) => {
  const navigation = useNavigationHook();
  const isDarkMode = useColorScheme() === 'dark';
  const cartStore = CartDataStore;
  const user = UserDataStore.user;
  const orderStore = OrderDataStore;
  const eventStore = EventDataStore;
  const cart = cartStore.cart;
  const isUserProfileError = !user?.name || !user.phone || !user.address;
  const totalSum = CartDataStore.cartSum + SettingsVars.shippingCost;

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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const viewStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    borderColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const itemStyle = {
    backgroundColor: isDarkMode ? ColorsVars.blackBackground : 'white',
    borderColor: isDarkMode ? ColorsVars.blackBackground : 'white',
  };

  return (
    <Screen
      style={styles.screen}
      isError={isError}
      onRefresh={onRefresh}>
      <Row style={{ paddingHorizontal: 16 }}>
        <ButtonUI title={'Назад'} style={{ height: 40, borderRadius: 20, alignSelf: 'flex-start' }} onPress={()=> navigation.goBack()} />
      </Row>
      <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TextUI size={'bigTitle'} text={'Создать заказ'} style={{ paddingVertical: 35 }} />
      </Row>
      <View style={[backgroundStyle, { flex: 1 }]}>
        <ScrollView style={[viewStyle, styles.scrollView]}>

          <TouchableOpacity onPress={()=> navigation.navigate('Profile')}>
            <View style={[itemStyle, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
              <Row style={[styles.item, { justifyContent: 'space-between' }]}>
                <TextUI size={'large'} style={{ color: !user?.name ? ColorsVars.red : ColorsVars.black }} text={'Имя'} />
                <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={user?.name} />
              </Row>
              <Row style={[styles.item, { justifyContent: 'space-between' }]}>
                <TextUI size={'large'} style={{ color: !user?.phone ? ColorsVars.red : ColorsVars.black }} text={'Телефон'} />
                <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={user?.phone} />
              </Row>
              <Row style={[styles.item, { justifyContent: 'space-between' }]}>
                <TextUI size={'large'} style={{ color: !user?.address ? ColorsVars.red : ColorsVars.black }} text={'Адрес'} />
                <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={user?.address} />
              </Row>
            </View>
          </TouchableOpacity>

          <FlatList
            data={cart}
            keyExtractor={(item) => `item_${item.product.id}`}
            scrollEnabled={false}
            numColumns={1}
            contentContainerStyle={styles.container}
            {... FlatListVars}
            renderItem={({ item }) => {
              return (
                <View style={[itemStyle, styles.item]}>
                  <Row style={{ flex: 1 }}>
                    <Col style={{ flex: 2 }}>
                      <View style={{ marginVertical: 4 }}>
                        <TextUI text={item.product.name} size={'large'} numberOfLines={1} />
                      </View>
                      <View style={{ marginVertical: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextUI text={item.product.price + ' ₽'} size={'medium'} />
                        <TextUI text={`${item.numberOfProducts} шт.`} size={'medium'} />
                        <TextUI text={`${item.product.price * item.numberOfProducts} ₽`} size={'medium'} />
                      </View>
                    </Col>
                  </Row>
                </View>
              );
            }} />

          <View style={[itemStyle, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
            <Row style={[styles.item, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Стоимость доставки'} />
              <TextUI size={'medium'} text={`${SettingsVars.shippingCost} ₽`} />
            </Row>
          </View>

          <View style={[itemStyle, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
            <Row style={[styles.item, { justifyContent: 'center', marginBottom: 12 }]}>
              <TextUI size={'large'} text={'Доставка'} />
            </Row>
            <Row style={[{ justifyContent: 'space-around' }]}>
              {orderStore.deliveryOptions.map(i => {
                const isSelected = i.type === deliveryOption;

                return (
                  <Chip key={`_${i.type}`} label={i.title} selected={isSelected} onPress={()=> {setDeliveryOption(i.type);}} />
                );
              })
              }
            </Row>
          </View>

          <View style={[itemStyle, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
            <Row style={[styles.item, { justifyContent: 'center', marginBottom: 12 }]}>
              <TextUI size={'large'} text={'Оплата'} />
            </Row>
            <Row style={[{ justifyContent: 'space-around' }]}>
              {orderStore.paymentMethods.map(i => {
                const isSelected = i.type === paymentMethod;

                return (
                  <Chip key={`_${i.type}`} label={i.title} selected={isSelected} onPress={()=> {setPaymentMethod(i.type);}} />
                );
              })
              }
            </Row>
          </View>

          <View style={itemStyle}>
            <Row style={{ justifyContent: 'flex-end', padding: 12 }}>
              <TextUI size={'title'} style={{ color: 'green' }} text={`итого: ${totalSum} ₽`} />
            </Row>
            <Row style={{ justifyContent: 'center' }}>
              {isUserProfileError && (
                <TextUI size={'medium'} text={'Заполните данные профиля'} style={{ color: ColorsVars.red }} />
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
  screen: {
    flex: 1,
    backgroundColor: ColorsVars.white,
  },
  scrollView: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  container: {
    marginBottom: 10,
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});

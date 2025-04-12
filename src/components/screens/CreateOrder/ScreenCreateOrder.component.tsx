import React, { useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { CartDataStore } from '../../../api/CartDataStore';
import { ButtonUI } from '../../ui/ButtonUI';
import { AuthDataStore } from '../../../api/AuthDataStore';
import { ColorsVars, SettingsVars } from '../../../settings';
import { Row } from '../../shared/Row';
import { Col } from '../../shared/Col';
import { Chip } from '../../ui/Chip';

enum PaymentMethodsEnum {
  Card = 'Card',
  Cash= 'Cash',
}

enum DeliveryOptionsEnum {
  Hand= 'GiveInHand',
  Door= 'LeaveAtTheDoor',
}

export interface IScreenCreateOrderProps {}

export const ScreenCreateOrder = observer((props: { route: { params: IScreenCreateOrderProps }}) => {
  const navigation = useNavigationHook();
  const isDarkMode = useColorScheme() === 'dark';
  const dataStore = CartDataStore;
  const user = AuthDataStore.user;
  const cart = dataStore.cart;
  const isUserProfileError = !user?.name || !user.phone || !user.address;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodsEnum>(PaymentMethodsEnum.Card);
  const [selectedOption, setSelectedOption] = useState<DeliveryOptionsEnum>(DeliveryOptionsEnum.Hand);

  const paymentMethods = [
    {
      type: PaymentMethodsEnum.Card,
      title: 'Картой',
    },
    {
      type: PaymentMethodsEnum.Cash,
      title: 'Наличными',
    },
  ];

  const deliveryOptions = [
    {
      type: DeliveryOptionsEnum.Hand,
      title: 'Отдать в руки',
    },
    {
      type: DeliveryOptionsEnum.Door,
      title: 'Уставить у двери',
    },
  ];

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
              {deliveryOptions.map(i => {
                const isSelected = i.type === selectedOption;

                return (
                  <Chip key={`_${i.type}`} label={i.title} selected={isSelected} onPress={()=> {setSelectedOption(i.type);}} />
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
              {paymentMethods.map(i => {
                const isSelected = i.type === selectedMethod;

                return (
                  <Chip key={`_${i.type}`} label={i.title} selected={isSelected} onPress={()=> {setSelectedMethod(i.type);}} />
                );
              })
              }
            </Row>
          </View>

          <View style={itemStyle}>
            <Row style={{ justifyContent: 'flex-end', padding: 12 }}>
              <TextUI size={'title'} style={{ color: 'green' }} text={`итого: ${CartDataStore.cartSum + SettingsVars.shippingCost} ₽`} />
            </Row>
            <Row style={{ justifyContent: 'center' }}>
              {isUserProfileError && (
                <TextUI size={'medium'} text={'Заполните данные профиля'} style={{ color: ColorsVars.red }} />
              )}
            </Row>
            <Row style={{ alignItems: 'center', height: 80, justifyContent: 'center' }}>
              <ButtonUI title={'Подтвердить'} style={{ width: '50%' }} disabled={isUserProfileError} />
            </Row>
          </View>

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
    paddingVertical: 6,
    paddingHorizontal: 16,
  },

});

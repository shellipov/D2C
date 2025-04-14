import React from 'react';
import { FlatList, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { ButtonUI } from '../../ui/ButtonUI';
import { ColorsVars } from '../../../settings';
import { Row } from '../../shared/Row';
import { Col } from '../../shared/Col';
import { IOrder } from '../../../api/OrderDataStore';
import { FlatListVars } from '../../../settings/FlatList.vars';
import { Screen } from '../../shared/Screen';

export interface IScreenOrderProps {
    order: IOrder
}

export const ScreenOrder = observer((props: { route: { params: IScreenOrderProps }}) => {
  const navigation = useNavigationHook();
  const isDarkMode = useColorScheme() === 'dark';
  const { user, cart, date, deliveryOption, paymentMethod, totalSum, shippingCost } = props.route.params.order;

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
    <Screen style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>
      <Row style={{ paddingHorizontal: 16 }}>
        <ButtonUI title={'Назад'} style={{ height: 40, borderRadius: 20, alignSelf: 'flex-start' }} onPress={()=> navigation.goBack()} />
      </Row>
      <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TextUI size={'bigTitle'} text={'Заказ успешно создан'} style={{ paddingVertical: 35, color: ColorsVars.green }} />
      </Row>
      <View style={[backgroundStyle, { flex: 1 }]}>
        <ScrollView style={[viewStyle, styles.scrollView]}>

          <View style={[itemStyle, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
            <Row style={[styles.item, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Время'} />
              <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={`${date}`} />
            </Row>
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
            <Row style={[styles.item, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Способ достаки'} />
              <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={deliveryOption.title} />
            </Row>
            <Row style={[styles.item, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Способ оплаты'} />
              <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={paymentMethod.title} />
            </Row>
          </View>

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
              <TextUI size={'medium'} text={`${shippingCost} ₽`} />
            </Row>
          </View>

          <View style={itemStyle}>
            <Row style={{ justifyContent: 'flex-end', padding: 12 }}>
              <TextUI size={'title'} style={{ color: 'green' }} text={`итого: ${totalSum} ₽`} />
            </Row>
          </View>

        </ScrollView>
        <Col>
          <Row style={{ paddingHorizontal: 16, paddingBottom: 40, justifyContent: 'center' }}>
            <ButtonUI title={'Ok'} style={styles.button} onPress={()=> navigation.goBack()} />
          </Row>
        </Col>
      </View>
    </Screen>
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
  button: {
    width: '35%',
    marginHorizontal: 8,
    backgroundColor: ColorsVars.white,
    borderColor: ColorsVars.gray,
  },
});

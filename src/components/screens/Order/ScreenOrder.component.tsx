import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '@/hooks/useNavigation';
import { ButtonUI } from '../../ui/ButtonUI';
import { Row } from '@shared/Row';
import { Col } from '@shared/Col';
import { IOrder } from '@/api';
import { Screen } from '@shared/Screen';
import { OrderCartItem } from './components';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface IScreenOrderProps {
    order: IOrder
}

export const ScreenOrder = observer((props: { route: { params: IScreenOrderProps }}) => {
  const navigation = useNavigationHook();
  const { user, cart, date, deliveryOption, paymentMethod, totalSum, shippingCost } = props.route.params.order;
  const theme = useAppTheme();
  const { color } = theme;

  const itemColor = { backgroundColor: color.bgAdditionalTwo, borderColor: color.bgAdditionalTwo };

  return (
    <Screen>
      <Row style={{ paddingHorizontal: 16 }}>
        <ButtonUI title={'Назад'} style={{ height: 40, borderRadius: 20, alignSelf: 'flex-start' }} onPress={()=> navigation.goBack()} />
      </Row>
      <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TextUI size={'bigTitle'} text={'Заказ успешно создан'} style={{ paddingVertical: 35, color: color.textGreen }} />
      </Row>
      <View style={styles.block}>
        <ScrollView style={[styles.scrollView, { backgroundColor: color.bgAdditional, borderColor: color.bgAdditional }]}>

          <View style={[itemColor, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
            <Row style={[styles.row, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Время'} />
              <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={`${date}`} />
            </Row>
            <Row style={[styles.row, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Имя'} />
              <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={user?.name} />
            </Row>
            <Row style={[styles.row, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Телефон'} />
              <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={user?.phone} />
            </Row>
            <Row style={[styles.row, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Адрес'} />
              <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={user?.address} />
            </Row>
            <Row style={[styles.row, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Способ достаки'} />
              <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={deliveryOption.title} />
            </Row>
            <Row style={[styles.row, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Способ оплаты'} />
              <TextUI size={'medium'} numberOfLines={1} style={{ maxWidth: '70%', alignSelf: 'flex-end' }} text={paymentMethod.title} />
            </Row>
          </View>

          <Col style={styles.container}>
            {cart.map(OrderCartItem)}
          </Col>

          <View style={[itemColor, { marginBottom: 10, paddingTop: 4, paddingBottom: 2 }]}>
            <Row style={[styles.row, { justifyContent: 'space-between' }]}>
              <TextUI size={'large'} text={'Стоимость доставки'} />
              <TextUI size={'medium'} text={`${shippingCost} ₽`} />
            </Row>
          </View>

          <View style={itemColor}>
            <Row style={{ justifyContent: 'flex-end', padding: 12 }}>
              <TextUI size={'title'} style={{ color: color.textGreen }} text={`итого: ${totalSum} ₽`} />
            </Row>
          </View>

        </ScrollView>
        <Col>
          <Row style={{ paddingHorizontal: 16, paddingBottom: 40, justifyContent: 'center' }}>
            <ButtonUI title={'Ok'} type={'white'} style={styles.button} onPress={()=> navigation.goBack()} />
          </Row>
        </Col>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  block: {
    flex: 1,
    // backgroundColor: Colors.lighter,
  },
  container: {
    marginBottom: 10,
  },
  row: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  button: {
    width: '35%',
    marginHorizontal: 8,
  },
});

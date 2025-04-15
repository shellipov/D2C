import React from 'react';
import { ICartItem } from '../../../../api';
import { Row } from '../../../shared/Row';
import { Col } from '../../../shared/Col';
import { StyleSheet, View } from 'react-native';
import { TextUI } from '../../../ui/TextUI';
import { ColorsVars } from '../../../../settings';


export function OrderCartItem (item: ICartItem) {
  return (
    <Row style={[styles.item, styles.row]} key={`cart_item_ ${item.product.id}`}>
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
    </Row>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: ColorsVars.white,
    borderColor: ColorsVars.white,
  },
  row: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});


import React, { useCallback } from 'react';
import { Row } from '@shared/Row';
import { Col } from '@shared/Col';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from '../../../ui/TextUI';
import { ButtonUI } from '../../../ui/ButtonUI';
import { useNavigationHook } from '@/hooks/useNavigation';
import { ICartDataStore, ICartItem } from '@/api';
import { eventCreator } from '@/helpers';
import { EventDataStore, EventTypeEnum, ISimplifiedEventData } from '../../../../api/EventDataStore';
import { observer } from 'mobx-react';
import { IUserDataStore, ProductDataStore } from '../../../../api';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';

export interface ICardItemProps{
    item: ICartItem
}

export const CardItem = observer((props: ICardItemProps)=> {
  const item = props.item;
  const navigation = useNavigationHook();
  const cartStore = useInjection<ICartDataStore>(TYPES.CartDataStore);
  const eventStore = EventDataStore;
  const userStore = useInjection<IUserDataStore>(TYPES.UserDataStore);
  const productStore = ProductDataStore;

  const getEventData = () => ({
    user: userStore.model.simplifiedUser,
    product: productStore.getSimplifiedProduct(item.product.id),
    cartInfo: cartStore.model.cartInfo,
  }) as ISimplifiedEventData;
  const theme = useAppTheme();

  const itemStyle = {
    backgroundColor: theme.color.bgBasic,
    borderColor: theme.color.bgBasic,
  };

  const onAddToCart = useCallback(async ()=> {
    if (!!item) {
      await cartStore.addToCart(item.product);
      const newEvent = eventCreator({ ...getEventData(), eventType: EventTypeEnum.AddToCart });
      if (!!newEvent) {
        eventStore.addEvent(newEvent).then();
      }
    }
  }, [item, cartStore.model.data?.length]);

  const onDeleteFromCart = useCallback(async ()=> {
    if (!!item) {
      await cartStore.deleteFromCart(item.product).then();
      const newEvent = eventCreator({ ...getEventData(), eventType: EventTypeEnum.DeleteFromCart });
      if (!!newEvent) {
        eventStore.addEvent(newEvent).then();
      }
    }
  }, [item, cartStore.model.data?.length]);

  const onPressCard = useCallback(()=> {
    navigation.navigate('ProductCard', { id: item.product.id });
  }, [item.product.id]);

  return (
    <TouchableOpacity style={[itemStyle, styles.item]} onPress={onPressCard}>
      <Row style={{ flex: 1 }}>
        <Col style={{ flex: 1, marginRight: 16, backgroundColor: theme.color.bgGray, borderRadius: 12 }}>
          <Image src={item.product.image} resizeMode="cover" style={styles.image} />
        </Col>
        <Col style={{ flex: 2 }}>
          <View style={{ marginVertical: 6 }}>
            <TextUI text={item.product.name} size={'large'} numberOfLines={1} />
          </View>
          <View style={{ marginVertical: 4 }}>
            <TextUI text={item.product.description} size={'small'} numberOfLines={1} />
          </View>
          <View style={{ marginVertical: 4 }}>
            <TextUI text={item.product.price + ' ₽'} size={'medium'} style={{ color: theme.color.textGreen }} />
          </View>
          <Row style={{ marginVertical: 4, alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <TextUI text={`в корзине - ${item.numberOfProducts} шт.`} size={'medium'} />
            <Row>
              <ButtonUI title={'-'} style={[styles.button, { marginRight: 8 }]} onPress={onDeleteFromCart} />
              <ButtonUI title={'+'} style={styles.button} onPress={onAddToCart} />
            </Row>
          </Row>
        </Col>
      </Row>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
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

// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import { observer } from 'mobx-react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
import { First } from '@shared/Firts';
import { CartBlockComponent } from '@shared/CartBlock';
import { NavBar } from '@shared/NavBar';
import { Screen } from '@shared/Screen';
import { eventCreator } from '@/helpers';
import { CartDataStore, ProductDataStore, UserDataStore } from '@/api';
import { EventDataStore, EventTypeEnum, ISimplifiedEventData } from '@/api/EventDataStore';
import { TextUI } from '@components/ui/TextUI';
import { ButtonUI } from '@components/ui/ButtonUI';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface IScreenProductCardProps {
    id: number;
}

export const ScreenProductCard = observer((props: { route: { params: IScreenProductCardProps }}) => {
  const cartStore = CartDataStore;
  const eventStore = EventDataStore;
  const userStore = UserDataStore;
  const productStore = ProductDataStore;
  const id = props.route.params.id;
  const item = productStore.getProduct(id);
  const isInCart = cartStore.isInCart(item);
  const totalCount = cartStore.totalCount(item);
  const theme = useAppTheme();

  const isError = CartDataStore.isError || EventDataStore.isError || UserDataStore.isError || ProductDataStore.isError;

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
  };

  const getEventData = () => ({
    user: userStore.simplifiedUser,
    product: productStore.getSimplifiedProduct(id),
    cartInfo: cartStore.cartInfo,
  }) as ISimplifiedEventData;

  const onAddToCart = useCallback(async ()=>{
    if (!!item) {
      await cartStore.addToCart(item);
      const newEvent = eventCreator({ ...getEventData(), eventType: EventTypeEnum.AddToCart });
      if (!!newEvent) {
        eventStore.addEvent(newEvent).then();
      }
    }
  }, [item, cartStore.cart?.length]);

  const onDeleteFromCart = useCallback(async ()=> {
    if (!!item) {
      await cartStore.deleteFromCart(item).then();
      const newEvent = eventCreator({ ...getEventData(), eventType: EventTypeEnum.DeleteFromCart });
      if (!!newEvent) {
        eventStore.addEvent(newEvent).then();
      }
    }
  }, [item, cartStore.cart?.length]);

  if (!item) {
    return null;
  }

  return (
    <Screen isError={isError} onRefresh={onRefresh}>
      <NavBar title={'Карточка товара'} />
      <ScrollView style={{ backgroundColor: theme.color.bgAdditional }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={ [styles.imageView, { backgroundColor: theme.color.bgGray }]}>
            <Image src={item?.image} resizeMode="cover" style={styles.image} />
          </View>
          <View style={{ flex: 2, flexDirection: 'column', paddingHorizontal: 24 }}>
            <View style={{ marginVertical: 8 }}>
              <TextUI text={item?.name} size={'title'} numberOfLines={1} />
            </View>
            <View style={{ marginVertical: 6 }}>
              <TextUI text={item?.description} size={'large'} numberOfLines={1} />
            </View>
            <View style={{ marginVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={'star'} size={24} color={theme.color.elementPrimary} />
              <TextUI text={` - ${item?.productRating}`} size={'medium'} />
            </View>
            <View style={{ marginVertical: 6 }}>
              <TextUI text={item?.price + ' ₽'} size={'title'} style={{ color:theme.color.textGreen }} />
            </View>
            <View style={{ marginVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
              <TextUI text={`осталось ${item?.quantityOfGoods} шт.`} size={'medium'} />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBlock}>
        {/* TODO: пока не работает */}
        <ButtonUI title={'в избранное'} style={{ width: '48%' }} disabled={true} />
        <View style={{ width: '48%' }}>
          <First>
            {isInCart && (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <ButtonUI title={'-'} style={{ flex: 1 }} onPress={onDeleteFromCart} />
                <TextUI text={`${totalCount}`} size={'title'} style={{ marginHorizontal: 16 }} />
                <ButtonUI title={'+'} style={{ flex: 1 }} onPress={onAddToCart} />
              </View>
            )}
            <ButtonUI title={'в корзину'} style={{ width: '100%' }} onPress={onAddToCart} />
          </First>
        </View>
      </View>
      <View style={{ position: 'absolute', right: 16, bottom: 124 }}>
        <CartBlockComponent />
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  imageView: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    height: 350,
  },
  image: {
    flex: 1,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  bottomBlock: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
});

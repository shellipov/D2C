// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import { observer } from 'mobx-react';
import { Image, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React, { useCallback } from 'react';
import { ProductDataStore } from '../../../api';
import { TextUI } from '../../ui/TextUI';
import { ButtonUI } from '../../ui/ButtonUI';
import { CartDataStore } from '../../../api/CartDataStore';
import { First } from '../../shared/Firts';
import { CartBlockComponent } from '../../shared/CartBlock';
import { NavBar } from '../../shared/NavBar';
import { Screen } from '../../shared/Screen';
import { EventDataStore, EventTypeEnum, ISimplifiedEventData } from '../../../api/EventDataStore';
import { UserDataStore } from '../../../api/UserDataStore';
import { eventCreator } from '../../../helpers/eventCreator';
import { ColorsVars } from '../../../settings';

export interface IScreenProductCardProps {
    id: number;
}

export const ScreenProductCard = observer((props: { route: { params: IScreenProductCardProps }}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const cartStore = CartDataStore;
  const eventStore = EventDataStore;
  const userStore = UserDataStore;
  const productStore = ProductDataStore;
  const id = props.route.params.id;
  const item = productStore.getProduct(id);
  const isInCart = cartStore.isInCart(item);
  const totalCount = cartStore.totalCount(item);

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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onAddToCart = useCallback(async ()=>{
    if (!!item) {
      await cartStore.addToCart(item);
      const newEvent = eventCreator({ ...getEventData(), eventType: EventTypeEnum.AddToCart });
      if (!!newEvent) {
        eventStore.addEvent(newEvent).then();
      }
    }
  }, [item, cartStore.cart?.length]);

  // тут норм
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
    <Screen
      style={styles.screen}
      isError={isError}
      onRefresh={onRefresh}>
      <NavBar title={'Карточка товара'} />
      <ScrollView style={backgroundStyle}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={ styles.imageView}>
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
              <Ionicons name={'star'} size={24} color={'orange'} />
              <TextUI text={` - ${item?.productRating}`} size={'medium'} />
            </View>
            <View style={{ marginVertical: 6 }}>
              <TextUI text={item?.price + ' ₽'} size={'title'} style={{ color:'green' }} />
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
  screen: {
    flex: 1,
    backgroundColor: ColorsVars.white,
  },
  imageView: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'gray',
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

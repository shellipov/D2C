// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity } from 'react-native';
import { TextUI } from '../../ui/TextUI';
import { CartDataStore } from '../../../api/CartDataStore';
import { useNavigationHook } from '../../../hooks/useNavigation';

export const CartBlockComponent = observer(()=> {
  const navigation = useNavigationHook();
  const [size, setSize] = useState<number>(0);
  const sizes = size ? { height: size, width: size, borderRadius: size / 2 } : {};

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const maxSize = Math.max(e.nativeEvent.layout.height, e.nativeEvent.layout.width);
    setSize(Math.ceil(maxSize / 2) * 2);
  }, [CartDataStore.cartSum]);

  useEffect(() => {
    if (CartDataStore.isEmpty) {
      CartDataStore.refresh().then();
    }
  }, [CartDataStore.isEmpty]);


  return (
    <TouchableOpacity
      style={[styles.cartBlock, sizes]} onLayout={onLayout}
      onPress={()=> navigation.navigate('Main', { screen: 'ShoppingCart' })}>
      <Ionicons name={'shoppingcart'} size={28} color={'black'} />
      <TextUI size={'small'} style={{ color: 'green' }} text={`${CartDataStore.cartSum} ₽`} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cartBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    padding: 12,
    alignSelf: 'flex-start',
  },
});

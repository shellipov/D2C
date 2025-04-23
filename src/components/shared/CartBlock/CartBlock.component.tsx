// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '@/hooks/useNavigation';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { ICartDataStore } from '@/api';
import { TYPES } from '@/boot/IoC/types';

export const CartBlockComponent = observer(()=> {
  const navigation = useNavigationHook();
  const theme = useAppTheme();
  const cartStore = useInjection<ICartDataStore>(TYPES.CartDataStore);

  useEffect(() => {
    if (cartStore.isEmpty) {
      cartStore.refresh().then();
    }
  }, [cartStore.isEmpty]);

  const backgroundColor = { backgroundColor: theme.color.elementPrimary };


  return (
    <TouchableOpacity
      style={[styles.cartBlock, backgroundColor]} onPress={()=> navigation.navigate('Cart')}>
      <Ionicons name={'shoppingcart'} size={28} color={theme.color.black} />
      <TextUI size={'small'} style={{ color: theme.color.textGreen }} text={`${cartStore.model.cartSum} ₽`} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cartBlock: {
    height: 88,
    width: 88,
    borderRadius: 44,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    alignSelf: 'flex-start',
  },
});

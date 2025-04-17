// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { TextUI } from '../../ui/TextUI';
import { CartDataStore } from '../../../api/CartDataStore';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { Theme } from '../../../store';

export const CartBlockComponent = observer(()=> {
  const navigation = useNavigationHook();

  useEffect(() => {
    if (CartDataStore.isEmpty) {
      CartDataStore.refresh().then();
    }
  }, [CartDataStore.isEmpty]);

  const backgroundColor = { backgroundColor: Theme.color.elementPrimary };


  return (
    <TouchableOpacity
      style={[styles.cartBlock, backgroundColor]} onPress={()=> navigation.navigate('Cart')}>
      <Ionicons name={'shoppingcart'} size={28} color={Theme.color.black} />
      <TextUI size={'small'} style={{ color: Theme.color.textGreen }} text={`${CartDataStore.cartSum} ₽`} />
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

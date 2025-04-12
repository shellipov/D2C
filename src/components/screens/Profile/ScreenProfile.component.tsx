import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { CartDataStore } from '../../../api/CartDataStore';
import { ButtonUI } from '../../ui/ButtonUI';
import { AuthDataStore } from '../../../api/AuthDataStore';
import { Row } from '../../shared/Row';
import { TextInputUI } from '../../ui/TextInputUI';
import { Col } from '../../shared/Col';
import { ColorsVars } from '../../../settings';

export interface IScreenProfileProps {}

export const ScreenProfile = observer((props: { route: { params: IScreenProfileProps }}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const authStore = AuthDataStore;
  const cartStore = CartDataStore;
  const navigation = useNavigationHook();

  const [name, setName] = useState(authStore.user?.name);
  const [phone, setPhone] = useState(authStore.user?.phone);
  const [address, setAddress] = useState(authStore.user?.address);

  useEffect(() => {
    authStore.updateAuthUserFields({ name, phone, address }).then();
  }, [name, phone, address]);

  const onChangeName = useCallback((text: string) => {
    setName(text);
  }, [name]);
  const onChangePhone = useCallback((text: string) => {
    setPhone(text);
  }, [name]);
  const onChangeAddress = useCallback((text: string) => {
    setAddress(text);
  }, [name]);


  const logout = useCallback(()=> {
    Alert.alert(
      'Выйти из приложения?',
      'Ваша корзина удалится',
      [
        { text: 'Да', onPress: () => {authStore.logout().then();cartStore.deleteCart().then();} },
        { text: 'Нет' },
      ]);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>

        <View style={[{ paddingHorizontal: 8, alignItems: 'flex-end' }]}>
          <ButtonUI title={'Выйти'} textColor={'white'} style={{ backgroundColor: ColorsVars.red, borderColor: ColorsVars.red }} onPress={logout} />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TextUI size={'title'} text={'Профиль'} style={{ paddingVertical: 35 }} />
        </View>

        <View style={styles.userDataBlock}>
          <Row style={styles.row}>
            <Col>
              <TextUI size={'large'} text={'Имя'} />
              <TextInputUI value={name} textSize={'medium'} style={styles.inputCenter} onChangeText={onChangeName} />
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col>
              <TextUI size={'large'} text={'Телефон'} />
              <TextInputUI textSize={'medium'} keyboardType={'numeric'} style={styles.inputCenter} value={phone} onChangeText={onChangePhone} />
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col>
              <TextUI size={'large'} text={'Адрес'} />
              <TextInputUI value={address} textSize={'small'} style={[styles.inputCenter, { minHeight: 50 }]} onChangeText={onChangeAddress} multiline={true} />
            </Col>
          </Row>
        </View>

        <View style={{ alignItems: 'center', height: 80, justifyContent: 'center' }}>
          <ButtonUI title={'К покупкам'} style={{ width: '50%' }} onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  userDataBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row: {
    paddingVertical: 8,
  },
  inputCenter: {
    textAlign: 'center',
  },
});

import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { CartDataStore } from '../../../api/CartDataStore';
import { ButtonUI } from '../../ui/ButtonUI';
import { UserDataStore } from '../../../api/AuthDataStore';
import { Row } from '../../shared/Row';
import { TextInputUI } from '../../ui/TextInputUI';
import { Col } from '../../shared/Col';
import { ColorsVars } from '../../../settings';

export interface IScreenProfileProps {}

export const ScreenProfile = observer((props: { route: { params: IScreenProfileProps }}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const userStore = UserDataStore;
  const cartStore = CartDataStore;
  const navigation = useNavigationHook();

  const [name, setName] = useState(userStore.user?.name);
  const [phone, setPhone] = useState(userStore.user?.phone);
  const [address, setAddress] = useState(userStore.user?.address);

  useEffect(() => {
    userStore.updateAuthUserFields({ name, phone, address }).then();
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
        { text: 'Да', onPress: () => {userStore.logout().then();cartStore.deleteCart().then();} },
        { text: 'Нет' },
      ]);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>

        <View style={[{ paddingHorizontal: 16 }]}>
          <Row style={{ justifyContent: 'space-between' }}>
            <ButtonUI title={'Назад'} style={{ height: 40, borderRadius: 20 }} onPress={navigation.goBack} />
            <ButtonUI title={'Выйти'} textColor={'white'} style={{ backgroundColor: ColorsVars.red, borderColor: ColorsVars.red }} onPress={logout} />
          </Row>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TextUI size={'bigTitle'} text={'Профиль'} style={{ paddingVertical: 35 }} />
        </View>

        <View style={styles.userDataBlock}>
          <Row style={styles.row}>
            <Col>
              <TextUI size={'large'} text={'Имя'} />
              <TextInputUI
                value={name}
                textSize={'medium'}
                style={[styles.inputCenter, { borderColor: !name ? ColorsVars.red : ColorsVars.gray }]}
                onChangeText={onChangeName} />
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col>
              <TextUI size={'large'} text={'Телефон'} />
              <TextInputUI
                textSize={'medium'}
                keyboardType={'numeric'}
                style={[styles.inputCenter, { borderColor: !phone ? ColorsVars.red : ColorsVars.gray }]}
                value={phone}
                onChangeText={onChangePhone} />
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col>
              <TextUI size={'large'} text={'Адрес'} />
              <TextInputUI
                value={address}
                textSize={'small'}
                style={[styles.inputCenter, { borderColor: !address ? ColorsVars.red : ColorsVars.gray }, { minHeight: 50 }]}
                onChangeText={onChangeAddress} multiline={true} />
            </Col>
          </Row>
        </View>

        <View>
          <Row style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
            <ButtonUI
              title={'Заказы'}
              style={styles.button}
              onPress={() => navigation.navigate('OrderList')} />
            <ButtonUI
              title={'Статистика'}
              style={styles.button}
              onPress={() => navigation.goBack()} />
          </Row>
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
    paddingVertical: 4,
  },
  inputCenter: {
    textAlign: 'center',
  },
  button: {
    width: '35%',
    marginHorizontal: 8,
    backgroundColor: ColorsVars.white,
    borderColor: ColorsVars.gray },
});

import { Keyboard, StyleSheet, TouchableWithoutFeedback, useColorScheme, ViewStyle } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React, { useCallback, useEffect, useMemo } from 'react';
import { TextUI } from '../../ui/TextUI';
import { TextInputUI } from '../../ui/TextInputUI';
import { ButtonUI } from '../../ui/ButtonUI';
import { UserDataStore } from '../../../api/AuthDataStore';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { observer } from 'mobx-react';
import { Col } from '../../shared/Col';
import { Screen } from '../../shared/Screen';

export interface IScreenAuthProps {}
 type Props = IScreenAuthProps | undefined

export const ScreenAuth = observer((props: Props) => {
  const userStore = UserDataStore;
  const isDarkMode = useColorScheme() === 'dark';
  const [name, setName] = React.useState<string>('');
  const navigation = useNavigationHook();

  useEffect(() => {
    if (userStore.isAuth) {
      navigation.navigate('Main');
    }
  }, [userStore.isAuth]);

  const blockStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle;

  const onChangeText = useCallback((text: string) => {
    setName(text);
  }, [name]);

  const onPressLogin = useCallback(() => {
    userStore.login(name).then();
  }, [name]);

  const isButtonDisabled = useMemo(()=> name.length < 4, [name]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Screen style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>
        <Col style={blockStyle}>
          <TextUI text={'Введите Ваш ник'} size={'title'} />
          <TextUI text={'и постарайтесь не забыть его'} size={'small'} />
          <TextInputUI value={name} textSize={'large'} onChangeText={onChangeText} style={styles.input} />
          <ButtonUI title={'Войти'} onPress={onPressLogin} disabled={isButtonDisabled} />
        </Col>
      </Screen>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  input: { textAlign: 'center' },
});

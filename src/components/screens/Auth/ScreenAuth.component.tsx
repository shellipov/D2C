import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React, { useCallback, useEffect, useMemo } from 'react';
import { TextUI } from '../../ui/TextUI';
import { TextInputUI } from '../../ui/TextInputUI';
import { ButtonUI } from '../../ui/ButtonUI';
import { useNavigationHook } from '@/hooks/useNavigation';
import { observer } from 'mobx-react';
import { Col } from '@shared/Col';
import { Screen } from '@shared/Screen';
import { useInjection } from 'inversify-react';
import { IUserDataStore } from '@/api';
import { TYPES } from '@/boot/IoC/types';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface IScreenAuthProps {}
 type Props = IScreenAuthProps | undefined

export const ScreenAuth = observer((props: Props) => {
  const userStore = useInjection<IUserDataStore>(TYPES.UserDataStore);
  const [name, setName] = React.useState<string>('');
  const navigation = useNavigationHook();
  const theme = useAppTheme();
  const isButtonDisabled = useMemo(()=> name.length < 4, [name]);

  useEffect(() => {
    if (userStore.isAuth) {
      navigation.navigate('Main');
    }
  }, [userStore.isAuth]);

  const onChangeText = useCallback((text: string) => {
    setName(text);
  }, [name]);

  const onPressLogin = useCallback(() => {
    userStore.login(name).then();
    setName('');
  }, [name]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Screen isError={userStore.isError} onRefresh={userStore.refresh}>
        <Col style={[styles.block, { backgroundColor: theme.color.bgAdditionalTwo }]}>
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
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: { textAlign: 'center' },
});

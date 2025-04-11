import { SafeAreaView, StatusBar, useColorScheme, View, ViewStyle } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React, { useCallback, useEffect, useMemo } from 'react';
import { TextUI } from '../../ui/TextUI/TextUI.component';
import { TextInputUI } from '../../ui/TextInputUI/TextInputUI.component';
import { ButtonUI } from '../../ui/ButtonUI';
import { AuthDataStore } from '../../../api/AuthDataStore';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { observer } from 'mobx-react';

export interface IScreenAuthProps {}
 type Props = IScreenAuthProps | undefined

export const ScreenAuth = observer((props: Props) => {
  const AuthStore = AuthDataStore;
  const isDarkMode = useColorScheme() === 'dark';
  const [name, setName] = React.useState<string>('');
  const navigation = useNavigationHook();

  useEffect(() => {
    if (AuthStore.isAuth) {
      navigation.navigate('Main');
    }
  }, [AuthStore.isAuth]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle;

  const onChangeText = useCallback((text: string) => {
    setName(text);
  }, [name]);

  const onPressLogin = useCallback(() => {
    AuthStore.login(name).then();
  }, [name]);

  const isButtonDisabled = useMemo(()=> name.length < 4, [name]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>
      <View style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor} />
        <View style={backgroundStyle}>
          <TextUI text={'Enter your name'} size={'title'} />
          <TextUI text={'And try not to forget'} size={'small'} />
          <TextInputUI value={name} onChangeText={onChangeText} />
          <ButtonUI title={'Login'} onPress={onPressLogin} disabled={isButtonDisabled} />
        </View>
      </View>
    </SafeAreaView>
  );
});

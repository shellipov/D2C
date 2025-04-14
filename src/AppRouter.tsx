import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, ScreenName } from './AppPouter.types';
import { ScreenAuth } from './components/screens/Auth';
import { UserDataStore } from './api/UserDataStore';
import { observer } from 'mobx-react';
import { ScreenCategory } from './components/screens/Category';
import { ScreenShoppingCart } from './components/screens/ShoppingСart';
import { ScreenProductCard } from './components/screens/ProductCard';
import { ScreenCreateOrder } from './components/screens/CreateOrder';
import { ScreenProfile } from './components/screens/Profile';
import { ScreenOrder } from './components/screens/Order';
import { ScreenOrderList } from './components/screens/OrderList';
import { ScreenStatistics } from './components/screens/Statistics';
import { ScreenErrors } from './components/screens/Errors';
import { ScreenMain } from './components/screens/Main';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { TextUI } from './components/ui/TextUI';
import { ButtonUI } from './components/ui/ButtonUI';
import { ColorsVars } from './settings';

export const AppRouter = observer(() => {
  const { isError, isEmpty, isAuth } = UserDataStore;

  useEffect(() => {
    UserDataStore.refresh().then();
  }, [isAuth]);

  const NOT_AUTH_SCREENS: { [key in ScreenName]?: { screen: React.ComponentType<any>; navigationOptions?: any } } = {
    Auth: { screen: ScreenAuth },
  };

  const AUTH_SCREENS: { [key in ScreenName]?: { screen: React.ComponentType<any>; navigationOptions?: any } } = {
    Main: { screen: ScreenMain },
    ShoppingCart: { screen: ScreenShoppingCart },
    Category: { screen: ScreenCategory },
    ProductCard: { screen: ScreenProductCard },
    CreateOrder: { screen: ScreenCreateOrder },
    Profile: { screen: ScreenProfile },
    Order: { screen: ScreenOrder },
    OrderList: { screen: ScreenOrderList },
    Statistics: { screen: ScreenStatistics },
    Errors: { screen: ScreenErrors },
  };

  const Stack = createNativeStackNavigator<RootStackParamList>();

  if (isError && isEmpty) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.errorView}>
          <TextUI size={'bigTitle'} style={styles.errorText} text={'Ошибка обновления\nданных'} />
          <ButtonUI title={'Обновить'} style={styles.button} textColor={ColorsVars.red} onPress={UserDataStore.refresh} />
        </View>
      </SafeAreaView>
    );
  }

  if (UserDataStore.isEmpty) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={UserDataStore.isAuth ? 'Main' : 'Auth'} screenOptions={{ headerShown: false }}>
        {UserDataStore.isAuth && (
          (Object.keys(AUTH_SCREENS) as (keyof typeof AUTH_SCREENS)[]).map((name) => (
            <Stack.Screen
              key={name} name={name} component={AUTH_SCREENS[name]!.screen}
              options={AUTH_SCREENS[name]!.navigationOptions} />
          )))}
        {(Object.keys(NOT_AUTH_SCREENS) as (keyof typeof NOT_AUTH_SCREENS)[]).map((name) => (
          <Stack.Screen
            key={name} name={name} component={NOT_AUTH_SCREENS[name]!.screen}
            options={NOT_AUTH_SCREENS[name]!.navigationOptions} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ColorsVars.white,
  },
  errorView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  errorText: {
    color: ColorsVars.red,
    textAlign: 'center',
  },
  button: {
    backgroundColor: ColorsVars.white,
    borderColor: ColorsVars.red,
    marginTop: 60,
  },
});

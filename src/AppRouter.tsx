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
import { ScreenHome } from './components/screens/Home';
import { ScreenCreateOrder } from './components/screens/CreateOrder';
import { ScreenProfile } from './components/screens/Profile';
import { ScreenOrder } from './components/screens/Order';
import { ScreenOrderList } from './components/screens/OrderList';
import { ScreenStatistics } from './components/screens/Statistics';

export const AppRouter = observer(() => {
  const userStore = UserDataStore;

  useEffect(() => {
    userStore.refresh().then();
  }, [userStore.isAuth]);

  const NOT_AUTH_SCREENS: { [key in ScreenName]?: { screen: React.ComponentType<any>; navigationOptions?: any } } = {
    Auth: { screen: ScreenAuth },
  };

  const AUTH_SCREENS: { [key in ScreenName]?: { screen: React.ComponentType<any>; navigationOptions?: any } } = {
    Main: { screen: ScreenHome },
    ShoppingCart: { screen: ScreenShoppingCart },
    Category: { screen: ScreenCategory },
    ProductCard: { screen: ScreenProductCard },
    CreateOrder: { screen: ScreenCreateOrder },
    Profile: { screen: ScreenProfile },
    Order: { screen: ScreenOrder },
    OrderList: { screen: ScreenOrderList },
    Statistics: { screen: ScreenStatistics },
  };

  const Stack = createNativeStackNavigator<RootStackParamList>();

  if (userStore.isEmpty) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userStore.isAuth ? 'Main' : 'Auth'} screenOptions={{ headerShown: false }}>
        {userStore.isAuth && (
          (Object.keys(AUTH_SCREENS) as (keyof typeof AUTH_SCREENS)[]).map((name) => (
            <Stack.Screen
              key={name} name={name} component={AUTH_SCREENS[name]!.screen}
              options={AUTH_SCREENS[name]!.navigationOptions} />
          ))
        )}
        {(Object.keys(NOT_AUTH_SCREENS) as (keyof typeof NOT_AUTH_SCREENS)[]).map((name) => (
          <Stack.Screen
            key={name} name={name} component={NOT_AUTH_SCREENS[name]!.screen}
            options={NOT_AUTH_SCREENS[name]!.navigationOptions} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
});

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Tabs } from './Tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList, ScreenName } from './AppPouter.types';
import { ScreenAuth } from './components/screens/Auth';
import { AuthDataStore } from './api/AuthDataStore';
import { observer } from 'mobx-react';

export const AppRouter = observer(() => {
  const AuthStore = AuthDataStore;

  useEffect(() => {
    AuthStore.refresh().then();
  }, [AuthStore.isAuth]);


  const screenSettings = (title: string) => {
    return {
      title,
      headerShown: true,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'orange',
      },
      headerBackTitle: 'Back',
    } as NativeStackNavigationOptions;
  };

  const NOT_AUTH_SCREENS: { [key in ScreenName]?: { screen: React.ComponentType<any>; navigationOptions?: any } } = {
    Auth: { screen: ScreenAuth },
  };

  const AUTH_SCREENS: { [key in ScreenName]?: { screen: React.ComponentType<any>; navigationOptions?: any } } = {
    Main: { screen: Tabs },
  };

  const Stack = createNativeStackNavigator<RootStackParamList>();

  if (AuthStore.isEmpty) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={AuthStore.isAuth ? 'Main' : 'Auth'} screenOptions={{ headerShown: false }}>
        {AuthStore.isAuth && (
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

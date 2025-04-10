import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Tabs } from './Tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList, ScreenName } from './AppPouter.types';

export default function AppRouter () {
  const isAuth = false;

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
    Main: { screen: Tabs },
  };

  const AUTH_SCREENS: { [key in ScreenName]?: { screen: React.ComponentType<any>; navigationOptions?: any } } = {};

  const Stack = createNativeStackNavigator<RootStackParamList>();

  const getId = ({ params }: any) => {
    return params?.key;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Main'} screenOptions={{ headerShown: false }}>
        {isAuth && (
          (Object.keys(AUTH_SCREENS) as (keyof typeof AUTH_SCREENS)[]).map((name) => (
            <Stack.Screen
              key={name} name={name} component={AUTH_SCREENS[name]!.screen}
              options={AUTH_SCREENS[name]!.navigationOptions} getId={getId} />
          ))
        )}
        {/* Если нет токена - значит пользователь точно не авторизован, и нет смысла строить все пути */}
        {(Object.keys(NOT_AUTH_SCREENS) as (keyof typeof NOT_AUTH_SCREENS)[]).map((name) => (
          <Stack.Screen
            key={name} name={name} component={NOT_AUTH_SCREENS[name]!.screen}
            options={NOT_AUTH_SCREENS[name]!.navigationOptions} getId={getId} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

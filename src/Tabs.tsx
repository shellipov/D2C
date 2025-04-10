import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import { useColorScheme } from 'react-native';
import { ScreenHome } from './components/screens/Home/ScreenHome.component';
import { ScreenShoppingCart } from './components/screens/ShoppingСart/ScreenShoppingCart.component';


const Tab = createBottomTabNavigator();

export function Tabs () {
  const colorScheme = useColorScheme();
  const isBlackTheme = colorScheme === 'dark';

  const tabOptions = (iconName: string) => {
    return { headerShown: false, tabBarLabel: '',
      tabBarIcon: ({ focused }: {focused: boolean}) => {
        const color = focused ? 'orange' : 'gray';
        const size = focused ? 30 : 28;

        return (<Ionicons name={iconName} size={size} color={color} />);
      } };
  };

  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: { backgroundColor: isBlackTheme ? 'rgb(24, 24, 24)' : 'white' } }}>
      <Tab.Screen
        name="HomePage"
        component={ScreenHome}
        options={tabOptions('home')} />
      <Tab.Screen
        name="ShoppingCart"
        component={ScreenShoppingCart}
        options={tabOptions('shoppingcart')} />
    </Tab.Navigator>
  );
}


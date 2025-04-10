import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';

export interface IScreenHomeProps {}

export function ScreenHome (props: IScreenHomeProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const safePadding = '5%';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>
      <View style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor} />
        <ScrollView
          style={backgroundStyle}>
          <View style={{ paddingRight: safePadding }}>
            <Ionicons name={'like2'} size={30} color={'orange'} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>

  );
}

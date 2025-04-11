import React from 'react';
import { ScrollView, StatusBar, useColorScheme, View } from 'react-native';
import { Colors, Header } from 'react-native/Libraries/NewAppScreen';
import { observer } from 'mobx-react';

export interface IScreenShoppingCartProps {}

export const ScreenShoppingCart = observer((props: IScreenShoppingCartProps) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor} />
      <ScrollView
        style={backgroundStyle}>
        <View style={{ paddingRight: safePadding }}>
          <Header />
        </View>
      </ScrollView>
    </View>
  );
});

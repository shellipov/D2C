import React from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppRouter } from './src/AppRouter';


function App (): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider style={{ backgroundColor: isDarkMode ? 'black' : 'white' }}>
        <AppRouter />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;

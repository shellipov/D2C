import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppRouter } from './src/AppRouter';
import { Theme } from './src/store';
import { useAppState } from './src/hooks/useAppState';


function App (): React.JSX.Element {
  const { isActive } = useAppState();
  useEffect(() => {
    if (isActive) {
      Theme.refresh().then();
    }
  }, [isActive]);


  return (
    <ThemeProvider value={Theme.isDark ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider style={{ backgroundColor: Theme.isDark ? 'black' : 'white' }}>
        <AppRouter />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;

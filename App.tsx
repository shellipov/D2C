import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppRouter } from '@/AppRouter';
import { Theme } from '@/store';
import { useAppState } from '@/hooks/useAppState';
import { InversifyReactProvider } from '@/boot/IoC/provider';

function App (): React.JSX.Element {
  const { isActive } = useAppState();
  useEffect(() => {
    if (isActive) {
      Theme.refresh().then();
    }
  }, [isActive]);


  return (
    <InversifyReactProvider>
      <SafeAreaProvider style={{ backgroundColor: Theme.color.bgBasic }}>
        <AppRouter />
      </SafeAreaProvider>
    </InversifyReactProvider>
  );
}

export default App;

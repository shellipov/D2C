import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState () {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);

    return () => subscription.remove();
  }, []);

  return {
    isActive: appState === 'active',
    appState,
  };
}

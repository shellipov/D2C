import React from 'react';
import { InversifyReactProvider } from '@/boot/IoC/provider';
import { RootComponent } from '@/boot/RootComponent';

function App (): React.JSX.Element {
  return (
    <InversifyReactProvider>
      <RootComponent />
    </InversifyReactProvider>
  );
}

export default App;

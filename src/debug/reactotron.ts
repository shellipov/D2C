import AsyncStorage from '@react-native-async-storage/async-storage';
import reactotron from 'reactotron-react-native';

const reactotronHost = process.env.REACTOTRON_HOST || 'localhost';

export function reactotronInit () {
  const configure = reactotron
    .configure({
      name: 'storeApp',
      host: reactotronHost,
    });

  // @ts-ignore
  configure.useReactNative({
    storybook: true, // If using Storybook
    asyncStorage: true, // AsyncStorage logs
    networking: true, // Network requests
    editor: false, // Disable editor integration (may conflict with Expo)
    errors: true, // Error tracking
    overlay: false, // Disable overlay (better for Expo)
  })
    .setAsyncStorageHandler(AsyncStorage)
    .connect()
    .clear();
}



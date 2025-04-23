import AsyncStorage from '@react-native-async-storage/async-storage';
import reactotron from 'reactotron-react-native';

const reactotronHost = process.env.REACTOTRON_HOST || 'localhost';

export function reactotronInit () {
  const reactotronInstance = reactotron
    .configure({
      name: 'storeApp',
      host: reactotronHost,
    })
    .useReactNative({
      asyncStorage: true,
      networking: {
        ignoreUrls: /symbolicate/, // Игнорировать определенные URL
      },
      editor: false,
      errors: { veto: () => false },
      overlay: false,
    })
    .setAsyncStorageHandler(AsyncStorage)
    .connect();

  // Очистка при подключении
  reactotronInstance.clear();

  return reactotronInstance;
}



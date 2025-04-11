import React from 'react';
import { FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, useColorScheme, View, Image } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AuthDataStore } from '../../../api/AuthDataStore';
import { ButtonUI } from '../../ui/ButtonUI';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { MockDataStore } from '../../../api';
import { useNavigationHook } from '../../../hooks/useNavigation';

export interface IScreenHomeProps {}

export const ScreenHome = observer((props: IScreenHomeProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigationHook();
  const authStore = AuthDataStore;
  const dataStore = new MockDataStore();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const viewStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    borderColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const itemStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    borderColor: isDarkMode ? 'black' : 'white',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>
      <View style={[backgroundStyle, { flex: 1 }]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor} />
        <View style={[backgroundStyle, { paddingHorizontal: 8, alignItems: 'flex-end' }]}>
          <ButtonUI title={'logout'} onPress={authStore.logout} />
        </View>
        <ScrollView style={[viewStyle, styles.scrollView]}>
          <FlatList
            data={dataStore.categories}
            renderItem={({ item }) => {
              const onPress = () => navigation.navigate('Category', { category: item.type });

              return (
                <TouchableOpacity style={[itemStyle, styles.item]} onPress={onPress}>
                  <TextUI text={item.name} size={'medium'} style={{}} />
                  <Image src={item.image} resizeMode="contain" style={styles.image} />
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => `item_${item.id}`}
            scrollEnabled={false}
            numColumns={3}
            contentContainerStyle={styles.container} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 16,
    marginTop: 64,
  },
  container: {
    padding: 16,
  },
  item: {
    flex: 1,
    height: 130,
    borderRadius: 16,
    borderWidth: 1,
    margin: 8,
    padding: 6,
  },
  image: {
    flex: 1,
  },
});

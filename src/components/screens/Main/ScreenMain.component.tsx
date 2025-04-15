// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import React, { useEffect } from 'react';
import { FlatList, Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ButtonUI } from '../../ui/ButtonUI';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { CartDataStore, ProductDataStore } from '../../../api';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { CartBlockComponent } from '../../shared/CartBlock';
import { FlatListVars } from '../../../settings/FlatList.vars';
import { Screen } from '../../shared/Screen';
import { ColorsVars } from '../../../settings';

export interface IScreenMainProps {}

export const ScreenMain = observer((props: IScreenMainProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigationHook();

  const onRefresh = () => {
    if (ProductDataStore.isError) {
      ProductDataStore.refresh().then();
    }
    if (CartDataStore.isError) {
      CartDataStore.refresh().then();
    }
  };

  useEffect(() => {
    ProductDataStore.refresh().then();
  }, []);

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
    <Screen isError={ProductDataStore.isError || CartDataStore.isError} onRefresh={onRefresh}>
      <View style={[backgroundStyle, { flex: 1 }]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor} />
        <View style={[backgroundStyle, { paddingHorizontal: 8, alignItems: 'flex-end' }]}>
          <ButtonUI title={''} onPress={() =>navigation.navigate('Profile')} style={styles.profileButton}>
            <Ionicons name={'user'} size={28} color={'black'} />
          </ButtonUI>
        </View>
        <ScrollView style={[viewStyle, styles.scrollView]}>
          <FlatList
            data={ProductDataStore.categories}
            keyExtractor={(item) => `item_${item.id}`}
            scrollEnabled={false}
            numColumns={3}
            contentContainerStyle={styles.container}
            {... FlatListVars}
            renderItem={({ item }) => {
              const onPress = () => navigation.navigate('Category', { category: item.type });

              return (
                <TouchableOpacity style={[itemStyle, styles.item]} onPress={onPress}>
                  <TextUI text={item.name} size={'medium'} style={{ marginBottom: 4 }} />
                  <Image src={item.image} resizeMode="contain" style={styles.image} />
                </TouchableOpacity>
              );
            }} />
        </ScrollView>
        <View style={{ position: 'absolute', right: 16, bottom: 16 }}>
          <CartBlockComponent />
        </View>
      </View>
    </Screen>
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
  profileButton: {
    height: 50,
    width: 50,
    borderRadius: 16,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center' },
});

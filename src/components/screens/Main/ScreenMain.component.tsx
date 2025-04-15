// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ButtonUI } from '../../ui/ButtonUI';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { CartDataStore, ProductDataStore } from '../../../api';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { CartBlockComponent } from '../../shared/CartBlock';
import { Screen } from '../../shared/Screen';
import { ColorsVars } from '../../../settings';
import { FlatListWithPagination } from '../../shared/FlatListWithPagination';

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

  const renderItem = ({ item }: { item: any }) => {
    const onPress = () => navigation.navigate('Category', { category: item.type });

    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <TextUI text={item.name} size={'medium'} style={{ marginBottom: 4 }} />
        <Image src={item.image} resizeMode="contain" style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <Screen isError={ProductDataStore.isError || CartDataStore.isError} onRefresh={onRefresh}>
      <View style={styles.block}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={Colors.lighter} />
        <View style={styles.header}>
          <ButtonUI title={''} onPress={() =>navigation.navigate('Profile')} style={styles.profileButton}>
            <Ionicons name={'user'} size={28} color={'black'} />
          </ButtonUI>
        </View>
        <FlatListWithPagination data={ProductDataStore.categories} renderItem={renderItem} numColumns={3} />
        <View style={{ position: 'absolute', right: 16, bottom: 16 }}>
          <CartBlockComponent />
        </View>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
  header: {
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    backgroundColor: Colors.lighter,
    marginBottom: 64,
  },
  item: {
    flex: 1,
    height: 130,
    borderRadius: 16,
    borderWidth: 1,
    margin: 8,
    padding: 6,
    backgroundColor: ColorsVars.white,
    borderColor: ColorsVars.white,
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

import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React from 'react';
import { observer } from 'mobx-react';
import { CategoryEnum, MockDataStore } from '../../../api';
import { TextUI } from '../../ui/TextUI';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import { ButtonUI } from '../../ui/ButtonUI';
import { useNavigationHook } from '../../../hooks/useNavigation';

export interface IScreenCategoryProps {
    category: CategoryEnum
}

export const ScreenCategory = observer((props: { route: { params: IScreenCategoryProps }}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const dataStore = new MockDataStore();
  const category = props.route.params.category;
  const navigation = useNavigationHook();
  const data = dataStore.getCategory(category);

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
      <ButtonUI
        title={'Cart'}
        onPress={()=> navigation.navigate('Main', { screen: 'ShoppingCart' })}
        style={{ width: 100, alignSelf: 'flex-end', marginHorizontal: 16 }} />
      <View style={[backgroundStyle, { flex: 1 }]}>
        <ScrollView style={[viewStyle, styles.scrollView]}>
          <FlatList
            data={data}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity style={[itemStyle, styles.item]} onPress={()=> navigation.navigate('ProductCard', { id: item.id })}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, flexDirection: 'column', marginRight: 16, backgroundColor: 'gray', borderRadius: 12 }}>
                      <Image src={item.image} resizeMode="cover" style={styles.image} />
                    </View>
                    <View style={{ flex: 2, flexDirection: 'column' }}>
                      <View style={{ marginVertical: 6 }}>
                        <TextUI text={item.name} size={'large'} numberOfLines={1} />
                      </View>
                      <View style={{ marginVertical: 4 }}>
                        <TextUI text={item.description} size={'small'} numberOfLines={1} />
                      </View>
                      <View style={{ marginVertical: 4 }}>
                        <TextUI text={item.price + ' ₽'} size={'medium'} />
                      </View>
                      <View style={{ marginVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name={'star'} size={20} color={'orange'} />
                        <TextUI text={` - ${item.productRating}`} size={'medium'} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => `item_${item.id}`}
            scrollEnabled={false}
            numColumns={1}
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
  },
  container: {
    padding: 8,
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
    borderRadius: 12,
  },
});

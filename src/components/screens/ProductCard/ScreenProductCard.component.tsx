// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import { observer } from 'mobx-react';
import { Image, SafeAreaView, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React from 'react';
import { MockDataStore } from '../../../api';
import { TextUI } from '../../ui/TextUI';
import { ButtonUI } from '../../ui/ButtonUI';

export interface IScreenProductCardProps {
    id: number;
}

export const ScreenProductCard = observer((props: { route: { params: IScreenProductCardProps }}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const id = props.route.params.id;
  const dataStore = new MockDataStore();
  const item = dataStore.getProduct(id);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>
      <ScrollView style={backgroundStyle}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={ styles.imageView}>
            <Image src={item?.image} resizeMode="cover" style={styles.image} />
          </View>
          <View style={{ flex: 2, flexDirection: 'column', paddingHorizontal: 24 }}>
            <View style={{ marginVertical: 8 }}>
              <TextUI text={item?.name} size={'title'} numberOfLines={1} />
            </View>
            <View style={{ marginVertical: 6 }}>
              <TextUI text={item?.description} size={'large'} numberOfLines={1} />
            </View>
            <View style={{ marginVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={'star'} size={24} color={'orange'} />
              <TextUI text={` - ${item?.productRating}`} size={'medium'} />
            </View>
            <View style={{ marginVertical: 6 }}>
              <TextUI text={item?.price + ' ₽'} size={'title'} style={{ color:'green' }} />
            </View>
            <View style={{ marginVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
              <TextUI text={`осталось ${item?.quantityOfGoods} шт.`} size={'medium'} />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBlock}>
        <ButtonUI title={'add to favorites'} style={{ backgroundColor: 'gray', borderColor: 'gray', width: '48%' }} />
        <ButtonUI title={'add to cart'} style={{ width: '48%' }} />
      </View>
    </SafeAreaView>

  );
});

const styles = StyleSheet.create({
  imageView: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'gray',
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    height: 350,
  },
  image: {
    flex: 1,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  bottomBlock: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
});

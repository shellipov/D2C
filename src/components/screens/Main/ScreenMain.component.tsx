// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ButtonUI } from '../../ui/ButtonUI';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { CartDataStore, ProductDataStore } from '../../../api';
import { useNavigationHook } from '@/hooks/useNavigation';
import { CartBlockComponent } from '@shared/CartBlock';
import { Screen } from '@shared/Screen';
import { FlatListWithPagination } from '@shared/FlatListWithPagination';
import { Col } from '@shared/Col';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface IScreenMainProps {}

export const ScreenMain = observer((props: IScreenMainProps) => {
  const navigation = useNavigationHook();
  const theme = useAppTheme();

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

  const backgroundColor = {
    backgroundColor: theme.color.bgAdditional,
    borderColor: theme.color.bgAdditional,
  };

  const itemColor = {
    backgroundColor: theme.color.bgBasic,
    borderColor: theme.color.bgBasic,
  };

  const renderHeader = () => {
    return (<View style={{ height: 64 }} />);
  };

  const renderItem = ({ item }: { item: any }) => {
    const onPress = () => navigation.navigate('Category', { category: item.type });

    return (
      <TouchableOpacity style={[styles.item, itemColor]} onPress={onPress}>
        <TextUI text={item.name} size={'medium'} style={{ marginBottom: 4 }} />
        <Col style={{ height: 70, padding: 2, borderRadius: 8, backgroundColor: theme.color.bgTransparentImage }}>
          <Image src={item.image} resizeMode="contain" style={styles.image} />
        </Col>
      </TouchableOpacity>
    );
  };

  return (
    <Screen isError={ProductDataStore.isError || CartDataStore.isError} onRefresh={onRefresh}>
      <View style={styles.block}>
        <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, backgroundColor]}>
          <ButtonUI title={''} onPress={() =>navigation.navigate('Profile')} style={styles.profileButton}>
            <Ionicons name={'user'} size={28} color={'black'} />
          </ButtonUI>
        </View>
        <FlatListWithPagination
          data={ProductDataStore.categories}
          style={[backgroundColor]}
          renderItem={renderItem}
          header={renderHeader}
          numColumns={3} />
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
  },
  header: {
    paddingHorizontal: 8,
    alignItems: 'flex-end',
  },
  item: {
    flex: 1,
    height: 130,
    borderRadius: 16,
    borderWidth: 1,
    margin: 8,
    padding: 6,
    justifyContent: 'space-between',
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

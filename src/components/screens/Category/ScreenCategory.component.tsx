// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { observer } from 'mobx-react';
import { CartDataStore, CategoryEnum, ProductDataStore } from '../../../api';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';
import { CartBlockComponent } from '../../shared/CartBlock';
import { NavBar } from '../../shared/NavBar';
import { Row } from '../../shared/Row';
import { Col } from '../../shared/Col';
import { Screen } from '../../shared/Screen';
import { ColorsVars } from '../../../settings';
import { paginationData } from '../../../helpers';
import { FlatListWithPagination } from '../../shared/FlatListWithPagination';

export interface IScreenCategoryProps {
    category: CategoryEnum
}

export const ScreenCategory = observer((props: { route: { params: IScreenCategoryProps }}) => {
  const productStore = ProductDataStore;
  const category = props.route.params.category;
  const navigation = useNavigationHook();
  const data = productStore.getCategory(category);

  const formattedData = paginationData(data);
  const pageButtons = Object.keys(formattedData);
  const isPaginationVisible = pageButtons.length > 1;

  const onRefresh = () => {
    if (ProductDataStore.isError) {
      ProductDataStore.refresh().then();
    }
    if (CartDataStore.isError) {
      CartDataStore.refresh().then();
    }
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={()=> navigation.navigate('ProductCard', { id: item.id })}>
      <Row style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'column', marginRight: 16, backgroundColor: 'gray', borderRadius: 12 }}>
          <Image src={item.image} resizeMode="cover" style={styles.image} />
        </View>
        <Col style={{ flex: 2 }}>
          <View style={{ marginVertical: 6 }}>
            <TextUI text={item.name} size={'large'} numberOfLines={1} />
          </View>
          <View style={{ marginVertical: 4 }}>
            <TextUI text={item.description} size={'small'} numberOfLines={1} />
          </View>
          <View style={{ marginVertical: 4 }}>
            <TextUI text={item.price + ' ₽'} size={'medium'} style={{ color: 'green' }} />
          </View>
          <Row style={{ marginVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={'star'} size={20} color={'orange'} />
            <TextUI text={` - ${item.productRating}`} size={'medium'} />
          </Row>
        </Col>
      </Row>
    </TouchableOpacity>
  );

  return (
    <Screen isError={ProductDataStore.isError || CartDataStore.isError} onRefresh={onRefresh}>
      <NavBar title={productStore.getCategoryName(category)} />
      <FlatListWithPagination data={data} renderItem={renderProductItem}>
        <View style={{ position: 'absolute', right: 16, bottom: isPaginationVisible ? 67 : 16 }}>
          <CartBlockComponent />
        </View>
      </FlatListWithPagination>
    </Screen>
  );
});

const styles = StyleSheet.create({
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
    borderRadius: 12,
  },
});

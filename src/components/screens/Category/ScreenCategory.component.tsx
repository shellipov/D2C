// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useNavigationHook } from '@/hooks/useNavigation';
import { CartBlockComponent } from '@shared/CartBlock';
import { NavBar } from '@shared/NavBar';
import { Row } from '@shared/Row';
import { Col } from '@shared/Col';
import { Screen } from '@shared/Screen';
import { paginationData } from '@/helpers';
import { FlatListWithPagination } from '@shared/FlatListWithPagination';
import { TextUI } from '@components/ui/TextUI';
import { CategoryEnum, ICartDataStore, IProductDataStore } from '@/api';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';

export interface IScreenCategoryProps {
    category: CategoryEnum
}

export const ScreenCategory = observer((props: { route: { params: IScreenCategoryProps }}) => {
  const category = props.route.params.category;
  const navigation = useNavigationHook();
  const cartStore = useInjection<ICartDataStore>(TYPES.CartDataStore);
  const productStore = useInjection<IProductDataStore>(TYPES.ProductDataStore);
  const data = productStore.getCategory(category);
  const formattedData = paginationData(data);
  const pageButtons = Object.keys(formattedData);
  const isPaginationVisible = pageButtons.length > 1;
  const theme = useAppTheme();

  useEffect(() => {
    productStore.refresh().then();
  }, []);

  const itemColors = {
    backgroundColor: theme.color.bgBasic,
    borderColor: theme.color.bgBasic,
  };

  const onRefresh = () => {
    if (productStore.isError) {
      productStore.refresh().then();
    }
    if (cartStore.isError) {
      cartStore.refresh().then();
    }
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.item, itemColors]} onPress={()=> navigation.navigate('ProductCard', { id: item.id })}>
      <Row style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'column', marginRight: 16, backgroundColor: theme.color.bgGray, borderRadius: 12 }}>
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
            <TextUI text={item.price + ' ₽'} size={'medium'} style={{ color: theme.color.textGreen }} />
          </View>
          <Row style={{ marginVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={'star'} size={20} color={theme.color.elementPrimary} />
            <TextUI text={` - ${item.productRating}`} size={'medium'} />
          </Row>
        </Col>
      </Row>
    </TouchableOpacity>
  );

  return (
    <Screen isError={productStore.isError || cartStore.isError} onRefresh={onRefresh}>
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
  },
  image: {
    flex: 1,
    borderRadius: 12,
  },
});

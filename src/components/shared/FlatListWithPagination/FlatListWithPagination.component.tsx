import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, View, ViewProps } from 'react-native';
import { FlatListVars } from '../../../settings/FlatList.vars';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Chip } from '../Chip';
import { paginationData } from '../../../helpers';
import { ListRenderItem } from 'react-native';

export interface IListItem {
  id: string | number | undefined;
  [key: string]: any;
}

export type IListData = IListItem[] | null | undefined;

export type IRenderItem<T = IListItem> = ListRenderItem<T>;

export interface IFlatListWithPaginationProps extends ViewProps {
  data: IListData;
  withoutScroll?: boolean;
  renderItem: IRenderItem;
  children?: React.ReactNode;
}

export function FlatListWithPagination<T extends IListItem> ({
  data = [],
  renderItem,
  children,
  withoutScroll,
  ...viewProps
}: IFlatListWithPaginationProps) {
  const flatListRef = useRef<FlatList<T>>(null);
  const formattedData = paginationData(data!);
  const pageButtons = Object.keys(formattedData);
  const isPaginationVisible = pageButtons.length > 1;
  const [selectedPage, setSelectedPage] = useState(1);

  const renderPageButton = ({ item }: { item: string }) => {
    const onPress = () => {
      setSelectedPage(+item);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    };

    return (
      <Chip
        style={styles.chip}
        label={item}
        isSelected={+item === selectedPage}
        onPress={onPress} />
    );
  };

  return (
    <View style={[styles.contentContainer, viewProps.style]}>
      <FlatList<T>
        style={styles.list}
        ref={flatListRef}
        scrollEnabled={!withoutScroll}
        data={formattedData[selectedPage] as T[]}
        keyExtractor={(item) => `item_${item?.id || item?.product?.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        {...FlatListVars} />

      {isPaginationVisible && (
        <FlatList
          data={pageButtons}
          renderItem={renderPageButton}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paginationContainer} />
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.lighter,
    flex: 1,
    paddingHorizontal: 8,
  },
  list: {
    marginVertical: 8,
  },
  chip: {
    marginTop: 8,
    marginRight: 12,
    height: 40,
    alignSelf: 'flex-end',
  },
  paginationContainer: {
    paddingHorizontal: 16,
  },
});

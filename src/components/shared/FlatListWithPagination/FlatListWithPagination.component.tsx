import React, { useRef, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View, ViewProps } from 'react-native';
import { FlatListVars } from '@/settings/FlatList.vars';
import { Chip } from '../Chip';
import { paginationData } from '@/helpers';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface IListItem {
  id: string | number | undefined;
  [key: string]: any;
}

export type IListData = IListItem[] | null | undefined;

export type IRenderItem<T = IListItem> = ListRenderItem<T>;

export interface IFlatListWithPaginationProps extends ViewProps {
  data: IListData;
  withoutScroll?: boolean;
  numColumns?: number;
  header?: React.ComponentType<any> | React.ReactElement;
  renderItem: IRenderItem;
  children?: React.ReactNode;
}

export function FlatListWithPagination<T extends IListItem> ({
  data = [],
  renderItem,
  header,
  withoutScroll,
  numColumns,
  children,
  ...viewProps
}: IFlatListWithPaginationProps) {
  const flatListRef = useRef<FlatList<T>>(null);
  const formattedData = paginationData(data!);
  const pageButtons = Object.keys(formattedData);
  const isPaginationVisible = pageButtons.length > 1;
  const [selectedPage, setSelectedPage] = useState(1);
  const theme = useAppTheme();

  const renderPageButton = ({ item }: { item: string }) => {
    const onPress = () => {
      setSelectedPage(+item);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    };

    return (
      <Chip style={styles.chip} isSelected={+item === selectedPage} onPress={onPress}>
        <Chip.Text text={item} />
      </Chip>
    );
  };

  return (
    <View style={[styles.contentContainer, { backgroundColor: theme.color.bgAdditional }, viewProps.style]}>
      <FlatList<T>
        style={styles.list}
        ListHeaderComponent={header}
        ref={flatListRef}
        numColumns={numColumns}
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
          contentContainerStyle={styles.paginationContainer}
          {...FlatListVars} />
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
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

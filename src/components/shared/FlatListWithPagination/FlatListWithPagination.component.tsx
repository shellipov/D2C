import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, View, ViewProps } from 'react-native';
import { FlatListVars } from '../../../settings/FlatList.vars';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Chip } from '../Chip';
import { paginationData } from '../../../helpers';
import { ListRenderItem } from 'react-native';

export interface IListItem {
  id: string | number;  // Обязательное уникальное поле
  [key: string]: any;  // Дополнительные поля могут быть любыми
}

export type IListData = IListItem[] | null | undefined;

export type IRenderItem<T = IListItem> = ListRenderItem<T>;

export interface IFlatListWithPaginationProps extends ViewProps {
  /**
   * Массив данных для отображения
   * @default []
   */
  data: IListData;

  /**
   * Функция для рендеринга каждого элемента
   * @example ({ item }) => <Text>{item.title}</Text>
   */
  renderItem: IRenderItem;

  /**
   * Дочерние элементы (например, кнопка корзины)
   */
  children?: React.ReactNode;
}

export function FlatListWithPagination<T extends IListItem> ({
  data = [],
  renderItem,
  children,
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
        ref={flatListRef}
        data={formattedData[selectedPage] as T[]}
        keyExtractor={(item) => `item_${item.id}`}
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
  chip: {
    marginTop: 8,
    marginRight: 12,
  },
  paginationContainer: {
    paddingHorizontal: 16,
  },
});

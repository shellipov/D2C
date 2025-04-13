import { CategoryEnum, ICategoryItem, IProduct, ISimplifiedProduct, ProductListType } from './MockData.types';
import { categoryItems, productList } from './MockData.data';
import { computed, makeObservable } from 'mobx';

export class MockDataStore {
  public constructor () {
    makeObservable(this);
  }

  @computed
  public get list () : ProductListType {
    return productList;
  }

  @computed
  public get categories () : ICategoryItem[] {
    return categoryItems;
  }

  public getCategory (category: CategoryEnum) : (IProduct | never)[] {
    return productList[category] || [];
  }

  public getCategoryName (type: CategoryEnum) : string {
    return categoryItems.find(i => i.type === type)?.name || '';
  }

  public getProduct (id: number) : IProduct | undefined {
    return Object.values(productList).flat().find(i => i.id === id);
  }

  public getSimplifiedProduct (id: number) : ISimplifiedProduct | undefined {
    const item = Object.values(productList).flat().find(i => i.id === id);

    return !!item ? {
      id: item?.id,
      name: item?.name,
      price: item?.price,
    } : undefined;
  }
}

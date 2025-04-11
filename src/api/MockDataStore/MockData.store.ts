import { CategoryEnum, ICategoryItem, IProduct, ProductListType } from './MockData.types';
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

  public getProduct (id: number) : IProduct | undefined {
    return Object.values(productList).flat().find(i => i.id === id);
  }
}

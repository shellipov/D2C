import { CategoryEnum, ICategoryItem, IProduct, ISimplifiedProduct, ProductListType } from './ProductData.types';
import { categoryItems, productList } from './ProductData.data';
import { computed, makeObservable } from 'mobx';

export class ProductDataStore {
  public constructor () {
    makeObservable(this);
  }

  @computed
  public get products () : ProductListType {
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

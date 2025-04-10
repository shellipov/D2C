import { CategoryEnum, IProduct, ProductListType } from './MockData.types';
import { productList } from './MockData.data';

export class MockDataStore {
  public get list () : ProductListType {
    return productList;
  }

  public get categories () : string[] {
    return Object.keys(productList) ;
  }

  public getCategory (category: CategoryEnum) : (IProduct | never)[] {
    return productList[category] || [];
  }

  public IProduct (id: number) : IProduct | undefined {
    return Object.values(productList).flat().find(i => i.id === id);
  }
}

import { CategoryEnum, ICategoryItem, IProduct, ISimplifiedProduct, ProductListType } from './ProductData.types';
import { categoryItems, productList } from './ProductData.data';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { errorService } from '../ErrorDataStore/errorService';
import { ErrorTypeEnum } from '../ErrorDataStore';
import { suddenError } from '../../helpers';

export interface IProductDataStore {
  readonly isError: boolean;
  readonly products: ProductListType | undefined;
  readonly categories: ICategoryItem[]
  refresh(): Promise<void>;
}

class ProductDataStore implements IProductDataStore {
  @observable public isError = false;
  @observable public products: ProductListType | undefined = undefined;
  @observable public categories: ICategoryItem[] = [];
  private static _instance: ProductDataStore | null = null;

  public constructor () {
    makeObservable(this);
  }

  public static get instance (): ProductDataStore {
    if (!ProductDataStore._instance) {
      ProductDataStore._instance = new ProductDataStore();
    }

    return ProductDataStore._instance;
  };

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

  @action.bound
  public async refresh (): Promise<void> {
    try {
      await suddenError('ProductDataStore: refresh');
      runInAction(() => {
        ProductStore.products = productList;
        ProductStore.categories = categoryItems;
        ProductStore.isError = false;
      });
    } catch (error: any) {
      runInAction(() => {
        ProductStore.isError = true;
      });
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}

export const ProductStore = ProductDataStore.instance;

import { CategoryEnum, ErrorTypeEnum, ICategoryItem, IGetFakeProductResponse, IProduct, ISimplifiedProduct, ProductListType } from '@/api';
import { categoryItems, productList } from './ProductData.data';
import { action, computed, makeObservable } from 'mobx';
import { errorService } from '../ErrorDataStore/errorService';
import { suddenError } from '@/helpers';
import { injectable } from 'inversify';
import { AsyncDataHolder } from '@/utils/AsyncDataHolder';
import { ApiStatusEnum } from '@/api/ApiTypes.types';
import { getDataWithRandomDelay } from '@/helpers/getDataWithRandomDelay.helper';

export interface IProductDataStore {
  readonly isError: boolean;
  readonly isLoading: boolean;
  readonly products: ProductListType | undefined;
  readonly categories: ICategoryItem[]
  getCategory(category: CategoryEnum) : (IProduct | never)[]
  getCategoryName(type: CategoryEnum) : string
  getProduct(id: number) : IProduct | undefined
  getSimplifiedProduct(id: number) : ISimplifiedProduct | undefined
  refresh(): Promise<void>;
}

@injectable()
export class ProductDataStore implements IProductDataStore {
  private _holder = new AsyncDataHolder<IGetFakeProductResponse>();

  public constructor () {
    makeObservable(this);
  }

  @computed
  public get products () {
    return this._holder.data?.data?.products;
  }

  @computed
  public get categories () {
    return this._holder.data?.data?.categories || [];
  }

  @computed
  public get isError () {
    return this._holder.isError;
  }

  @computed
  public get isLoading () {
    return this._holder.isLoading;
  }

  public getCategory (category: CategoryEnum) : (IProduct | never)[] {
    return this.products?.[category] || [];
  }

  public getCategoryName (type: CategoryEnum) : string {
    return this.categories.find(i => i.type === type)?.name || '';
  }

  public getProduct (id: number) : IProduct | undefined {
    return Object.values(productList).flat().find(i => i.id === id);
  }

  public getSimplifiedProduct (id: number) : ISimplifiedProduct | undefined {
    const item = Object.values(this.products || {}).flat().find(i => i.id === id);

    return !!item ? {
      id: item?.id,
      name: item?.name,
      price: item?.price,
    } : undefined;
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      this._holder.setLoading();
      await suddenError('ProductDataStore: refresh');
      const data = await getDataWithRandomDelay({
        products: productList,
        categories: categoryItems,
      });
      this._holder.setData({
        data,
        status: ApiStatusEnum.Success,
      });
    } catch (error: any) {
      this._holder.setError(error);
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}

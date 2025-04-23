import { IGetFakeCartResponse, IProduct } from '@/api';
import { Maybe } from '@/utils/types/typescript.types';
import { DataModelBase } from '@/utils/DataModel/DataModelBase';
import { computed, makeObservable } from 'mobx';
import * as CartDataTypes from '@/api/CartDataStore/CartData.types';
import { SettingsVars } from '@/settings';

type TData = Maybe<IGetFakeCartResponse['data']>;

export class CartDataModel extends DataModelBase<TData> {
  constructor (props?: any) {
    super(props);
    makeObservable(this);
  }

  @computed
  public get cartSum () {
    return this.data?.reduce((acc, i) => acc + (i.product.price * i.numberOfProducts), 0) || 0;
  }

  @computed
  public get simplifiedCart () {
    return this.data?.map(i => ({ product: { id: i.product.id, name: i.product.name, price: i.product.price }, numberOfProducts: i.numberOfProducts })) || [];
  }

  @computed
  public get totalPositions () {
    return this.data?.reduce((acc, i) => acc + i.numberOfProducts, 0) || 0;
  }

  @computed
  public get cartInfo (): CartDataTypes.ICartInfo {
    return {
      positions: this.totalPositions,
      sum: this.cartSum + ' ₽',
      cart: this.simplifiedCart,
    };
  }

  @computed
  public get isCreateOrderDisabled () {
    return SettingsVars.minCartSum > this.cartSum;
  }

  public totalCount (product?: IProduct): number {
    const item = this.data?.find(e => e.product.id === product?.id);

    return item?.numberOfProducts || 0;
  }

  public isInCart (product?: IProduct) {
    return !!this.data?.find(e => e.product.id === product?.id);
  }
}

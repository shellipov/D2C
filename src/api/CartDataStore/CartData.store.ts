import { action, computed, makeObservable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as api from '@/api';
import { CartStorageTypeEnum, ErrorTypeEnum, IGetFakeCartResponse } from '@/api';
import * as CartDataTypes from './CartData.types';
import { errorService } from '../ErrorDataStore/errorService';
import { suddenError } from '@/helpers';
import { injectable } from 'inversify/lib/esm';
import { AsyncDataHolder } from '@/utils/AsyncDataHolder';
import { ApiStatusEnum } from '@/api/ApiTypes.types';
import { CartDataModel } from '@/api/CartDataStore/CartData.model';

export interface ICartDataStore {
  readonly model: CartDataModel
  readonly isEmpty: boolean;
  readonly isError: boolean;
  readonly isLoading: boolean;
  deleteFromCart (product: api.IProduct): Promise<void>
  addToCart(product: api.IProduct): Promise<void>
  deleteCart(): Promise<void>
  refresh(): Promise<void>;
}

@injectable()
export class CartDataStore implements ICartDataStore {
  private _holder = new AsyncDataHolder<IGetFakeCartResponse>();
  public model = new CartDataModel(() => this._holder?.data?.data);

  public constructor () {
    makeObservable(this);
  }

  @computed
  public get isEmpty () {
    return !this._holder.isFilled;
  }

  @computed
  public get isError () {
    return this._holder.isError;
  }

  @computed
  public get isLoading () {
    return this._holder.isLoading;
  }

  @action.bound
  public async deleteCart (): Promise<void> {
    try {
      await AsyncStorage.setItem(CartStorageTypeEnum.Cart, JSON.stringify([]));
      this._holder.setData({
        data: [],
        status: ApiStatusEnum.Success,
      });

      await this.refresh();
    } catch (error: any) {
      await errorService({ type: ErrorTypeEnum.LoadData, error });
    }
  }

  @action.bound
  public async addToCart (product: api.IProduct): Promise<void> {
    try {
      await suddenError('CartDataStore: addToCart');
      const jsonCart = await AsyncStorage.getItem(CartStorageTypeEnum.Cart);
      const cart: CartDataTypes.ICart = jsonCart ? JSON.parse(jsonCart) : [];
      const isExistingProduct = cart.find(i => i.product.id === product.id);

      if (isExistingProduct) {
        if (product.quantityOfGoods === isExistingProduct.numberOfProducts) {
          Alert.alert('Максимальное количество товаров', 'К сожалению у нас больше нет');

          return;
        }
        isExistingProduct.numberOfProducts = isExistingProduct.numberOfProducts + 1;
        const index = cart.findIndex(item => item.product.id === product.id);
        if (index !== -1) {
          cart.splice(index, 1, isExistingProduct);
        }
      } else {
        cart.push({
          numberOfProducts: 1,
          product,
        } as CartDataTypes.ICartItem);
      }
      await AsyncStorage.setItem(CartStorageTypeEnum.Cart, JSON.stringify(cart));

      await this.refresh();
    } catch (error: any) {
      await errorService({ type: ErrorTypeEnum.AddToCart, error });
    }
  }

  @action.bound
  public async deleteFromCart (product: api.IProduct): Promise<void> {
    try {
      await suddenError('CartDataStore: deleteFromCart');
      const jsonCart = await AsyncStorage.getItem(CartStorageTypeEnum.Cart);
      const cart: CartDataTypes.ICart = jsonCart ? JSON.parse(jsonCart) : [];
      const cartProduct = cart.find(i => i.product.id === product.id);
      if (cartProduct) {
        const isOnlyOne = cartProduct?.numberOfProducts === 1;
        const index = cart.findIndex(item => item.product.id === product.id);
        if (isOnlyOne) {
          cart.splice(index, 1);
        } else {
          cart.splice(index, 1, { ...cartProduct, numberOfProducts: cartProduct?.numberOfProducts - 1 });
        }
        await AsyncStorage.setItem(CartStorageTypeEnum.Cart, JSON.stringify(cart));
      } else {
        await errorService({ type: ErrorTypeEnum.DeleteFromCart });
      }
      await this.refresh();
    } catch (error: any) {
      await errorService({ type: ErrorTypeEnum.DeleteFromCart, error });
    }
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      this._holder.setLoading();
      await suddenError('CartDataStore: refresh');
      const jsonCart = await AsyncStorage.getItem(CartStorageTypeEnum.Cart);
      if (!jsonCart) {
        const newCart = [] as CartDataTypes.ICart;
        await AsyncStorage.setItem(CartStorageTypeEnum.Cart, JSON.stringify(newCart));
      } else {
        const data = !!jsonCart ? JSON.parse(jsonCart) : undefined;
        this._holder.setData({
          data,
          status: ApiStatusEnum.Success,
        });
      }
    } catch (error: any) {
      this._holder.setError(error);
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}

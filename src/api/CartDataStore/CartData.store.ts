import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { IProduct } from '../ProductDataStore';
import { SettingsVars } from '../../settings';
import { ICart, ICartInfo, ICartItem, ISimplifiedCart } from './CartData.types';
import { errorService } from '../ErrorDataStore/errorService';
import { ErrorTypeEnum } from '../ErrorDataStore';
import { suddenError } from '../../helpers';

export interface ICartDataStore {
  readonly isEmpty: boolean;
  readonly isError: boolean;
  readonly cart: ICart | undefined;
  readonly cartSum: number;
  readonly simplifiedCart: ISimplifiedCart;
  readonly totalPositions: number;
  readonly cartInfo: ICartInfo,
  readonly isCreateOrderDisabled: boolean;
  totalCount (product: IProduct): number;
  isInCart(product: IProduct): boolean;
  addToCart (product: IProduct): Promise<void>
  deleteCart (): Promise<void>
  refresh(): Promise<void>;
}

class CartDataStore implements ICartDataStore {
  private static _instance: CartDataStore | null = null;
  @observable public isEmpty: boolean = true;
  @observable public isError: boolean = false;
  @observable public cart: ICart | undefined = undefined;

  private constructor () {
    makeObservable(this);
  }

  public static get instance (): CartDataStore {
    if (!CartDataStore._instance) {
      CartDataStore._instance = new CartDataStore();
    }

    return CartDataStore._instance;
  }

  @computed
  public get cartSum () {
    return this.cart?.reduce((acc, i) => acc + (i.product.price * i.numberOfProducts), 0) || 0;
  }

  @computed
  public get simplifiedCart () {
    return this.cart?.map(i => ({ product: { id: i.product.id, name: i.product.name, price: i.product.price }, numberOfProducts: i.numberOfProducts })) || [];
  }

  @computed
  public get totalPositions () {
    return this.cart?.reduce((acc, i) => acc + i.numberOfProducts, 0) || 0;
  }

  @computed
  public get cartInfo (): ICartInfo {
    return {
      positions: this.totalPositions,
      sum: this.cartSum + ' ₽',
      cart : this.simplifiedCart,
    };
  }

  @computed
  public get isCreateOrderDisabled () {
    return SettingsVars.minCartSum > this.cartSum;
  }

  public totalCount (product?: IProduct) : number {
    const item = this.cart?.find(e => e.product.id === product?.id);

    return item?.numberOfProducts || 0;
  }

  public isInCart (product?: IProduct) {
    return !!this.cart?.find(e => e.product.id === product?.id);
  }

  @action.bound
  public async deleteCart (): Promise<void> {
    try {
      await AsyncStorage.removeItem('cart');
      runInAction(() => {
        this.cart = undefined;
      });

      await this.refresh();
    } catch (error: any) {
      await errorService({ type:ErrorTypeEnum.LoadData, error });
    }
  }

  @action.bound
  public async addToCart (product: IProduct): Promise<void> {
    try {
      await suddenError('CartDataStore: addToCart');
      const jsonCart = await AsyncStorage.getItem('cart');
      const cart: ICart = jsonCart ? JSON.parse(jsonCart) : [];
      const isExistingProduct = cart.find(i => i.product.id === product.id);

      if (isExistingProduct) {
        if (product.quantityOfGoods === isExistingProduct.numberOfProducts) {
          Alert.alert('Максимальное колличество товаров', 'К сожалению у нас больше нет');

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
        } as ICartItem);
      }
      await AsyncStorage.setItem('cart', JSON.stringify(cart));

      await this.refresh();
    } catch (error: any) {
      await errorService({ type:ErrorTypeEnum.AddToCart, error });
    }
  }

  @action.bound
  public async deleteFromCart (product: IProduct): Promise<void> {
    try {
      await suddenError('CartDataStore: deleteFromCart');
      const jsonCart = await AsyncStorage.getItem('cart');
      const cart: ICart = jsonCart ? JSON.parse(jsonCart) : [];
      const cartProduct = cart.find(i => i.product.id === product.id);
      if (cartProduct) {
        const isOnlyOne = cartProduct?.numberOfProducts === 1;
        const index = cart.findIndex(item => item.product.id === product.id);
        if (isOnlyOne) {
          cart.splice(index, 1);
        } else {
          cart.splice(index, 1, { ...cartProduct, numberOfProducts: cartProduct?.numberOfProducts - 1 });
        }
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
      } else {
        await errorService({ type:ErrorTypeEnum.DeleteFromCart });
      }
      await this.refresh();
    } catch (error: any) {
      await errorService({ type:ErrorTypeEnum.DeleteFromCart, error });
    }
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      await suddenError('CartDataStore: refresh');
      const jsonCart = await AsyncStorage.getItem('cart');
      if (!jsonCart) {
        const newCart = [] as ICart;
        await AsyncStorage.setItem('cart', JSON.stringify(newCart));
      } else {
        runInAction(() => {
          CartStore.cart = !!jsonCart ? JSON.parse(jsonCart) : undefined;
          CartStore.isError = false;
        });
      }
      runInAction(()=> this.isEmpty = false);
    } catch (error: any) {
      runInAction(() => {
        CartStore.isError = true;
      });
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}

export const CartStore = CartDataStore.instance;

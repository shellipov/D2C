import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { IProduct } from '../MockDataStore';
import { SettingsVars } from '../../settings';
import { ICart, ICartItem } from './CartData.types';

export interface ICartDataStore {
  readonly cart: ICart | undefined;
  readonly cartSum: number;
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
      Alert.alert('Error', error?.message || 'Api error');
    }
  }

  @action.bound
  public async addToCart (product: IProduct): Promise<void> {
    try {
      const jsonCart = await AsyncStorage.getItem('cart');
      const cart: ICart = jsonCart ? JSON.parse(jsonCart) : [];
      const isExistingProduct = cart.find(i => i.product.id === product.id);

      if (isExistingProduct) {
        if (product.quantityOfGoods === isExistingProduct.numberOfProducts) {
          Alert.alert('Maximum number of products', 'Unfortunately, we don\'t have any more');

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
      Alert.alert('Error', error?.message || 'Api error');
    }
  }

  @action.bound
  public async deleteFromCart (product: IProduct): Promise<void> {
    try {
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
        Alert.alert('Error', 'Api error');
      }
      await this.refresh();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Api error');
    }
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      const jsonCart = await AsyncStorage.getItem('cart');
      if (!jsonCart) {
        const newCart = [] as ICart;
        await AsyncStorage.setItem('cart', JSON.stringify(newCart));
      } else {
        runInAction(() => {
          this.cart = !!jsonCart ? JSON.parse(jsonCart) : undefined;
        });
      }
      runInAction(()=> this.isEmpty = false);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Api error');
    }
  }
}

export const CartStore = CartDataStore.instance;

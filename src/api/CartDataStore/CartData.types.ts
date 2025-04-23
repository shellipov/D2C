import { IProduct, ISimplifiedProduct } from '@/api';

export interface ICartItem {
    product: IProduct,
    numberOfProducts: number,
}

export interface ISimplifiedCartItem {
    product: ISimplifiedProduct,
    numberOfProducts: number,
}

export type ICart = ICartItem[]

export type ISimplifiedCart = ISimplifiedCartItem[]

export interface ICartInfo {
    positions: number,
    sum: string,
    cart: ISimplifiedCart;
}

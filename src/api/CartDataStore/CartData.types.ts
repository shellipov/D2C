import { IProduct } from '../MockDataStore';

export interface ICartItem {
    product: IProduct,
    numberOfProducts: number,
}

export type ICart = ICartItem[]

import { IUser } from '../AuthDataStore';

export type ThemeType = 'light' | 'dark';
export type ProductRatingType = 1 | 2 | 3 | 4 | 5;
export type EventType = 'addToFavorites' | 'deleteFromFavorites' | 'addToCart' | 'deleteFromCart' | 'createOrder'

export enum CategoryEnum {
    clothesAndShoes= 'clothesAndShoes',
    householdGoods = 'householdGoods',
    electronics = 'electronics',
    householdAppliances = 'householdAppliances',
    goodsForChildren = 'goodsForChildren',
    constructionAndRenovation = 'constructionAndRenovation',
    furniture = 'furniture',
    pharmacy = 'pharmacy',
    hobbiesAndCreativity = 'hobbiesAndCreativity',
}

export interface IProduct {
    id: number;
    name: string;
    description: string
    category: CategoryEnum | string
    price: number;
    quantityOfGoods: number
    productRating: number
    image: string
}

export interface ICart {
    user: IUser
    products: IProduct[]
    totalPrice: number
}

export interface IEvent {
    id: string;
    user: IUser
    type: EventType;
    time: Date;
    cart: ICart;
}

export type ProductListType = {
[key in CategoryEnum]: (IProduct | never)[];
}

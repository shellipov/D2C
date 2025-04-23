import { ApiStatusEnum } from '@/api/ApiTypes.types';

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

export interface ICategoryItem {
    id: number;
    type: CategoryEnum;
    name: string;
    image: string;
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

export interface ISimplifiedProduct extends Pick<IProduct, 'id' | 'name' | 'price'> {}

export type ProductListType = { [key in CategoryEnum]: (IProduct)[]}

export interface IGetFakeProductResponse {
    data?: {
        products: ProductListType,
        categories: ICategoryItem[],
    };
    status?: ApiStatusEnum;
    message?: string;
}

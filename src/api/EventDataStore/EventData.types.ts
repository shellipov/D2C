import { ISimplifiedUser } from '../UserDataStore';
import { ICartInfo } from '../CartDataStore';
import { ISimplifiedProduct } from '../MockDataStore';

export enum EventTypeEnum {
    AddToFavorites = 'AddToFavorites',
    DeleteFromFavorites = 'DeleteFromFavorites',
    AddToCart = 'AddToCart',
    DeleteFromCart = 'DeleteFromCart',
    CreateOrder = 'CreateOrder'
}

export interface IEvent {
    id: string;
    date: string;
    product?: ISimplifiedProduct,
    cartInfo: ICartInfo,
    eventType: EventTypeEnum;
    user: ISimplifiedUser
}

export interface ISimplifiedEvent extends Omit<IEvent, 'id'> {}

export enum OrderStorageTypeEnum {
    Events= 'Events'
}

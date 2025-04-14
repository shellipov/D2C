import { ISimplifiedUser } from '../UserDataStore';
import { ICartInfo } from '../CartDataStore';
import { ISimplifiedProduct } from '../MockDataStore';
import { IOrderOptions } from '../OrderDataStore';

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
    product?: ISimplifiedProduct;
    cartInfo: ICartInfo;
    eventType: EventTypeEnum;
    user: ISimplifiedUser;
    orderOptions? : IOrderOptions;
}

export interface ISimplifiedEvent extends Omit<IEvent, 'id'> {}

export interface ISimplifiedEventData extends Omit<IEvent, 'id' | 'date' | 'eventType'> {}

export enum OrderStorageTypeEnum {
    Events= 'Events'
}

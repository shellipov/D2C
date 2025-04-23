import { ApiStatusEnum } from '@/api/ApiTypes.types';

export enum ErrorTypeEnum {
    AddToCart = 'AddToCart',
    DeleteFromCart = 'DeleteFromCart',
    CreateOrder = 'CreateOrder',
    LoadData = 'LoadData',
}

export interface IError {
    id: string
    date: string
    title: string
    message: string
    description: string
}

export interface ISimplifiedError extends Omit<IError, 'type' | 'date'> {}

export enum errorStorageTypeEnum {
    Errors = 'Errors',
}

export interface IGetFakeErrorResponse {
    data?: IError[];
    status?: ApiStatusEnum;
    message?: string;
}

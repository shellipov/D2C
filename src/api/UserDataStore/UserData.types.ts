import { ApiStatusEnum } from '@/api/ApiTypes.types';

export interface IUser {
    id: number;
    userName: string;
    name: string;
    phone: string;
    address?: string;
    favorites: number[]
}

export interface IGetFakeUserResponse {
    data?: IUser;
    status?: ApiStatusEnum;
    message?: string;
}

export interface ISimplifiedUser extends Pick<IUser, 'id' | 'userName'> {}

export enum UserStorageTypeEnum {
    Users = 'Users',
    AuthUser = 'AuthUser',
}

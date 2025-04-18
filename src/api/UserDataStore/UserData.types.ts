export interface IUser {
    id: number;
    userName: string;
    name: string;
    phone: string;
    address?: string;
    favorites: number[]
}

export interface ISimplifiedUser extends Pick<IUser, 'id' | 'userName'> {}

import { ErrorTypeEnum, IGetFakeUserResponse, IUser } from '@/api';
import { action, computed, makeObservable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { errorService } from '../ErrorDataStore/errorService';
import { suddenError } from '@/helpers';
import { injectable } from 'inversify';
import { AsyncDataHolder } from '@/utils/AsyncDataHolder';
import { ApiStatusEnum } from '@/api/ApiTypes.types';
import { UserDataModel } from '@/api/UserDataStore/UserData.model';

export interface IUserDataStore {
  readonly model: UserDataModel;
  readonly isAuth: boolean;
  readonly isError: boolean;
  readonly isEmpty: boolean;
  updateAuthUserFields(fields: Partial<{ name: string; phone: string; address: string }>): Promise<void>;
  login(user: string): Promise<void>;
  logout(): Promise<void>;
  refresh(): Promise<void>;
}

@injectable()
export class UserDataStore implements IUserDataStore {
  public model = new UserDataModel(()=> this._holder.data?.data);
  private _holder = new AsyncDataHolder<IGetFakeUserResponse>();

  public constructor () {
    makeObservable(this);
  }

  @computed
  public get isAuth () {
    return !!this._holder.data?.data;
  }

  @computed
  public get isError () {
    return this._holder.isError;
  }

  @computed
  public get isEmpty () {
    return !this._holder.isFilled;
  }

  @action.bound
  public async updateAuthUserFields (fields: Partial<{ name: string; phone: string; address: string }>) {
    try {
      const jsonUser = await AsyncStorage.getItem('authUser');
      const user = jsonUser ? JSON.parse(jsonUser) : undefined;
      if (user) {
        const updatedUser = { ...user, ...fields };
        await AsyncStorage.setItem('authUser', JSON.stringify(updatedUser));
        await this.refresh();
      } else {
        Alert.alert('Error', 'Api error');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Api error');
    }
  }

  @action.bound
  public async login (userName: string): Promise<void> {
    try {
      const jsonUsers = await AsyncStorage.getItem('users');
      const allUsers: IUser[] = jsonUsers ? JSON.parse(jsonUsers) : [];
      const existingUser = allUsers.find(i => i.userName === userName);

      if (existingUser) {
        await AsyncStorage.setItem('authUser', JSON.stringify(existingUser));
      } else {
        const newUser: IUser = {
          id: allUsers[allUsers.length - 1]?.id + 1 || 1,
          userName,
          name: '',
          phone: '',
          address: '',
          favorites: [],
        };
        await AsyncStorage.setItem('authUser', JSON.stringify(newUser));
      }

      await this.refresh();
    } catch (error: any) {
      await errorService({ type:ErrorTypeEnum.LoadData, error });
    }
  }

  @action.bound
  public async logout (): Promise<void> {
    try {
      // Получаем всех пользователей и текущего авторизованного
      const jsonUsers = await AsyncStorage.getItem('users');
      const allUsers: IUser[] = jsonUsers ? JSON.parse(jsonUsers) : [];
      const jsonUser = await AsyncStorage.getItem('authUser');
      const user = jsonUser ? JSON.parse(jsonUser) : undefined;

      // Если пользователь уже был авторизован, то перезаписывает его с новыми данными или просто добавляем его
      const index = allUsers.findIndex(item => item.id === user.id);
      if (index !== -1) {
        allUsers.splice(index, 1, user); // Заменяем 1 элемент на newItem
      } else {
        allUsers.push(user);
      }
      await AsyncStorage.setItem('users', JSON.stringify(allUsers));
      await AsyncStorage.removeItem('authUser');

      await this.refresh();
    } catch (error: any) {
      await errorService({ type:ErrorTypeEnum.LoadData, error });
    }
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      await suddenError('UserDataStore: refresh');
      const jsonUser = await AsyncStorage.getItem('authUser');

      this._holder.setData({
        data: jsonUser ? JSON.parse(jsonUser) : undefined,
        status: ApiStatusEnum.Success,
      });
    } catch (error: any) {
      this._holder.setError(error);
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}

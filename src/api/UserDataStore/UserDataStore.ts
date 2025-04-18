import { ISimplifiedUser, IUser } from './UserData.types';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { errorService } from '../ErrorDataStore/errorService';
import { ErrorTypeEnum } from '../ErrorDataStore';
import { suddenError } from '../../helpers';

export interface IAuthDataStore {
  readonly isAuth: boolean;
  readonly user?: IUser;
  readonly isEmpty: boolean;
  readonly isError: boolean;
  readonly simplifiedUser?: ISimplifiedUser;
  login(user: string): Promise<void>;
  logout(): Promise<void>;
  refresh(): Promise<void>;
}

class UserDataStore implements IAuthDataStore {
  private static _instance: UserDataStore | null = null;
  @observable public isAuth: boolean = false;
  @observable public isEmpty: boolean = true;
  @observable public isError = false;
  @observable private _user: IUser | undefined = undefined;

  private constructor () {
    makeObservable(this);
  }

  public static get instance (): UserDataStore {
    if (!UserDataStore._instance) {
      UserDataStore._instance = new UserDataStore();
    }

    return UserDataStore._instance;
  }

  @computed
  public get user (): IUser | undefined {
    return this._user;
  }

  @computed
  public get simplifiedUser (): ISimplifiedUser | undefined {
    return !!this._user ? {
      id: this._user?.id,
      userName: this._user?.userName,
    } : undefined;
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
      runInAction(() => {
        UserStore._user = jsonUser ? JSON.parse(jsonUser) : undefined;
        UserStore.isAuth = !!this._user;
        UserStore.isEmpty = false;
        UserStore.isError = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.isError = true;
      });
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}

export const UserStore = UserDataStore.instance;

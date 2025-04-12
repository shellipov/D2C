import { IUser } from './AuthData.types';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface IAuthDataStore {
  readonly isAuth: boolean;
  readonly getAuthUser?: IUser;
  login(user: string): Promise<void>;
  logout(): Promise<void>;
  refresh(): Promise<void>;
}

export class AuthDataStore implements IAuthDataStore {
  private static _instance: AuthDataStore | null = null;
  @observable public isAuth: boolean = false;
  @observable public isEmpty: boolean = true;
  @observable private _user: IUser | undefined = undefined;

  private constructor () {
    makeObservable(this);
  }

  public static get instance (): AuthDataStore {
    if (!AuthDataStore._instance) {
      AuthDataStore._instance = new AuthDataStore();
    }

    return AuthDataStore._instance;
  }

  @computed
  public get getAuthUser (): IUser | undefined {
    return this._user;
  }

  @action.bound
  public async login (userName: string): Promise<void> {
    try {
      const jsonUsers = await AsyncStorage.getItem('users');
      const allUsers: IUser[] = jsonUsers ? JSON.parse(jsonUsers) : [];
      const existingUser = allUsers.find(i => i.name === userName);

      if (existingUser) {
        await AsyncStorage.setItem('authUser', JSON.stringify(existingUser));
      } else {
        const newUser: IUser = {
          id: allUsers[allUsers.length - 1]?.id + 1 || 1,
          name: userName,
          address: '',
          favorites: [],
        };
        await AsyncStorage.setItem('authUser', JSON.stringify(newUser));
      }

      await this.refresh();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Api error');
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
      Alert.alert('Error', error?.message || 'Api error');
    }
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      const jsonUser = await AsyncStorage.getItem('authUser');
      runInAction(() => {
        AuthStore._user = jsonUser ? JSON.parse(jsonUser) : undefined;
        AuthStore.isAuth = !!this._user;
        AuthStore.isEmpty = false;
      });
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Api error');
    }
  }
}

export const AuthStore = AuthDataStore.instance;

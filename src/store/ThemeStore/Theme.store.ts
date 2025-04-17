import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppThemeEnum, ThemeEnum, ThemeStorageTypeEnum } from './Theme.types';
import { errorService } from '../../api/ErrorDataStore/errorService';
import { ErrorTypeEnum } from '../../api';
import { ColorsVars } from '../../settings';

const THEME_LIST = {
  [AppThemeEnum.System]: 'Системная',
  [AppThemeEnum.Light]: 'Светлая',
  [AppThemeEnum.Black]: 'Темная',
};

const THEMES = Object.values(AppThemeEnum); // Используем значения enum напрямую

export interface IThemeStore {
  readonly appTheme: AppThemeEnum; // Выбранная тема в приложении (системная/светлая/темная)
  readonly deviceTheme: ThemeEnum | null; // Текущая тема устройства (светлая/темная)
  readonly theme: ThemeEnum; // Активная тема (светлая/темная) с учетом всех настроек
  readonly name: string;
  readonly isDark: boolean;
  readonly isError: boolean;
  changeTheme(): Promise<void>;
  refresh(): Promise<void>;
}

class ThemeStore implements IThemeStore {
  @observable public appTheme = AppThemeEnum.Light;
  @observable public deviceTheme: ThemeEnum | null = null;
  @observable public isError = false;
  private static _instance: ThemeStore | null = null;

  public constructor () {
    makeObservable(this);
  }

  public static get instance (): ThemeStore {
    if (!ThemeStore._instance) {
      ThemeStore._instance = new ThemeStore();
    }

    return ThemeStore._instance;
  }

  @computed
  public get name (): string {
    return THEME_LIST[this.appTheme];
  }

  @computed
  public get theme (): ThemeEnum {
    if (this.appTheme === AppThemeEnum.System) {
      return this.deviceTheme || ThemeEnum.Light;
    }

    return this.appTheme === AppThemeEnum.Light ? ThemeEnum.Light : ThemeEnum.Black;
  }

  @computed
  public get isDark () {
    return this.theme === ThemeEnum.Black;
  }

  @computed
  public get isLight () {
    return this.theme === ThemeEnum.Light;
  }

  @computed
  public get color () {
    const index = this.isDark ? 1 : 0;

    return {
      black: ColorsVars.black,
      violet: ColorsVars.violet,
      elementPrimary: ColorsVars.elementPrimary[index],
      elementDisabled: ColorsVars.elementDisabled[index],
      bgBasic: ColorsVars.bgBasic[index],
      bgAdditional: ColorsVars.bgAdditional[index],
      bgGray: ColorsVars.bgGray[index],
      textPrimary: ColorsVars.textPrimary[index],
      textGreen: ColorsVars.textGreen[index],
      textRed: ColorsVars.textRed[index],
      textGray: ColorsVars.textGray[index],
      textViolet: ColorsVars.textViolet[index],
      basicInversion: ColorsVars.basicInversion[index],
    };
  }

  @action.bound
  public async changeTheme (): Promise<void> {
    try {
      const currentIndex = THEMES.indexOf(this.appTheme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      const newTheme = THEMES[nextIndex];

      await AsyncStorage.setItem(ThemeStorageTypeEnum.Theme, newTheme);

      runInAction(() => {
        this.appTheme = newTheme;
      });

      await this.refresh();
    } catch (error: any) {
      runInAction(() => {
        this.isError = true;
      });
      await errorService({
        type: ErrorTypeEnum.LoadData,
        error,
        withoutAlerts: true,
      });
    }
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      const deviceTheme = Appearance.getColorScheme();
      runInAction(() => {
        this.deviceTheme = deviceTheme === 'dark' ? ThemeEnum.Black : ThemeEnum.Light;
      });

      const savedTheme = await AsyncStorage.getItem(ThemeStorageTypeEnum.Theme) as AppThemeEnum | null;

      runInAction(() => {
        this.appTheme = savedTheme ||
            (deviceTheme ? AppThemeEnum.System : AppThemeEnum.Light);
      });

      if (!savedTheme) {
        const defaultTheme = deviceTheme ? AppThemeEnum.System : AppThemeEnum.Light;
        await AsyncStorage.setItem(ThemeStorageTypeEnum.Theme, defaultTheme);
      }
    } catch (error: any) {
      runInAction(() => {
        this.isError = true;
      });
      await errorService({
        type: ErrorTypeEnum.LoadData,
        error,
        withoutAlerts: true,
      });
    }
  }
}

export const Theme = ThemeStore.instance;

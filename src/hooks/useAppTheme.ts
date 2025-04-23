import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';
import { IThemeStore } from '@/store';

export function useAppTheme () {
  return useInjection<IThemeStore>(TYPES.ThemeStore);
}

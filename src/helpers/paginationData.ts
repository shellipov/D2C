import { SettingsVars } from '@/settings';

export function paginationData<T> (arr: T[]): Record<number, T[]> {
  const pageSize = SettingsVars.pageSize;
  const result: Record<number, T[]> = {};
  let pageIndex = 0;

  for (let i = 0; i < arr.length; i += pageSize) {
    result[pageIndex + 1] = arr.slice(i, i + pageSize);
    pageIndex++;
  }

  return result;
}


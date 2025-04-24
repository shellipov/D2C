import { IVMCore } from '@/utils/types/typescript.types';
import { ICategoryItem } from '@/api';

export interface IScreenMainProps {}

export interface IScreenMainVM extends IVMCore {
    readonly categories: ICategoryItem[];
    readonly isError: boolean;
    onRefresh(): void;
}

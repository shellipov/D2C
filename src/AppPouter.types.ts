import { IScreenShoppingCartProps } from './components/screens/ShoppingСart';
import { IScreenAuthProps } from './components/screens/Auth';
import { IScreenCategoryProps } from './components/screens/Category';

export enum Routes {
    Main = 'Main',
    ShoppingCart = 'ShoppingCart',
    Auth = 'Auth',
    Category = 'Category',
}

export type RootStackParamList = {
    Main: undefined;
    ShoppingCart: IScreenShoppingCartProps | undefined;
    Auth: IScreenAuthProps | undefined;
    Category: IScreenCategoryProps;
};


export type ScreenName =
    keyof typeof Routes

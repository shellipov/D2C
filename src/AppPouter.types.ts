import { IScreenShoppingCartProps } from './components/screens/ShoppingСart';
import { IScreenAuthProps } from './components/screens/Auth';
import { IScreenCategoryProps } from './components/screens/Category';
import { IScreenProductCardProps } from './components/screens/ProductCard';

export enum Routes {
    Main = 'Main',
    ShoppingCart = 'ShoppingCart',
    Auth = 'Auth',
    Category = 'Category',
    ProductCard = 'ProductCard',
}

export type MainTabScreens = 'ShoppingCart'

export type RootStackParamList = {
    Main: {screen: MainTabScreens} | undefined;
    ShoppingCart: IScreenShoppingCartProps | undefined;
    Auth: IScreenAuthProps | undefined;
    Category: IScreenCategoryProps;
    ProductCard: IScreenProductCardProps;
};


export type ScreenName =
    keyof typeof Routes

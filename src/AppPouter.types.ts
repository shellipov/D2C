import { IScreenShoppingCartProps } from './components/screens/ShoppingСart';
import { IScreenAuthProps } from './components/screens/Auth';
import { IScreenCategoryProps } from './components/screens/Category';
import { IScreenProductCardProps } from './components/screens/ProductCard';
import { IScreenCreateOrderProps } from './components/screens/CreateOrder/ScreenCreateOrder.component';
import { IScreenProfileProps } from './components/screens/Profile';

export enum Routes {
    Main = 'Main',
    ShoppingCart = 'ShoppingCart',
    Auth = 'Auth',
    Category = 'Category',
    ProductCard = 'ProductCard',
    CreateOrder = 'CreateOrder',
    Profile = 'Profile',
}

export type MainTabScreens = 'ShoppingCart'

export type RootStackParamList = {
    Main: {screen: MainTabScreens} | undefined;
    ShoppingCart: IScreenShoppingCartProps | undefined;
    Auth: IScreenAuthProps | undefined;
    Category: IScreenCategoryProps;
    ProductCard: IScreenProductCardProps;
    CreateOrder: IScreenCreateOrderProps | undefined;
    Profile: IScreenProfileProps | undefined;
};


export type ScreenName =
    keyof typeof Routes

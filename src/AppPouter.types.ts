import { IScreenShoppingCartProps } from './components/screens/ShoppingСart';
import { IScreenAuthProps } from './components/screens/Auth';
import { IScreenCategoryProps } from './components/screens/Category';
import { IScreenProductCardProps } from './components/screens/ProductCard';
import { IScreenCreateOrderProps } from './components/screens/CreateOrder';
import { IScreenProfileProps } from './components/screens/Profile';
import { IScreenOrderProps } from './components/screens/Order';
import { IScreenOrderListProps } from './components/screens/OrderList';
import { IScreenStatisticsProps } from './components/screens/Statistics';
import { IScreenErrorsProps } from './components/screens/Errors';

export enum Routes {
    Main = 'Main',
    ShoppingCart = 'ShoppingCart',
    Auth = 'Auth',
    Category = 'Category',
    ProductCard = 'ProductCard',
    CreateOrder = 'CreateOrder',
    Order = 'Order',
    OrderList = 'OrderList',
    Profile = 'Profile',
    Statistics = 'Statistics',
    Errors = 'Errors',
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
    Order: IScreenOrderProps ;
    OrderList: IScreenOrderListProps | undefined ;
    Statistics: IScreenStatisticsProps | undefined ;
    Errors: IScreenErrorsProps | undefined ;
};


export type ScreenName =
    keyof typeof Routes

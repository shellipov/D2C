import { IScreenShoppingCartProps } from './components/screens/ShoppingСart/ScreenShoppingCart.component';
import { IScreenAuthProps } from './components/screens/Auth';

export enum Routes {
    Main = 'Main',
    ShoppingCart = 'ShoppingCart',
    Auth = 'Auth',
}

export type RootStackParamList = {
    Main: undefined;
    ShoppingCart: IScreenShoppingCartProps | undefined;
    Auth: IScreenAuthProps | undefined;
};


export type ScreenName =
    keyof typeof Routes

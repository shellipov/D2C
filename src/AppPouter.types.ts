import { IScreenHomeProps } from './components/screens/Home/ScreenHome.component';
import { IScreenShoppingCartProps } from './components/screens/ShoppingСart/ScreenShoppingCart.component';

export enum Routes {
    Main = 'Main',
    ShoppingCart = 'ShoppingCart',
}

export type RootStackParamList = {
    Main: IScreenHomeProps;
    ShoppingCart: IScreenShoppingCartProps;
};


export type ScreenName =
    keyof typeof Routes

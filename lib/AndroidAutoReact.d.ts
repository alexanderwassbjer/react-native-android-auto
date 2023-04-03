import React from 'react';
import { ExtractElementByType, Route, RootContainer } from './types';
declare type ScreenContainer = ExtractElementByType<'screen'>;
export declare function RootView(props: {
    containerInfo: RootContainer;
    children?: React.ReactNode;
}): JSX.Element;
export declare const useCarNavigation: () => {
    push: (routeName: string, routeParams?: any) => void;
    pop: () => void;
    registerScreen: (screen: ScreenContainer) => void;
    stack: Route[];
};
export declare const Screen: React.NamedExoticComponent<{
    name: string;
    render: ScreenContainer['render'];
}>;
export declare const ScreenManager: React.NamedExoticComponent<{
    children: any;
}>;
export {};

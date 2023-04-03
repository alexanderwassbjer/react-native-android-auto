import { NativeEventEmitter } from "react-native";
import { AndroidAutoTemplate } from "./types";
export declare const AndroidAutoModule: {
    init(): void;
    eventEmitter: NativeEventEmitter;
    mapNavigate(address: string): void;
    reload(): void;
    finishCarApp(): void;
    invalidate: import("lodash").DebouncedFunc<(screenName: string) => void>;
    setTemplate: import("lodash").DebouncedFunc<(name: string, template: AndroidAutoTemplate) => void>;
    pushScreen: (name: string, template: AndroidAutoTemplate) => void;
    popScreen: () => void;
    toast: (text: string, duration?: number) => void;
};

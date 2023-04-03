"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidAutoModule = void 0;
const lodash_1 = require("lodash");
const react_native_1 = require("react-native");
const invalidate = lodash_1.debounce((screenName) => {
    react_native_1.NativeModules.CarModule.invalidate(screenName);
}, 50);
const eventEmitter = new react_native_1.NativeEventEmitter(react_native_1.NativeModules.CarModule);
function prepareTemplate(name, template) {
    let currentIndex = 0;
    const callbacks = new Map();
    const templateClone = lodash_1.cloneDeepWith(template, (value) => {
        if (typeof value === 'function') {
            currentIndex++;
            callbacks.set(currentIndex, value);
            return currentIndex;
        }
        return undefined;
    });
    const callbackFromNative = (_a) => {
        var { id } = _a, event = __rest(_a, ["id"]);
        react_native_1.NativeModules.CarModule.setEventCallback(name, callbackFromNative);
        const callback = callbacks.get(id);
        if (callback) {
            callback(event);
        }
    };
    return [name, templateClone, callbackFromNative];
}
exports.AndroidAutoModule = {
    init() { },
    eventEmitter,
    mapNavigate(address) {
        react_native_1.NativeModules.CarModule.mapNavigate(address);
    },
    reload() {
        react_native_1.NativeModules.CarModule.reload();
    },
    finishCarApp() {
        react_native_1.NativeModules.CarModule.finishCarApp();
    },
    invalidate,
    setTemplate: lodash_1.debounce((name, template) => {
        react_native_1.NativeModules.CarModule.setTemplate(...prepareTemplate(name, template));
        invalidate(name);
    }, 50),
    pushScreen: (name, template) => {
        react_native_1.NativeModules.CarModule.pushScreen(...prepareTemplate(name, template));
    },
    popScreen: () => {
        react_native_1.NativeModules.CarModule.popScreen();
    },
    toast: (text, duration = 1) => {
        react_native_1.NativeModules.CarModule.toast(text, duration);
    },
};

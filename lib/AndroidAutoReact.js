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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenManager = exports.Screen = exports.useCarNavigation = exports.RootView = void 0;
const react_1 = __importDefault(require("react"));
const NavigationContext = react_1.default.createContext({
    push: (() => { }),
    pop: (() => { }),
    registerScreen: (() => { }),
    stack: [],
});
function RootView(props) {
    const [stack, setStack] = react_1.default.useState([]);
    const screens = react_1.default.useRef([]);
    const push = react_1.default.useCallback((routeName, params) => {
        setStack(prev => {
            const screen = screens.current.find(({ name }) => name === routeName);
            if (!screen) {
                console.log(`Cannot navigatie to ${routeName}: Route does not exist`);
                return prev;
            }
            const newState = [
                ...prev,
                {
                    name: routeName,
                    key: prev.length,
                    render: screen.render,
                    routeParams: params !== null && params !== void 0 ? params : {},
                },
            ];
            props.containerInfo.stack = newState;
            return newState;
        });
    }, [props.containerInfo]);
    const pop = react_1.default.useCallback(() => {
        setStack(prev => {
            if (prev.length === 1) {
                return prev;
            }
            const newState = prev.slice(0, -1);
            props.containerInfo.stack = newState;
            return newState;
        });
    }, [props.containerInfo]);
    const registerScreen = react_1.default.useCallback((screen) => {
        screens.current.push(screen);
        if (screen.name === 'root') {
            push('root');
        }
    }, [push]);
    const navigationContextValue = react_1.default.useMemo(() => {
        return {
            push,
            pop,
            registerScreen,
            stack,
        };
    }, [push, pop, registerScreen, stack]);
    return <NavigationContext.Provider value={navigationContextValue}>{props.children}</NavigationContext.Provider>;
}
exports.RootView = RootView;
const useCarNavigation = () => react_1.default.useContext(NavigationContext);
exports.useCarNavigation = useCarNavigation;
exports.Screen = react_1.default.memo(function Screen({ name, render }) {
    const navigation = exports.useCarNavigation();
    react_1.default.useEffect(() => {
        navigation.registerScreen({
            name,
            render,
            type: 'screen',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
});
exports.ScreenManager = react_1.default.memo(function ScreenManager({ children }) {
    const { stack } = exports.useCarNavigation();
    return (<>
      {children}
      {stack.map((_a) => {
        var { render, routeParams } = _a, item = __rest(_a, ["render", "routeParams"]);
        return react_1.default.createElement('screen', item, render && react_1.default.createElement(render, { routeParams }));
    })}
    </>);
});

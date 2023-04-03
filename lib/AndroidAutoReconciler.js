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
exports.render = void 0;
const react_1 = __importDefault(require("react"));
const react_reconciler_1 = __importDefault(require("react-reconciler"));
const AndroidAuto_1 = require("./AndroidAuto");
const AndroidAutoReact_1 = require("./AndroidAutoReact");
function applyProps(instance, allProps) {
    for (const [key, value] of Object.entries(allProps)) {
        if (key !== 'children') {
            instance[key] = value;
        }
    }
}
function addChildren(parentInstance) {
    var _a, _b;
    if (parentInstance && !('children' in parentInstance)) {
        parentInstance.children = [];
    }
    return (_b = (_a = parentInstance) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
}
function appendChild(parentInstance, child) {
    addChildren(parentInstance).push(child);
}
function removeChild(parentInstance, child) {
    addChildren(parentInstance);
    if ('children' in parentInstance) {
        parentInstance.children = parentInstance.children.filter((currentChild) => currentChild !== child);
    }
}
function insertBefore(parentInstance, child, beforeChild) {
    addChildren(parentInstance);
    if ('children' in parentInstance && Array.isArray(parentInstance.children)) {
        const index = parentInstance.children.indexOf(beforeChild);
        parentInstance.children.splice(index, 1, child);
    }
}
const Renderer = react_reconciler_1.default(Object.assign(Object.assign({ createInstance(type, allProps, _rootContainerInstance, _hostContext, _internalInstanceHandle) {
        const { children } = allProps, props = __rest(allProps, ["children"]);
        const element = Object.assign(Object.assign({ type }, (children ? { children: [] } : {})), props);
        return element;
    }, now: Date.now, setTimeout,
    clearTimeout, noTimeout: false, isPrimaryRenderer: true, supportsMutation: true, supportsHydration: false, supportsPersistence: false, 
    // Context
    getRootHostContext() {
        return {};
    },
    getChildHostContext(context) {
        return context;
    },
    // Instances
    createTextInstance(_text, _fragment) {
        return {};
    },
    // Updates
    commitTextUpdate(_text, _oldText, _newText) {
        // noop
    }, prepareUpdate(_instance, _type, oldProps, newProps) {
        const updateProps = {};
        let needsUpdate = false;
        for (const key in oldProps) {
            if (!Reflect.has(oldProps, key) || key === 'children') {
                continue;
            }
            if (!(key in newProps)) {
                needsUpdate = true;
                updateProps[key] = undefined;
            }
            else if (oldProps[key] !== newProps[key]) {
                needsUpdate = true;
                updateProps[key] = newProps[key];
            }
        }
        for (const key in newProps) {
            if (!Reflect.has(newProps, key) || key === 'children') {
                continue;
            }
            if (!(key in oldProps)) {
                needsUpdate = true;
                updateProps[key] = newProps[key];
            }
        }
        return needsUpdate ? updateProps : null;
    }, commitUpdate: applyProps, 
    // Update root
    appendChildToContainer: appendChild, insertInContainerBefore: insertBefore, removeChildFromContainer: removeChild, 
    // Update children
    appendInitialChild: appendChild, appendChild,
    insertBefore,
    removeChild,
    // Deferred callbacks
    scheduleDeferredCallback() { },
    cancelDeferredCallback() { } }, {
    schedulePassiveEffects(fn) {
        return setTimeout(fn);
    },
    cancelPassiveEffects(handle) {
        clearTimeout(handle);
    },
}), { 
    // Unknown
    finalizeInitialChildren() {
        return false;
    },
    shouldSetTextContent() {
        return false;
    },
    getPublicInstance() { },
    shouldDeprioritizeSubtree() {
        return false;
    },
    prepareForCommit() {
        return null;
    }, resetAfterCommit(containerInfo) {
        var _a;
        if (containerInfo.type !== 'root-container') {
            console.log('Root container must be a RootContainer');
            return;
        }
        const topStack = containerInfo.stack[containerInfo.stack.length - 1];
        console.log('Sending updated UI to native thread', topStack);
        if (!topStack) {
            console.log('Stack is still empty');
            return;
        }
        const node = (_a = containerInfo.children) === null || _a === void 0 ? void 0 : _a.find(item => item.type === 'screen' && item.name === topStack.name);
        if (!node || !node.children) {
            console.log(`${topStack.name} screen has no render method or its render method returns nothing`, node);
            return;
        }
        const template = Array.isArray(node.children) ? node.children.flat().filter(Boolean)[0] : node.children;
        if (!template) {
            console.log('No proper template found for route ', topStack.name);
            return;
        }
        if (containerInfo.prevStack.length === containerInfo.stack.length ||
            (containerInfo.prevStack.length === 0 && node.name === 'root')) {
            if (containerInfo.prevStack.length === 0) {
                console.log('Initial render of root');
            }
            AndroidAuto_1.AndroidAutoModule.setTemplate(node.name, template);
        }
        else if (containerInfo.stack.length > containerInfo.prevStack.length) {
            AndroidAuto_1.AndroidAutoModule.pushScreen(node.name, template);
        }
        else if (containerInfo.stack.length === containerInfo.prevStack.length - 1) {
            AndroidAuto_1.AndroidAutoModule.popScreen();
            AndroidAuto_1.AndroidAutoModule.setTemplate(node.name, template);
        }
        containerInfo.prevStack = containerInfo.stack;
    }, commitMount() { }, 
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    clearContainer(container) {
        if (container && 'children' in container) {
            container.children = [];
        }
    } }));
function render(element) {
    function callReconciler(element, containerInfo) {
        const root = Renderer.createContainer(containerInfo, false, false);
        AndroidAuto_1.AndroidAutoModule.init();
        Renderer.updateContainer(element, root, null, () => {
            AndroidAuto_1.AndroidAutoModule.invalidate('root');
        });
        Renderer.getPublicRootInstance(root);
    }
    AndroidAuto_1.AndroidAutoModule.eventEmitter.addListener('android_auto:ready', () => {
        console.log('CarContext: Ready');
        const initialStack = [];
        const containerInfo = {
            type: 'root-container',
            stack: initialStack,
            prevStack: initialStack,
        };
        callReconciler(react_1.default.createElement(AndroidAutoReact_1.RootView, { containerInfo }, element), containerInfo);
    });
}
exports.render = render;

import React from "react";
import { AndroidAutoElement, ExtractElementByType } from "./types";
declare type NativeToJSXElement<Type extends AndroidAutoElement["type"]> = Omit<ExtractElementByType<Type>, "children" | "type"> & {
    children?: React.ReactNode;
};
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "pane-template": NativeToJSXElement<"pane-template">;
        }
    }
}
export {};

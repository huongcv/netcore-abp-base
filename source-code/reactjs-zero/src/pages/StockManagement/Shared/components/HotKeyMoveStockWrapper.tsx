import {HotKeyScope} from "@ord-core/AppConst";
import React from "react";
import {HotkeysProvider} from "react-hotkeys-hook";

export const HotKeyMoveStockWrapper = (props: {
    children: any
}) => {
    return <HotkeysProvider initiallyActiveScopes={[HotKeyScope.moveStockContainer]}>
        {props.children}
    </HotkeysProvider>
}

import {LazyExoticComponent} from "react";

export interface OrdRouterItem {
    index?: boolean;
    path?: string;
    permission?: string;
    lazyComponent: LazyExoticComponent<any>;
    isEmptyLayout?: boolean;
    children?: OrdRouterItem[]
}

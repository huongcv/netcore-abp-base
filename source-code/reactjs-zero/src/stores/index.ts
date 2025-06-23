import EntityModalStore from "@ord-store/entityModalStore";
import SelectDataSourceStore from "@ord-store/selectDataSourceStore";
import UiStore from "@ord-store/uiStore";
import {createContext, useContext} from "react";
import SessionStore from "./sessionStore";

export const rootStore = {
    sessionStore: new SessionStore(),
    uiStore: new UiStore(),
    selectDataSourceStore: new SelectDataSourceStore(),
    entityModalStore: new EntityModalStore()
};
export type TRootStore = typeof rootStore;
const RootStoreContext = createContext<null | TRootStore>(null);

// Tạo ra provider để cung cấp store cho toàn bộ app
// dung trong file index.ts.tsx
export const Provider = RootStoreContext.Provider;

/** tra lai store, chi dung o function component */
export function useStore() {
    /** store này sẽ chứa toàn bộ data */
    const store = useContext(RootStoreContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a context provider");
    }
    return store;
}

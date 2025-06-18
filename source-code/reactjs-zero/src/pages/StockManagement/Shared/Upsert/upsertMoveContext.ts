import {createContext, useContext} from "react";
import {FormInstance} from "antd";

interface IUpsertMoveContext {
    formProductItems?: FormInstance,
    formMoveTicket: FormInstance,
    editData?: any,
    t: (key: string, prms?: any) => string
}

const defaultValue: any = null;

export const UpsertMoveContext = createContext<IUpsertMoveContext>(defaultValue);

export function useUpsertStockMove() {
    return useContext(UpsertMoveContext);
}

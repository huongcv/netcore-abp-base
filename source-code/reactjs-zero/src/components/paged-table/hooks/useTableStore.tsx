import {useMemo} from "react";
import {createTableStore} from "./useTableStoreFactory";
import {IGetPagedApiService} from "../types";

export const useTableStore = (apiService: IGetPagedApiService) => {
    return useMemo(() => createTableStore(apiService), []);
};

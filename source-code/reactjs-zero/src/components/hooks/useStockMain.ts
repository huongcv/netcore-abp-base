import {useEffect, useState} from "react";
import {useSelectStock} from "@ord-components/forms/select/selectDataSource/useSelectStock";

export const useStockMain = () => {
    const [mainStockInventoryId, setMainStockInventoryId] = useState<any>(null);
    const stockList = useSelectStock();
    useEffect(() => {
        if (stockList && !!stockList.data && stockList.data.length > 0) {
            setMainStockInventoryId(stockList.data[0].value);
        }
    }, [stockList]);
    return [mainStockInventoryId];
}
export const useStockMainName = () => {
    const [mainStockName, setMainStockName] = useState<any>(null);
    const stockList = useSelectStock();
    useEffect(() => {
        if (stockList && !!stockList.data && stockList.data.length > 0) {
            setMainStockName(stockList.data[0].data.inventoryName);
        }
    }, [stockList]);
    return [mainStockName];
}

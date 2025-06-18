import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {ComboOptionDto} from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import userFilterProductUnitsByProductId from "@ord-core/db/queries/products/userFilterProductUnitsByProductId";
import {useEffect, useState} from "react";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";

export const useSelectProductUnit = (productId: any, shopId?: number): SelectDataSource => {
    const [data, setData] = useState<IOrdSelectOption[]>([]);
    const [isPending, setIsPending] = useState(false);
    const items = userFilterProductUnitsByProductId(productId, shopId);
    useEffect(() => {
        const combo = items || [];
        const options = combo.map(it => {
            return {
                value: it.productUnitId,
                label: it.unitName,
                fts: Utils.toLowerCaseNonAccentVietnamese(it.unitName || ''),
                data: it
            }
        }) as ComboOptionDto[];
        setData(options);
        setIsPending(false);
    }, [items]);
    return {data, isPending};
};

import {useLiveQuery} from "dexie-react-hooks";
import {db} from "@ord-core/db";
import {fetchSyncDataProductUnit} from "@ord-core/db/services/syncDataProducts";
import {useEffect, useState} from "react";

const userFilterProductUnitsByProductId = (productId?: string | null, shopId?: number) => {
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        if (productId && productId > '0')
            fetchSyncDataProductUnit(false, productId, shopId)
                .then(() => setIsDataFetched(true));
    }, [productId, shopId]);
    return useLiveQuery(
        () => db(shopId).productUnits.filter(product => {
                return product.isDeleted != true && product.productId == productId;
            }
        ).toArray(),
        [productId, isDataFetched]
    );
};

export default userFilterProductUnitsByProductId;

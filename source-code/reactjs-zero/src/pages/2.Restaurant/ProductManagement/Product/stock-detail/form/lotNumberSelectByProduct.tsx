import React, {useEffect, useState} from "react";
import {ProductHelperService} from "@api/ProductHelperService";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import DateUtil from "@ord-core/utils/date.util";
import {useTranslation} from "react-i18next";
import Utils from "@ord-core/utils/utils";

export const LotNumberSelectByProduct = (props: {
    productId: string | undefined;
    inventoryId?: string;
}) => {
    const [t] = useTranslation('product');
    const {productId, inventoryId, ...rest} = props;
    useEffect(() => {
        if (!!productId && !!inventoryId) {
            getLotOptions();
        }

    }, [props.productId, inventoryId]);
    const [lotOptions, setLotOptions] = useState<any[]>([]);
    const getLotOptions = async () => {
        try {
            const result = await ProductHelperService.getLotNumbers({
                body: {
                    productId: productId,
                    inventoryId: inventoryId
                }
            });
            setLotOptions(result.map(it => {
                return {
                    value: it.stockInventoryLineId,
                    label: <>
                        {it.lotNumber} <span
                        className={'ms-1'}>{t('expiryDate')}{DateUtil.showWithFormat(it.expiryDate, 'dd/MM/yyyy')}</span>
                    </>,
                    fts: Utils.toNonAccentVietnamese(it.lotNumber || '')
                };
            }));
        } catch {

        }
    }
    return (<OrdSelect {...rest} datasource={{
        data: lotOptions,
        isPending: false
    }} allowClear></OrdSelect>);
}

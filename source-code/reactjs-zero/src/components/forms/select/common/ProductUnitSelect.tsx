import OrdSelect, {IBaseOrdSelectProp} from "@ord-components/forms/select/OrdSelect";
import React, {useEffect} from "react";
import {useSelectProductUnitNoCache} from "@ord-components/forms/select/selectDataSource/useSelectProductUnitNoCache";


interface Props extends IBaseOrdSelectProp {
    productIdHash: string,
    isInitValueBasic?: boolean,
    defaultValue?: number
}

export const ProductUnitSelect = (props: Props) => {
    const {productIdHash, isInitValueBasic, ...rest} = props;
    const datasource = useSelectProductUnitNoCache(productIdHash || '')

    useEffect(() => {
        if (isInitValueBasic) {
            if (datasource.data && datasource.data.length > 0) {
                const basicUnit = datasource.data[0];
                if (!rest.value && !!rest.onChange) {
                    rest.onChange(basicUnit.value, basicUnit);
                }
            }
        }

    }, [datasource]);

    return (<>
        <OrdSelect {...rest} datasource={datasource}></OrdSelect>
    </>)
}

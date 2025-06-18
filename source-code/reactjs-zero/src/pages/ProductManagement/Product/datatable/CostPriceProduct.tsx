import {ProductDto} from "@api/index.defs";
import React, {useEffect, useState} from "react";
import {l} from "@ord-core/language/lang.utils";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {RedoOutlined} from "@ant-design/icons";
import {Spin} from "antd";
import {StockHelperService} from "@api/StockHelperService";

export const CostPriceProduct = (props: {
    productDto: ProductDto
}) => {

    const {productDto} = props;
    useEffect(() => {
        setCostPrice(productDto?.costPrice);
    }, [productDto?.costPrice]);
    const [costPrice, setCostPrice] = useState<number | null | undefined>(null);
    const [loading, setLoading] = useState(false);
    const refreshCostPrice = async () => {
        setLoading(true);
        try {
            const costPriceNew =await StockHelperService.retryCostPrice({
                body:{
                    productHashId: productDto.idHash
                }
            });
            setCostPrice(costPriceNew);
        } catch {

        } finally {
            setLoading(false);
        }
    }
    return (<>
        {
            productDto.isProductUseInventory &&
            <div className={'italic'}>
                <Spin tip={l.transCommon('loadingRetryCostPrice')} spinning={loading}>
                    <PriceCell value={costPrice} fixed={0}/>
                    {/*<a onClick={refreshCostPrice} className={'ms-1'}>*/}
                    {/*    <RedoOutlined></RedoOutlined>*/}
                    {/*</a>*/}
                </Spin>

            </div>
        }
    </>);
}

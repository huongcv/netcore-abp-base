import {ProductDto} from "@api/index.defs";
import React, {useEffect, useState} from "react";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {Space} from "antd";
import {InfoCircleOutlined, StopOutlined} from "@ant-design/icons";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";

export const ProductInventoryStockQtyCell = (props: {
    product: ProductDto | null | undefined
}) => {
    const [t] = useTranslation('product');
    const {productStockDetailStore} = useStore();
    const [totalQty, setTotalQty] = useState(0);
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (props.product) {
            const {product} = props;
            setShow(product?.isProductUseInventory == true);
            const {listInventoryByLot} = product;
            setTotalQty(product?.inventoryCurrentQty || 0);
        }
    }, [props.product]);
    return <>
        {


            <Space wrap>
                {
                    show ? <PriceCell fixed={2} value={totalQty}></PriceCell> :
                        <span className={'ms-1 text-red-500'}>
                            <StopOutlined/> {t('productNotInvetoryShort')}
                        </span>
                }
                {/*{*/}
                {/*    !!props.product &&  !!props.product.isProductUseInventory &&*/}
                {/*    <InfoCircleOutlined className={'text-primary cursor-pointer'} onClick={() => {*/}
                {/*        productStockDetailStore.openModal(props.product || {});*/}
                {/*    }}></InfoCircleOutlined>*/}
                {/*}*/}

            </Space>
        }
    </>;
}

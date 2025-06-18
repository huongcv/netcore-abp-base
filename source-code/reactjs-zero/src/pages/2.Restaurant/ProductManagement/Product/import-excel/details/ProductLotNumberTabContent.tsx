import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import React, {useEffect, useState} from "react";
import {ProductLotNumberInitDto} from "@api/index.defs";
import {ColumnType} from "antd/es/table/interface";
import {RowIdxColumn} from "@ord-components/table/cells/RowIdxColumn";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {Table} from "antd";
import {observer} from "mobx-react-lite";
import DateUtil from "@ord-core/utils/date.util";

const ProductLotNumberTabContent = () => {
    const {t} = useTranslation('product');
    const {productImportExcelStore} = useStore();
    const [datasource, setdatasource] = useState<ProductLotNumberInitDto[]>([]);
    const columns: ColumnType<ProductLotNumberInitDto>[] = [
        RowIdxColumn,
        {
            title: t('lotNumber'),
            width: 250,
            dataIndex: 'lotNumber'
        },
        {
            title: t('ExpiryDate'),
            width: 250,
            dataIndex: 'expiryDate',
            render: (_) => {
                return <>
                    {
                        DateUtil.showWithFormat(_)
                    }
                </>
            }
        },
        {
            title: t('qtyInventory'),
            width: 250,
            dataIndex: 'qty',
            render: (_) => {
                return <PriceCell value={_} fixed={0}></PriceCell>
            }
        },
        {
            title: t('costPrice'),
            width: 250,
            dataIndex: 'costPrice',
            render: (_) => {
                return <PriceCell value={_} fixed={0}></PriceCell>
            }
        },
    ];
    useEffect(() => {
        if (productImportExcelStore.productDetail) {
            setdatasource(productImportExcelStore?.productDetail?.listInventoryByLot || [])
        }
    }, [productImportExcelStore.productDetail]);
    return (<>
        <Table className={'mb-3'}
               columns={columns}
               pagination={false}
               dataSource={datasource.map((row, index) => ({
                   key: index,
                   ...row
               }))}
        />
    </>);
}
export default observer(ProductLotNumberTabContent);

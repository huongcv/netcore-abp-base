import {Table, TableProps} from "antd";
import React, {useRef} from "react";
import {CheckStockMoveDetailDto} from "@api/index.defs";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {useTranslation} from "react-i18next";
import {StockMoveDetail_ProductColumn} from "@pages/StockManagement/Shared/Detail/ProductLists/Columns/ProductColumn";

export const ProductList_CheckStock = (props: {
    items: any[],
}) => {
    const {t} = useTranslation('stock');
    const {items} = props;

    const pageIndexRef = useRef<number>(1);
    const pageSize = 8;

    const columns: TableProps<CheckStockMoveDetailDto>['columns'] = [
        {
            title: '#',
            render: (_, _1, idx) => {
               return <span>{(pageSize * (pageIndexRef.current - 1)) + idx + 1}</span>
            },
            width: 30
        },
        {
            title: t('product'),
            render: (_, dto) => {
                if (!dto?.productDetail) {
                    return null;
                }
                return <StockMoveDetail_ProductColumn dto={dto}/>;
            }
        },
        {
            title: t('check.UnitName'),
            render: (_, _1, idx) => {
                return _1.unitName;
            },
            width: 100
        },
        {
            title: t('check.OpeningInventoryQty'),
            render: (_, _1, idx) => {
                return <PriceCell value={_1.openingInventoryQty}/>
            },
            width: 140,
            align: 'end'
        },
        {
            title: t('check.ClosingInventoryQty'),
            render: (_, _1, idx) => {
                return <PriceCell value={_1.closingInventoryQty}/>
            },
            width: 140,
            align: 'end'
        },
        {
            title: t('check.Qty'),
            render: (_, _1, idx) => {
                return <b className={(!!_1.qtyConvert && _1.qtyConvert < 0) ? 'giam-kho' : 'tang-kho'}><PriceCell value={_1.qty}/></b>
            },
            width: 140,
            align: 'end'
        },
    ];
    return (
        <Table key={'id'} columns={columns} dataSource={items || []}  pagination={{
            pageSize: pageSize,
            onChange: (page, pageSize) => {
                pageIndexRef.current = page;
            },
        }}/>
    );
}

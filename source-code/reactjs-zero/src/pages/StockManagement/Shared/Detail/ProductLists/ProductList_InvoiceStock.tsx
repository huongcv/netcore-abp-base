import {Table, TableProps} from "antd";
import React from "react";
import {CheckStockMoveDetailDto, ImportStockMoveDto} from "@api/index.defs";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {useTranslation} from "react-i18next";
import {StockMoveDetail_ProductColumn} from "@pages/StockManagement/Shared/Detail/ProductLists/Columns/ProductColumn";

export const ProductList_InvoiceStock = (props: {
    items: any[],
    moveDto: ImportStockMoveDto,
}) => {
    const {t} = useTranslation('stock');
    const [tDetail] = useTranslation('stock-detail');
    const {items} = props;
    const columns: TableProps<CheckStockMoveDetailDto>['columns'] = [
        {
            title: '#',
            render: (_, _1, idx) => {
                return idx + 1;
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
            title: t('qty'),
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto?.qty &&
                            <>
                                <PriceCell value={dto.qty} fixed={0}/>
                                <span className='italic ms-1'>{dto.unitName}</span>
                            </>
                        }

                    </>
                )
            },
            align: 'end',
            width: 130
        },
        {
            title: tDetail('price.' + props?.moveDto?.moveType),
            dataIndex: 'price',
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto?.price &&
                            <>
                                <PriceCell value={dto.price}/>
                            </>
                        }

                    </>
                )
            },
            align: 'end',
            width: 130
        },
        {
            title: t('invoiceDetail.costPrice'),
            dataIndex: 'price',
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto?.costPrice &&
                            <>
                                <PriceCell value={dto.costPrice} fixed={0}/>
                            </>
                        }

                    </>
                )
            },
            align: 'end',
            width: 130
        },
        {
            title: t('invoiceDetail.totalCostPrice'),
            dataIndex: 'price',
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto?.costPrice &&
                            <>
                                <PriceCell value={(dto.costPrice * (0 - (dto.qtyConvert || 0)))} fixed={0}/>
                            </>
                        }

                    </>
                )
            },
            align: 'end',
            width: 130
        },
    ];
    return (
        <Table key={'id'} columns={columns} dataSource={items || []} pagination={{position: ['none']}}/>
    );
}

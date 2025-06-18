import {ImportStockMoveDetailDto, ImportStockMoveDto} from "@api/index.defs";
import {Table, TableProps} from "antd";
import {useTranslation} from "react-i18next";
import React, {useRef} from "react";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {ColumnType} from "antd/es/table/interface";
import {ProductList_CheckStock} from "@pages/StockManagement/Shared/Detail/ProductLists/ProductList_CheckStock";
import {StockMoveDetail_ProductColumn} from "@pages/StockManagement/Shared/Detail/ProductLists/Columns/ProductColumn";
import {ProductList_InvoiceStock} from "@pages/StockManagement/Shared/Detail/ProductLists/ProductList_InvoiceStock";
import '../detail.scss';
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const DetailStockMoveProductListItems = (props: {
    moveDto: ImportStockMoveDto,
    items: ImportStockMoveDetailDto[] | undefined | null,
    extendColumns?: ColumnType<ImportStockMoveDetailDto>[];
}) => {
    const {t} = useTranslation('stock');
    const [tDetail] = useTranslation('stock-detail');
    const {items, moveDto} = props;
    const pageIndexRef = useRef<number>(1);
    const pageSize = 8;

    const extendColumns: ColumnType<ImportStockMoveDetailDto>[] = props?.extendColumns || [];

    const columns: ColumnType<ImportStockMoveDetailDto>[] = [
        {
            title: '#',
            render: (_, _1, idx) => {
                return <span>{(pageSize * (pageIndexRef.current - 1)) + idx + 1}</span>
            },
            width: 30
        },
        {
            title: t('Code'),
            render: (_, dto) => {
                return <span>{dto.productDetail?.productCode}</span>;
            },
            width: 80,
        },
        {
            title: t('product'),
            render: (_, dto) => {
                if (!dto?.productDetail) {
                    return null;
                }
                return <StockMoveDetail_ProductColumn dto={dto}/>;
            },
            width: 250,
        },
        {
            title: t('qty'),
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto?.qty &&
                            <>
                                <PriceCell value={dto.qty}/>
                            </>
                        }

                    </>
                )
            },
            align: 'end',
            width: 100
        },
        {
            title: t('ĐVT'),
            render: (_, dto) => {
                return (
                    <span>{dto.unitName}</span>
                )
            },
            align: 'end',
            width: 80
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
            width: 120
        },
        ...filterColumnByMoveType(props.moveDto?.moveType),
        ...extendColumns
    ];

    return (<div>
        {
            items && !!moveDto?.moveType && !!columns && <>
                {
                    moveDto.moveType == MoveType.PhieuKiemKho ? <ProductList_CheckStock items={items}/> :
                        moveDto.moveType == MoveType.HoaDon ? <ProductList_InvoiceStock items={items} moveDto={moveDto}/> :
                            <Table key={'id'} columns={columns} dataSource={items} pagination={{
                                pageSize: pageSize,
                                onChange: (page, pageSize) => {
                                    pageIndexRef.current = page;
                                },
                            }}/>
                }
            </>

        }

    </div>);
}
export default DetailStockMoveProductListItems;


const filterColumnByMoveType = (moveType: number | null | undefined) => {
    if (!moveType) {
        return [];
    }
    let keys: string[] = [];
    if (moveType == MoveType.PhieuNhapNhaCungCap || moveType == MoveType.PhieuNhapTon
        || moveType == MoveType.PhieuXuatTraNhaCungCap) {
        keys = ['discount', 'vat', 'totalAmountAfterDiscount'];
    }
    if (moveType == MoveType.PhieuXuatHuy) {
        keys = ['totalAmountAfterDiscount'];
    }
    if (moveType == MoveType.PhieuDieuChuyen) {
        keys = ['totalAmountAfterDiscount'];
    }
    const {t} = useTranslation('stock');
    const commonColumns: TableProps<ImportStockMoveDetailDto>['columns'] = [
        {
            title: t('discount'),
            key: 'discount',
            dataIndex: 'discountAmount',
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto?.discountType === DiscountTypeEnum.Percent &&
                            <span> {dto.discountPercent! > 0 ? <span>
                                {dto.discountPercent + '%'} <PriceCell fixed={2} className='has-discount block'
                                                                       value={dto.discountAmount || 0}/>
                            </span> : 0}</span>
                        }
                        {
                            dto?.discountType === DiscountTypeEnum.Value &&
                            <div>
                                <PriceCell fixed={2} className='has-discount block' value={dto.discountAmount || 0}/>
                            </div>
                        }
                    </>
                )
            },
            align: 'end',
            width: 100
        },
        {
            title: 'VAT%',
            key: 'vat',
            dataIndex: 'vat',
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto.taxPercent && <PriceCell value={dto.taxPercent}/>
                        }
                    </>
                )
            },
            align: 'end',
            width: 50
        },
        {
            title: t('TotalAmountCol'),
            key: 'totalAmountAfterDiscount',
            dataIndex: 'totalAmountAfterDiscount',
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto.totalAmountAfterDiscount && <PriceCell fixed={2} value={dto.totalAmountAfterDiscount}/>
                        }
                    </>
                )
            },
            align: 'end',
            width: 100
        }
    ];
    return [...commonColumns.filter(x => keys.includes(x.key + ''))];
}

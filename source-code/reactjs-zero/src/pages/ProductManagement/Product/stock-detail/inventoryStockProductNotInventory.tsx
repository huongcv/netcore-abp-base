import {ProductDto, ProductInventoryMoveDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {Col, Form} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import React from "react";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {NumericFormat} from "react-number-format";
import {ColumnsType} from "antd/es/table";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import DateUtil from "@ord-core/utils/date.util";

const SearchBox = (props: {
    productDto: ProductDto | null | undefined
}) => {
    const [t] = useTranslation('stock');
    const form = Form.useFormInstance();
    const initRange = DateUtil.getDateRange('thang_nay');

    return (


        <>
            <Col {...useResponsiveSpan(14)}>
                <FloatLabel label={t('moveDateFilter')}>
                    <Form.Item name='moveDateRange' initialValue={initRange}>
                        <OrdDateRangeInput allowEq/>
                    </Form.Item>
                </FloatLabel>

            </Col>
            <SearchFilterText span={10}/>
            <Form.Item hidden name={'productHashId'} initialValue={props.productDto?.idHash}></Form.Item>
        </>

    );
}
const ProductInventoryStockMoveList_ProductNotUseInventory = (props: {
    productDto: ProductDto | null | undefined
}) => {
    const [t] = useTranslation('product');
    const {productStockDetailStore} = useStore();
    const columns = TableUtil.getColumns(
        [
            {
                title: t('moveCodeCell'),
                // render: (_, dto) => {
                //
                //     // return <MoveCodeCell record={dto}/>
                // },
                width: 130
            },

            {
                title: <>{t('QtyConvertNotUseStock')}
                    {
                        props.productDto?.basicUnitName &&
                        <div><span className={'ms-1 italic text-[12px]'}>({props.productDto?.basicUnitName})</span>
                        </div>
                    }

                </>,
                align: 'end',
                render: (_, dto: ProductInventoryMoveDto) => {
                    let qty = (!!dto.qtyConvert && dto.qtyConvert < 0) ? (0 - dto.qtyConvert) : dto.qtyConvert;
                    return <NumericFormat value={qty} displayType={'text'}
                                          thousandSeparator={true}/>
                },
                width: 130
            },
        ] as ColumnsType<ProductInventoryMoveDto>, {
            ns: productStockDetailStore.inventoryMoveListStore.getNamespaceLocale()
        });
    return (<>
        <OrdCrudPage stored={productStockDetailStore.inventoryMoveListStore}
                     classNameTable={props.productDto?.isProductUseInventory == true ? '' : 'max-w-[600px]'}
                     hiddenTopAction={true}
                     columns={columns}
                     searchForm={(f) => <SearchBox productDto={props.productDto}/>}
        ></OrdCrudPage>
    </>);
}
export default ProductInventoryStockMoveList_ProductNotUseInventory;

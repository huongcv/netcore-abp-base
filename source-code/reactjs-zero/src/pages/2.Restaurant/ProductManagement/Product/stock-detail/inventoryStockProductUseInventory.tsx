import {ProductDto, ProductInventoryMoveDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {useSelectStock} from "@ord-components/forms/select/selectDataSource/useSelectStock";
import {Col, Form, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import React, {useState} from "react";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {MoveCodeCell, MoveTypeWithAddFilter} from "@pages/ProductManagement/Product/stock-detail/cells/moveCodeCell";
import {NumericFormat} from "react-number-format";
import {ColumnsType} from "antd/es/table";
import {LotNumberCell} from "@pages/ProductManagement/Product/stock-detail/cells/lotNumberCell";
import {PartnerMoveCell} from "@pages/ProductManagement/Product/stock-detail/cells/partnerMoveCell";
import {LotNumberSelectByProduct} from "@pages/ProductManagement/Product/stock-detail/form/lotNumberSelectByProduct";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import DateUtil from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";
import {FilterCustomMoveType} from "@pages/ProductManagement/Product/stock-detail/form/filterCustomMoveType";
import {FilterCustomPartner} from "@pages/ProductManagement/Product/stock-detail/form/filterCustomPartner";

const SearchBox = (props: {
    productDto: ProductDto | null | undefined
}) => {
    const [t] = useTranslation('stock');
    const form = Form.useFormInstance();
    const initRange = DateUtil.getDateRange('thang_nay');
    const inventoryId_w = Form.useWatch('inventoryId', form);
    const {productStockDetailStore} = useStore();

    return (
        <>
            <Col {...useResponsiveSpan(7)}>
                <FloatLabel label={t('moveDateFilter')}>
                    <Form.Item name='moveDateRange' initialValue={initRange}>
                        <OrdDateRangeInput allowEq/>
                    </Form.Item>
                </FloatLabel>

            </Col>
            {/*{*/}
            {/*    props.productDto?.isProductUseInventory == true &&*/}
            {/*    <Col {...useResponsiveSpan(5)}>*/}
            {/*        <FloatLabel label={t('stockInventoryFilter')}>*/}
            {/*            <Form.Item name='inventoryId'>*/}
            {/*                <OrdSelect datasource={useSelectStock()} allowClear></OrdSelect>*/}
            {/*            </Form.Item>*/}
            {/*        </FloatLabel>*/}
            {/*    </Col>*/}
            {/*}*/}

            {/*{*/}
            {/*    props?.productDto?.isProductUseLotNumber == true &&*/}
            {/*    inventoryId_w &&*/}
            {/*    <Col span={5}>*/}
            {/*        <FloatLabel label={t('lotNumber')}>*/}
            {/*            <Form.Item name='inventoryLineDetailId'>*/}
            {/*                <LotNumberSelectByProduct productId={props.productDto?.id}*/}
            {/*                                          inventoryId={inventoryId_w}/>*/}
            {/*            </Form.Item>*/}
            {/*        </FloatLabel>*/}
            {/*    </Col>*/}
            {/*}*/}

            <SearchFilterText
                onSubmit={()=>{
                    productStockDetailStore.inventoryMoveListStore.searchData(form.getFieldsValue())
                }}
                span={12} ignoreAutoFocus />

            <Form.Item hidden name={'productHashId'} noStyle initialValue={props.productDto?.idHash}></Form.Item>
            <Form.Item hidden name={'moveType'} noStyle></Form.Item>
            <Form.Item hidden name={'partnerId'} noStyle></Form.Item>
        </>

    );
}
const ProductInventoryStockMoveList_ProductUseInventory = (props: {
    productDto: ProductDto | null | undefined
}) => {
    const [t] = useTranslation('product');
    const {productStockDetailStore} = useStore();
    const {inventoryMoveListStore: mainStore} = productStockDetailStore;
    const [moveTypeFilter, setMoveType] = useState<number | null>(null);
    const [filterByPartner, setFilterByPartner] = useState<ProductInventoryMoveDto | null>(null);

    const columns: TableColumnsType<ProductInventoryMoveDto> = TableUtil.getColumns(
        [
            {
                title: t('moveCodeCell'),
                render: (_, dto) => {
                    return <MoveCodeCell record={dto}/>
                },
                width: 130
            },
            {
                title: t('moveDate'),
                render: (_, dto) => {
                    return    <span>
                        {DateUtil.showWithFormat(dto.moveDate, 'dd/MM/yyyy HH:mm')}
                    </span>
                },
                width: 130
            },
            {
                title: t('moveType'),
                render: (_, dto) => {
                    return <MoveTypeWithAddFilter record={dto} addFilterMoveType={addFilterMoveType}/>
                },
                width: 200
            },
            {
                title: t('partnerMove'),
                render: (_, dto) => {
                    return <PartnerMoveCell record={dto} addFilterPartner={() => addFilterPartner(dto)}/>
                },
            },
            {
                title: t('totalAmount'),
                align: 'end',
                render: (_, dto: ProductInventoryMoveDto) => {
                    return <NumericFormat value={Utils.parseFloatWithFixed(dto.totalAmount, 0)} displayType={'text'}
                                          thousandSeparator={true}/>
                },
                width: 100
            },
            // {
            //     title: 'detailTotalCost',
            //     align: 'end',
            //     render: (_, dto: ProductInventoryMoveDto) => {
            //         return <NumericFormat value={Utils.parseFloatWithFixed(dto.totalCostAmount, 0)} displayType={'text'}
            //                               thousandSeparator={true}/>
            //     },
            //     width: 90
            // },
            {
                title: <>{t('QtyConvert')}
                    <span className={'ms-1 italic text-[12px]'}>({props.productDto?.basicUnitName})</span>
                </>,
                align: 'end',
                render: (_, dto: ProductInventoryMoveDto) => {
                    return <span
                        className={(!!dto.qtyConvert && dto.qtyConvert < 0) ? 'stock-qty reduce-qty' : 'stock-qty increase-qty'}>
                        <NumericFormat value={dto.qtyConvert} displayType={'text'}
                                       thousandSeparator={true}/>
                    </span>
                },
                width: 100
            },
            {
                title: t('ClosingInventoryQty'),
                align: 'end',
                render: (_, dto: ProductInventoryMoveDto) => {
                    return <NumericFormat value={dto.closingInventoryQty} displayType={'text'}
                                          thousandSeparator={true}/>
                },
                width: 100
            },
            {
                title: t('CostPrice'),
                align: 'end',
                render: (_, dto: ProductInventoryMoveDto) => {
                    return <NumericFormat value={Utils.parseFloatWithFixed(dto.costPrice, 0)} displayType={'text'}
                                          thousandSeparator={true}/>
                },
                width: 100
            },
        ] as ColumnsType<ProductInventoryMoveDto>, {
            ns: productStockDetailStore.inventoryMoveListStore.getNamespaceLocale()
        });
    const addFilterMoveType = (moveType: any) => {
        setMoveType(moveType);
    }
    const addFilterPartner = (dto: ProductInventoryMoveDto) => {
        setFilterByPartner({
            ...dto
        });
    }

    return (<>
        <OrdCrudPage stored={productStockDetailStore.inventoryMoveListStore}
                     classNameTable={props.productDto?.isProductUseInventory == true ? '' : 'max-w-[600px]'}
                     hiddenTopAction={true}
                     columns={columns}
                     searchForm={(f) => <SearchBox productDto={props.productDto}/>}
                     contentBetweenSearchAndTable={<div className={'mt-[0px] mb-2'}>
                         {
                             mainStore.searchFormRef &&
                             <>
                                 <FilterCustomMoveType moveTypeFilter={moveTypeFilter}
                                                       searchRef={mainStore.searchFormRef}/>
                                 <FilterCustomPartner searchRef={mainStore.searchFormRef} dto={filterByPartner}/>

                             </>
                         }
                     </div>}
        ></OrdCrudPage>
    </>);
}
export default ProductInventoryStockMoveList_ProductUseInventory;

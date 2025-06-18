import {ProductDto} from "@api/index.defs";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import React, {useEffect} from "react";
import {useStore} from "@ord-store/index";
import {Button, Card, Col, Form, Input, InputNumber, Row, Space, TableColumnsType, Tooltip} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectStock} from "@ord-components/forms/select/selectDataSource/useSelectStock";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {useTranslation} from "react-i18next";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {LotNumberCell} from "@pages/ProductManagement/Product/stock-detail/cells/lotNumberCell";
import {RedoOutlined} from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import {StockHelperService} from "@api/StockHelperService";
import {IconlyLightSearch} from "@ord-components/icon/IconlyLightSearch";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {debounce} from "lodash";
import DateUtil from "@ord-core/utils/date.util";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";

const SearchBox = (props: {
    productDto: ProductDto | null | undefined,
    ignoreAutoFocus?: boolean;
}) => {
    const [t] = useTranslation('stock');
    // const {productStockDetailStore} = useStore();
    // const form = Form.useFormInstance();
    return (

        <>
            {/*<Col {...useResponsiveSpan(8)}>*/}
            {/*    <FloatLabel label={t('stockInventoryFilter')}>*/}
            {/*        <Form.Item name='inventoryId'>*/}
            {/*            <OrdSelect datasource={useSelectStock()} allowClear></OrdSelect>*/}
            {/*        </Form.Item>*/}
            {/*    </FloatLabel>*/}
            {/*</Col>*/}
            {/*<SearchFilterText ignoreAutoFocus={props.ignoreAutoFocus}*/}
            {/*                  onSubmit={() => {*/}
            {/*                      productStockDetailStore.inventoryStockListStore.searchData(form.getFieldsValue())*/}
            {/*                  }}*/}
            {/*                  span={24}/>*/}
            <Form.Item hidden name={'productHashId'} initialValue={props.productDto?.idHash}>
            </Form.Item>
        </>
    );
}
const ProductInventoryStockList = (props: {
    productDto: ProductDto | null | undefined,
    ignoreAutoFocusSearch?: boolean;
}) => {
    const [t] = useTranslation('product');
    const {productStockDetailStore} = useStore();
    const stockDs = useSelectStock();
    // const retryCloseStock = async (inventoryId: number) => {
    //     UiUtils.setBusy();
    //     try {
    //
    //         await StockHelperService.retryCloseStockProduct({
    //             body: {
    //                 // @ts-ignore
    //                 inventoryId: inventoryId,
    //                 productHashId: props.productDto?.idHash
    //             }
    //         });
    //         UiUtils.showSuccessWithLCommon('actionDone');
    //         productStockDetailStore.inventoryStockListStore.refreshGridData(true).then();
    //     } catch {
    //
    //     } finally {
    //         UiUtils.clearBusy();
    //     }
    // }
    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
          /*  {
                title: 'stock',
                dataIndex: 'inventoryId',
                width: 200,
                render: (value) => {
                    return <>
                        <DisplayTextFormSelectDataSource value={value}
                                                         datasource={stockDs}
                        ></DisplayTextFormSelectDataSource>

                    </>
                }
            },*/
            {
                title: 'lotNumber',
                dataIndex: 'lotNumber',
                width: 200,
                // hidden: props.productDto?.isProductUseLotNumber != true,
                render: (value, dto) => {
                    return <LotNumberCell {...dto}
                                          productDto={props?.productDto}/>
                }
            },
            /*{
                title: 'expiryDate',
                dataIndex: 'expiryDate',
                width: 200,
                // hidden: props.productDto?.isProductUseLotNumber != true,
                render: (value, dto) => {
                    return <> {DateUtil.showWithFormat(value, 'dd/MM/yyyy')} </>
                    // <LotNumberCell {...dto}
                    //                       productDto={props?.productDto}/>
                }
            },*/
            {
                title: 'qty',
                dataIndex: 'qty',
                width: 150,
                align: 'end',
                render: (value, dto) => {
                    return (<>
                        <b><PriceCell value={value}/></b>
                        <span className={'italic ms-1'}>{props.productDto?.basicUnitName}</span>
                    </>);
                }
            },
            // {
            //     title: '',
            //     width: 150,
            //     align: "center",
            //     dataIndex: 'inventoryId',
            //     render: (value, dto) => {
            //         return <Button className={'ms-5'} icon={<RedoOutlined/>} onClick={() => retryCloseStock(value)}>
            //             {t('refreshStock')}
            //         </Button>
            //     }
            // }
        ], {
            ns: productStockDetailStore.inventoryStockListStore.getNamespaceLocale()
        });
    // useEffect(() => {
    //     window.scrollTo(0, 0); // Cuộn về đầu khi component mount
    // }, []);
    // const QtyMinMax = () => {
    //     return <Row gutter={16}>
    //         <ColSpanResponsive span={6}>
    //             <FloatLabel label={t("inventoryQtyMin")}>
    //                 <Form.Item name="inventoryQtyMin">
    //                     <InputNumber
    //                         style={{width: "100%"}}
    //                         min={0}
    //                         onKeyDown={(e) => {
    //                             if (
    //                                 !/[\d]/.test(e.key) &&
    //                                 e.key !== "Backspace" &&
    //                                 e.key !== "ArrowLeft" &&
    //                                 e.key !== "ArrowRight"
    //                             ) {
    //                                 e.preventDefault();
    //                             }
    //                         }}
    //                     />
    //                 </Form.Item>
    //             </FloatLabel>
    //         </ColSpanResponsive>
    //         <ColSpanResponsive span={6}>
    //             <FloatLabel label={t("inventoryQtyMax")}>
    //                 <Form.Item name="inventoryQtyMax">
    //                     <InputNumber
    //                         style={{width: "100%"}}
    //                         min={0}
    //                         onKeyDown={(e) => {
    //                             if (
    //                                 !/[\d]/.test(e.key) &&
    //                                 e.key !== "Backspace" &&
    //                                 e.key !== "ArrowLeft" &&
    //                                 e.key !== "ArrowRight"
    //                             ) {
    //                                 e.preventDefault();
    //                             }
    //                         }}
    //                     />
    //                 </Form.Item>
    //             </FloatLabel>
    //         </ColSpanResponsive>
    //     </Row>
    // }
    return (<>
        {/*<h2 className='mb-2 font-bold'>{t('inventoryWarning')}</h2>*/}
        {/*<QtyMinMax></QtyMinMax>*/}
        {/*<h2 className='mb-2 font-bold'>{t('inventoryInfo')}</h2>*/}
        <OrdCrudPage stored={productStockDetailStore.inventoryStockListStore}
                     hiddenTopAction={true}
                     columns={columns}
                     searchForm={(f) => <SearchBox
                         ignoreAutoFocus={props.ignoreAutoFocusSearch}
                         productDto={props.productDto}/>}
        ></OrdCrudPage>
    </>);
}
export default ProductInventoryStockList;




import {ProductDto, ProductInventoryStockDto} from "@api/index.defs";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import React from "react";
import {useStore} from "@ord-store/index";
import {Button, Form, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {LotNumberCell} from "@pages/ProductManagement/Product/stock-detail/cells/lotNumberCell";
import UiUtils from "@ord-core/utils/ui.utils";
import {DeleteIcon} from "@ord-components/icon/DeleteIcon";
import {ProductStockService} from "@api/ProductStockService";

const SearchBox = (props: {
    productDto: ProductDto | null | undefined,
    ignoreAutoFocus?: boolean;
}) => {
    // const [t] = useTranslation('stock');
    const {productStockDetailStore} = useStore();
    const form = Form.useFormInstance();
    return (

        <>
            {/*<Col {...useResponsiveSpan(8)}>*/}
            {/*    <FloatLabel label={t('stockInventoryFilter')}>*/}
            {/*        <Form.Item name='inventoryId'>*/}
            {/*            <OrdSelect datasource={useSelectStock()} allowClear></OrdSelect>*/}
            {/*        </Form.Item>*/}
            {/*    </FloatLabel>*/}
            {/*</Col>*/}
            <SearchFilterText ignoreAutoFocus={props.ignoreAutoFocus}
                              onSubmit={() => {
                                  productStockDetailStore.inventoryStockListStore.searchData(form.getFieldsValue())
                              }}
                              span={12}/>
            <Form.Item hidden name={'productHashId'} initialValue={props.productDto?.idHash}>
            </Form.Item>
        </>
    );
}
const ProductInventoryStockList = (props: {
    productDto: ProductDto | null | undefined,
    ignoreAutoFocusSearch?: boolean;
}) => {
    // const [t] = useTranslation('product');
    const {productStockDetailStore} = useStore();
    const {inventoryStockListStore: mainStore} = productStockDetailStore;

    // const stockDs = useSelectStock();
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
            // },
            {
                title: 'Thao tác',
                width: 50,
                align: "center",
                dataIndex: 'action',
                render: (value, dto) => {
                    return <Button icon={<DeleteIcon/>} onClick={() => deleteLot(dto)}>
                        Xoá
                    </Button>
                }
            }
        ], {
            ns: mainStore.getNamespaceLocale()
        });

    const deleteLot = (dto: ProductInventoryStockDto) => {
        UiUtils.showConfirm({
            title: "Xoá lô: " + dto.lotNumber,
            icon: "remove",
            content: (
                <>
                    {`Bạn có chắc chắn muốn xoá lô: ${dto.lotNumber} không?`}
                </>
            ),
            onOk: async (d) => {
                try {
                    UiUtils.setBusy();
                    const response = await ProductStockService.deleteLot({
                        lotNumberId: +dto.id!
                    });

                    if (!response.isSuccessful) {
                        UiUtils.showError(response.message);
                        return;
                    }

                    UiUtils.showSuccess('Xoá thành công lô ' + dto.lotNumber);
                    productStockDetailStore.inventoryStockListStore.searchData({});
                } catch (ex) {
                    console.error(ex);
                } finally {
                    UiUtils.clearBusy();
                }
            },
            okLabel: 'Xác nhận'
        });
    }

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
        <OrdCrudPage stored={mainStore}
                     hiddenTopAction={true}
                     columns={columns}
                     searchForm={(f) => <SearchBox
                         ignoreAutoFocus={props.ignoreAutoFocusSearch}
                         productDto={props.productDto}/>}
        ></OrdCrudPage>
    </>);
}
export default ProductInventoryStockList;




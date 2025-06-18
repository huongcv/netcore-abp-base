import {Button, Col, Form, Modal, Row, Space, TableProps} from "antd";
import {useTranslation} from "react-i18next";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import React, {memo, useEffect, useState} from "react";
import {useStore} from "@ord-store/index";
import {ColumnType} from "antd/es/table/interface";
import {BarcodeProductItemDto, PrintBarcodeQuery, ProductBarCodeLayoutSettingDto} from "@api/index.defs";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {observer} from "mobx-react-lite";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import {PrinterOutlined} from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import {ProductBarcodeService} from "@api/ProductBarcodeService";
import PrinterBarcodeRightBox, {
    detailsFieldName,
    layoutSettingField
} from "@pages/ProductManagement/Product/Tools/PrinterBarcodeRightBox";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import FormUtils from "@ord-core/utils/form.utils";

const SearchBox = memo(() => {
    return <>
        <SearchFilterText placeHolder='Nhập tên sản phẩm để tìm kiếm' span={24}/>
    </>
});

const PrintBarcodeProductModal = (props: {
    isModalOpen: boolean,
    onCloseModal: () => void
}) => {
    const [t] = useTranslation('product');

    const {productListPrintBarCode} = useStore();
    const {isModalOpen, onCloseModal} = props;
    const [form] = Form.useForm();
    const productItems_w = Form.useWatch(detailsFieldName, form);
    const [barcodeLayoutItems, setBarcodeLayoutItem] = useState<ProductBarCodeLayoutSettingDto[]>([]);

    const handleCancel = () => {
        onCloseModal();
        FormUtils.resetFields(form);
        productListPrintBarCode.removeAll();
    };

    useEffect(() => {
        if (props.isModalOpen) {
            productListPrintBarCode.refreshGridData();
            ProductBarcodeService.getSetting().then((items) => {
                setBarcodeLayoutItem(items);
                form.setFieldsValue({
                    [layoutSettingField]: {
                        ...items[0]
                    },
                    printerType: items.find(x => x.isDefault)?.layoutType
                })
            })
        }
    }, [isModalOpen]);

    const columns: ColumnType<BarcodeProductItemDto>[] = [
        {
            title: t('name'),
            dataIndex: 'productName',
            width: 200,
            render: (value) =>
                <TextLineClampDisplay className='!font-medium' content={value}></TextLineClampDisplay>
        },
        {
            title: t('unitName2'),
            dataIndex: 'unitName',
            width: 90,
        },
    ];

    const rowSelection: TableProps<BarcodeProductItemDto>['rowSelection'] = {
        selectedRowKeys: productListPrintBarCode.selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: BarcodeProductItemDto[]) => {
            productListPrintBarCode.setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record: BarcodeProductItemDto) => ({
            name: record.id,
        }),
    };

    const print = async (valueForm: any) => {
        UiUtils.setBusy();
        try {
            const body: PrintBarcodeQuery = {
                products: productListPrintBarCode.selectedRows,
                layoutSetting: {
                    ...valueForm[layoutSettingField],
                    layoutType: valueForm.printerType
                }
            };
            const response = await ProductBarcodeService.printBarCodeTemplate({
                body: body
            });

            if (!response.isSuccessful) {
                UiUtils.showError(response.message);
                return;
            }

            const blob = await ProductBarcodeService.print({
                    id: response.data?.split("/").pop() || ""
                }
                , {
                    responseType: 'blob'
                }
            );

            UiUtils.showPrintWindow(blob);
        } catch (ex: any) {
            console.error(ex);
        } finally {
            setTimeout(() => {
                UiUtils.clearBusy();
            }, 500);
        }
    }

    return <>
        <Modal title={t('printBarCode')}
               width={'90%'}
               style={{top: 5}}
               open={isModalOpen}
               onOk={() => {
               }}
               onCancel={handleCancel}
               footer={<>
                   <Space wrap>
                       <ModalCloseBtn onClick={handleCancel}/>

                       <Button disabled={!productItems_w || productItems_w.length === 0}
                               onClick={() => form.submit()}
                               type={'primary'}
                               icon={<PrinterOutlined/>}>{t('printBarCode')}
                       </Button>
                   </Space>
               </>}>
            <Row gutter={12}>
                <Col span={8}>
                    <h3 className={'font-bold text-xl mb-3'}>{t('list')}</h3>

                    <OrdCrudPage stored={productListPrintBarCode}
                                 hiddenTopAction={true}
                                 columns={columns}
                                 searchForm={(f) => <SearchBox/>}
                                 rowSelection={{type: 'checkbox', ...rowSelection}}
                    ></OrdCrudPage>

                </Col>
                <Col span={16}>
                    <Form form={form} onFinish={print}>
                        <PrinterBarcodeRightBox barcodeLayoutItems={barcodeLayoutItems}></PrinterBarcodeRightBox>
                    </Form>
                </Col>
            </Row>
        </Modal>
    </>
}
export default observer(PrintBarcodeProductModal);



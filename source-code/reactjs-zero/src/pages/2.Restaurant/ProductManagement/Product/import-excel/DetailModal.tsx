import {observer} from "mobx-react-lite";
import {Form, Modal, Tabs, TabsProps, Tag} from "antd";
import {ModalFooterReadOnly} from "@ord-components/crud/ModalFooterReadOnly";
import React, {useEffect, useState} from "react";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {ErrorCell} from "@pages/ProductManagement/Product/import-excel/ListProductInvalid";
import ProductUnitTabContent from "@pages/ProductManagement/Product/import-excel/details/ProductUnitTabContent";
import ProductTabContent from "@pages/ProductManagement/Product/import-excel/details/ProductTabContent";
import ProductLotNumberTabContent
    from "@pages/ProductManagement/Product/import-excel/details/ProductLotNumberTabContent";


const FormDetail = () => {
    const {productImportExcelStore} = useStore();
    const form = Form.useFormInstance();
    const {t} = useTranslation('product');
    const tabItems: TabsProps['items'] = [{
        key: '1',
        label: t('productInformationTab'),
        children: <ProductTabContent/>
    }, {
        key: '2',
        label: t('productUnitsTab'),
        children: <ProductUnitTabContent/>
    }, {
        key: '3',
        label: t('productLotNumberTab'),
        children: <ProductLotNumberTabContent/>
    }];

    return (<>
        {/*<Tabs items={tabItems.filter(f => {*/}
        {/*    if (f.key == '3') {*/}
        {/*        return productImportExcelStore?.productDetail?.isProductUseLotNumber == true;*/}
        {/*    }*/}
        {/*    return true;*/}
        {/*})}></Tabs>*/}

    </>);
}

const ProductImportDetailModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {productImportExcelStore} = useStore();
    const {t} = useTranslation('product-excel');
    const showModal = () => {
        setIsModalOpen(true);
    };
    const [form] = Form.useForm();

    // const handleCancel = () => {
    //     setIsModalOpen(false);
    //     productImportExcelStore.openDetail(null);
    // };
    // useEffect(() => {
    //     if (!!productImportExcelStore.productDetail) {
    //         showModal();
    //     }
    // }, [productImportExcelStore.productDetail]);
    const titleModal = <>
        {t('titleDetailModal')}
    </>;

    return ( <> </>
    //     <Modal title={titleModal}
    //                style={{
    //                    top: 10
    //                }}
    //                width={1300}
    //                open={isModalOpen}
    //                onCancel={handleCancel}
    //                footer={<ModalFooterReadOnly onCancel={handleCancel}/>}>
    //
    //     {
    //         productImportExcelStore?.productDetail &&
    //         <div>
    //             <Form disabled form={form} initialValues={productImportExcelStore.productDetail}>
    //                 <FormDetail></FormDetail>
    //             </Form>
    //         </div>
    //     }
    //     <p>
    //        <span className={'me-2'}>
    //             {t('status')}:
    //        </span>
    //         {
    //             productImportExcelStore?.productDetail?.isError == true ?
    //                 <Tag color={'error'}>{t('listProductInvalid')}</Tag> :
    //                 <Tag color={'success'}>{t('listProductValid')}</Tag>
    //         }
    //     </p>
    //     {
    //         productImportExcelStore?.productDetail?.isError == true &&
    //         <>
    //             {t('detailError')}
    //             <ErrorCell product={productImportExcelStore.productDetail}></ErrorCell>
    //         </>
    //     }
    //
    // </Modal>
    );
}
export default observer(ProductImportDetailModal);

import { CruCustomerDebtCommand } from "@api/index.defs";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { CommonListStore } from "@ord-core/base/CommonListStore";
import DateUtil from "@ord-core/utils/date.util";
import UiUtils from "@ord-core/utils/ui.utils";
import Utils from "@ord-core/utils/utils";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import { Form, Input, InputNumber, Modal } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ModalChangeDebt = (prop: {
    onCruSuccess?: Function, 
    stored: CommonListStore<any>, 
    partnerType: number, 
}) => {

    const {t} = useTranslation(['partner_debt']);
    const {onCruSuccess, stored,   partnerType} = prop;
    const {createOrUpdateModal: modalData} = stored;

    const [cusForm] = Form.useForm<any>();

    const handleDebtChange = (value: number | null) => {
        const currentDebt = cusForm.getFieldValue('currentDebtAmount') ?? 0;
        const newAdjustment = (value ?? 0) - currentDebt;
        cusForm.setFieldsValue({ adjustment: newAdjustment });
    };

    const FormDebt = () => {
        const {entityData} = modalData;
        useEffect(() => {
            cusForm.resetFields();
            if (entityData)
                cusForm.setFieldsValue({...entityData, debt: null, transactionDate: null});
        }, [])

        const formatterNumber = Utils.formatterNumberInput;
        const parseNumber = (value:string|undefined) => value?.replace(/\\s?|(,*)/g, '') as unknown as number;
        return <>
            <Form form={cusForm}
                layout={'vertical'}>
                <FloatLabel label={partnerType == 1 ? t('customerName') : t('supplierName')}><Input value={entityData?.partnerName} disabled /></FloatLabel>
                <FloatLabel label={t('currentDebtAmount')}>
                    <Form.Item name='currentDebtAmount' rules={[ValidateUtils.required]}>
                        <InputNumber
                            formatter={formatterNumber}
                            parser={parseNumber}
                            onChange={handleDebtChange}
                            style={{width: '100%'}} disabled></InputNumber>
                    </Form.Item>
                </FloatLabel>
                <FloatLabel label={t('debt')} required>
                    <Form.Item name='debt' rules={[ValidateUtils.required]}>
                        <InputNumber
                            autoFocus
                            formatter={formatterNumber}
                            parser={parseNumber}
                            onChange={handleDebtChange}
                            style={{width: '100%'}}></InputNumber>
                    </Form.Item>
                </FloatLabel>
                <FloatLabel label={t('adjustment')} >
                  <Form.Item name="adjustment">
                        <InputNumber
                            disabled
                            formatter={formatterNumber}
                            precision={2}
                            parser={parseNumber}
                            style={{ width: '100%' }}></InputNumber>
                  </Form.Item>
                </FloatLabel>
            </Form>
        </>
    }

    
    const onOkModal = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {
                const isCreate = modalData.mode === 'addNew';
                const input: CruCustomerDebtCommand = isCreate ? {
                    ...data,
                    partnerId: modalData.entityData?.partnerId,
                    partnerTransactionId: modalData.entityData?.transactionId,
                    transactionDate: DateUtil.toFormat(data.transactionDate, 'YYYY-MM-DDTHH:mm:ss') as any
                } : {
                    ...data,
                    partnerId: modalData.entityData?.partnerId,
                    partnerTransactionId: modalData.entityData?.transactionId,
                    transactionDate: DateUtil.toFormat(data.transactionDate, 'YYYY-MM-DDTHH:mm:ss') as any
                }
                const apiFun = isCreate ? stored.createEntity(input) : stored.updateEntity(input)
                apiFun.then((result: any) => {
                    UiUtils.showSuccess(t(isCreate ? 'addNewSuccess' : 'updateSuccess', {
                        ...data
                    }) as any);
                    cusForm.resetFields();
                    if (prop.onCruSuccess)
                        prop.onCruSuccess();
                    stored.closeModal(true)

                })
            } catch (e) {

            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }

    const titleModal = () => {
        if (modalData.entityData?.formPartnerType == 'supplier') {
            return t(('titleDebtSupplier.' + modalData!.mode)) + `[${modalData.entityData?.partnerName} - ${modalData.entityData?.partnerCode}]`
        } else {
            return t(('titleDebt.' + modalData!.mode)) + `[${modalData.entityData?.partnerName} - ${modalData.entityData?.partnerCode}]`
        }
    }
    return (
        <>
            {
                modalData.visible &&
                <Modal title={titleModal()}
                       open={modalData.visible}
                       width={modalData.width || 550}
                       maskClosable={false}
                       style={{top: '30px'}}
                       onCancel={() => stored.closeModal()}
                       destroyOnClose
                       footer={<FooterCrudModal
                           hiddenOk={modalData.mode === 'viewDetail'}
                           onOk={onOkModal} onCancel={() => stored.closeModal()}/>}
                >
                    <FormDebt ></FormDebt>
                </Modal>}
        </>
    );
}
export default observer(ModalChangeDebt);

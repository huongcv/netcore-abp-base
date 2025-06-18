import {Form, Input, Modal} from "antd";
import * as React from "react";
import {forwardRef, useImperativeHandle, useState} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TextArea from "antd/lib/input/TextArea";
import {CommonResultDtoOfInvoiceReturnDto, InvoiceReturnDto} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {useSelectEmployee} from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {InvoiceReturnService} from "@api/InvoiceReturnService";

export const CancelInvoiceReturnForm = forwardRef((props: any, ref: any) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const {t} = useTranslation('sale-invoice')
    const {invoiceReturnStore: mainStore} = useStore();
    const [invoice, setInvoice] = useState<InvoiceReturnDto>();

    const onFinish = (values: any) => {
        UiUtils.setBusy();
        InvoiceReturnService.cancel({body: values}).then((data: CommonResultDtoOfInvoiceReturnDto) => {
            if (data.isSuccessful) {
                setConfirmLoading(false);
                handleCancel();
                mainStore.closeModal(true);
            } else {
                setConfirmLoading(false);
                UiUtils.showError(data.errorDetail?.message)
            }
            UiUtils.clearBusy();
        })
    }

    const showModal = (d: any) => {
        setOpen(true);
        form.setFieldsValue(d);
        setInvoice(d);
    };

    const handleOk = () => {
        // setConfirmLoading(true);
        form.submit();
    };

    const handleCancel = () => {
        form.setFieldValue("id", "")
        setOpen(false);
    };

    useImperativeHandle(ref, () => ({
        showModal
    }));

    return (<>
        <Modal
            title={t('canceledInvoiceReturnForm') + invoice?.invoiceCode}
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            width={800}
            style={{top: '10px'}}
            maskClosable={false}
            onCancel={handleCancel}>
            <div>
                <Form form={form} onFinish={onFinish} autoComplete="off">
                    <Form.Item name="id" hidden><Input/></Form.Item>
                    <FloatLabel label={t("employee")} required>
                        <Form.Item name='canceledEmployeeId' rules={[ValidateUtils.required]}>
                            <OrdSelect datasource={useSelectEmployee()}></OrdSelect>
                        </Form.Item>
                        <label className="opacity-75 text-[12px]">Mặc định nhân viên đăng nhập</label>
                    </FloatLabel>
                    <FloatLabel label={t("canceledReason")} required>
                    <Form.Item name='canceledReason' rules={[ValidateUtils.required]}>
                            <TextArea className="!h-[100px]"></TextArea>
                        </Form.Item>
                    </FloatLabel>
                </Form>
            </div>
        </Modal>
    </>)
})

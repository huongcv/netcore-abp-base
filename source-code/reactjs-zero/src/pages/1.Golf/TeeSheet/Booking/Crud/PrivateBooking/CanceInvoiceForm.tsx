import {Form, Input, Modal} from "antd";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {observer} from "mobx-react-lite";
import {SaleInvoiceDto} from "@api/index.defs";
import {GolfBookingService} from "@api/GolfBookingService";

const {TextArea} = Input;

const CancelInvoiceForm = observer((props: {
    onSuccess: (v: SaleInvoiceDto) => void
}) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const {t} = useTranslation("sale-invoice");
    const {saleInvoiceStore: mainStore} = useStore();

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const onFinish = (values: any) => {
        UiUtils.setBusy();
        setConfirmLoading(true);
        GolfBookingService.destroyInvoice({
            body: {
                invoiceId: mainStore.cancelRecord?.id,
                canceledReason: values.canceledReason
            }
        }).then((data) => {
            if (data.isSuccessful) {
                UiUtils.showSuccess(t("cancelInvoiceSuccess"));
                setConfirmLoading(false);
                handleCancel();
                if (data.data)
                    props.onSuccess(data.data);
                mainStore.closeRemoveById();
            } else {
                UiUtils.showError(data.errorDetail?.message);
            }
            UiUtils.clearBusy();
        });
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.setFieldValue("id", "");
        mainStore.closeRemoveById();
    };

    useEffect(() => {
        if (mainStore.cancelRecord) {
            setTimeout(() => {
                textAreaRef.current?.focus();
            }, 100); // Tránh lỗi chưa render xong
        }
    }, [mainStore.cancelRecord]);

    return (
        <>
            <Modal
                title={t("canceledInvoiceForm") + mainStore.cancelRecord?.invoiceCode}
                open={!!mainStore.cancelRecord}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                width={800}
                style={{top: "10px"}}
                maskClosable={false}
                onCancel={handleCancel}
            >
                <div>
                    <Form form={form} onFinish={onFinish} autoComplete="off">
                        <Form.Item name="id" hidden>
                            <Input/>
                        </Form.Item>
                        {/*<FloatLabel label={t("employee")} required>*/}
                        {/*    <Form.Item name='canceledEmployeeId' rules={[ValidateUtils.required]}>*/}
                        {/*        <OrdSelect datasource={useSelectEmployee()}></OrdSelect>*/}
                        {/*    </Form.Item>*/}
                        {/*</FloatLabel>*/}
                        <FloatLabel label={t("canceledReason")} required>
                            <Form.Item
                                name="canceledReason"
                                rules={[ValidateUtils.required, ValidateUtils.maxLength(200)]}
                            >
                                <TextArea ref={textAreaRef} className="!h-[100px]"></TextArea>
                            </Form.Item>
                        </FloatLabel>
                    </Form>
                </div>
            </Modal>
        </>
    );
});
export default CancelInvoiceForm;

import { Form, Input, Modal } from "antd";
import * as React from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@ord-store/index";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
// import TextArea from "antd/lib/input/TextArea";
const { TextArea } = Input;
import { SaleInvoiceDto } from "@api/index.defs";
import { SaleInvoiceService } from "@api/SaleInvoiceService";
import UiUtils from "@ord-core/utils/ui.utils";
import { useSelectEmployee } from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import OrdSelect from "@ord-components/forms/select/OrdSelect";

export const CancelInvoiceForm = forwardRef((props: any, ref: any) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("sale-invoice");
  const { saleInvoiceStore: mainStore } = useStore();
  const [saleInvoice, setSaleInvoice] = useState<SaleInvoiceDto>();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const onFinish = (values: any) => {
    UiUtils.setBusy();
    setConfirmLoading(true);
    SaleInvoiceService.cancel({ body: values }).then((data) => {
      if (data.isSuccessful) {
        UiUtils.showSuccess(t("cancelInvoiceSuccess"));
        handleCancel();
        mainStore.closeModal(true);
      } else {
        UiUtils.showError(data.errorDetail?.message);
      }
      UiUtils.clearBusy();
      setConfirmLoading(false);
    });
  };

  const showModal = (d: any) => {
    setOpen(true);
    form.setFieldsValue(d);
    setSaleInvoice(d);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.setFieldValue("id", "");
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 100); // Tránh lỗi chưa render xong
    }
  }, [open]);

  return (
    <>
      <Modal
        title={t("canceledInvoiceForm") + saleInvoice?.invoiceCode}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        width={800}
        style={{ top: "10px" }}
        maskClosable={false}
        onCancel={handleCancel}
      >
        <div>
          <Form form={form} onFinish={onFinish} autoComplete="off">
            <Form.Item name="id" hidden>
              <Input />
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

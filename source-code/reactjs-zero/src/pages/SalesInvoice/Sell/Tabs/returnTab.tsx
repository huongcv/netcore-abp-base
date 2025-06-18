import {Button, Form, Input, Space} from "antd";
import React, {useEffect} from "react";
import {FileSearchOutlined} from "@ant-design/icons";
import {SaleInvoiceDto} from "@api/index.defs";
import {ReturnIcon} from "@ord-components/icon/ReturnIcon";
import {SaleInvoiceService} from "@api/SaleInvoiceService";
import UiUtils from "@ord-core/utils/ui.utils";

export const ReturnTab = (props: {
    cancelHandler: React.EventHandler<any>,
    openListInvoiceHandler: React.EventHandler<any>,
    invoiceSelectHandler: React.EventHandler<any>,
    invoice: SaleInvoiceDto | undefined
}) => {
    const [selectedInvoice, setSelectedInvoice] = React.useState<SaleInvoiceDto>();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldValue('invoiceCode', props.invoice?.invoiceCode);
        setSelectedInvoice(props.invoice);
    }, [props.invoice]);

    const formSubmit = (values: any) => {
        if(values.invoiceCode) {
            UiUtils.setBusy();
            SaleInvoiceService.getSaleInvoiceByCode({ invoiceCode: values.invoiceCode }).then(rsp => {
                if(rsp.isSuccessful) {
                    props.invoiceSelectHandler(rsp.data);
                }
                else
                {
                    UiUtils.showError(rsp.errorDetail?.message)
                }
                UiUtils.clearBusy();
            })
        }
    }
    return (<>
        Phiếu trả hàng

        <Space.Compact style={{marginInlineStart: 10}}>
            <Form form={form} onFinish={formSubmit}>
                <Form.Item name="invoiceCode" noStyle>
                    <Input style={{borderRadius: 0, width: 120}} placeholder="Nhập hóa đơn" />
                </Form.Item>
            </Form>
            <Button onClick={props.openListInvoiceHandler} type={"dashed"}><FileSearchOutlined /></Button>
            <Button title="Quay lại bán hàng" onClick={props.cancelHandler} type={"dashed"}><ReturnIcon /></Button>
        </Space.Compact>
    </>)
}

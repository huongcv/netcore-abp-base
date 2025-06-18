import { Button, Col, Flex, Form, Input, Modal, Radio, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useSelectPaymentMethod } from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import { useTranslation } from "react-i18next";
import { EditOutlined, MinusCircleOutlined, UndoOutlined } from "@ant-design/icons";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import { NumericFormat } from "react-number-format";
import UiUtils from "@ord-core/utils/ui.utils";
import { debounce } from "lodash";
import ShopBankAccountInput from "@pages/SalesInvoice/Form/shopBankAccountInput";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import OrdSelect from "@ord-components/forms/select/OrdSelect";

export const PaymentMethodEnum = {
    TIEN_MAT: 1,
    CHUYEN_KHOAN: 2,
    KET_HOP: 5
}

const defaultMethods = [
    { paymentMethod: PaymentMethodEnum.TIEN_MAT, paymentMethodName: 'Tiền mặt', paymentAmount: 0 },
    { paymentMethod: PaymentMethodEnum.CHUYEN_KHOAN, paymentMethodName: 'Chuyển khoản', shopBankAccountId: 1, paymentAmount: 0 },
]

export const PaymentMethodForm = (props: any) => {
    const { t } = useTranslation('sale-invoice');
    const form = Form.useFormInstance();
    const [formKetHop] = Form.useForm();
    const [options, setOptions] = useState<any>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [payments, setPayments] = useState(defaultMethods);
    const paymentObj_w = Form.useWatch('paymentObj', formKetHop);
    const [count, setCount] = useState(payments.length);
    const [totalOfMethod, setTotalOfMethod] = useState(0);

    const ds = useSelectPaymentMethod();
    useEffect(() => {
        setOptions(ds.data.map(it => {
            return { ...it }
        }));
    }, [ds.data]);

    useEffect(() => {
        if (paymentObj_w) {
            setCount(paymentObj_w.length);
            setTotalOfMethod(paymentObj_w.reduce((total: number, participant: any) => total + participant.paymentAmount, 0))
        }
    }, [paymentObj_w]);

    useEffect(() => {
        reCalculatorAmount(true);
    }, [count]);
    const w_paymentMethod = Form.useWatch('paymentMethod', form)
    useEffect(() => {
        if (w_paymentMethod == PaymentMethodEnum.KET_HOP) {
            showModal();
        }
    }, [w_paymentMethod]);

    const showModal = () => {
        setOpenModal(true);
        const paymentObj = form.getFieldValue('paymentMethodObjDto');
        const paymentAmount = (form.getFieldValue('paymentAmount') || 0);
        formKetHop.setFieldValue('paymentAmount', paymentAmount);
        if (!paymentObj) {
            reCalculatorAmount();
        }
    }

    const reCalculatorAmount = (isUpdate?: boolean) => {
        const paymentAmount = (formKetHop.getFieldValue('paymentAmount') || 0);
        const _payments = isUpdate && paymentObj_w ? paymentObj_w : payments;
        const amount = Math.round(paymentAmount / _payments.length);
        const sub = amount * (_payments.length - 1)
        const newObj = _payments.map((it: any, index: number) => {
            return {
                ...it,
                paymentAmount: (index + 1) == payments.length ? paymentAmount - sub : amount,
            }
        })
        setPayments(newObj);
        formKetHop.setFieldValue('paymentObj', newObj);
    }


    return <>
        <Row justify="space-between" align="middle">
            <Col>{t("paymentMethod")}</Col>
            <Col>
                <Space.Compact>
                    <Form.Item noStyle name="paymentMethod" initialValue={PaymentMethodEnum.TIEN_MAT}>
                        <OrdSelect className="cs-input" disabled={props.disabled} style={{ fontSize: 12, fontWeight: "normal", width: 200 }} datasource={useSelectPaymentMethod({
                            hiddenCentralBilling: true
                        })}></OrdSelect>
                    </Form.Item>
                </Space.Compact>


            </Col>
            {
                w_paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN &&
                <Col span={24}>
                    <Space.Compact style={{ width: '100%', marginTop: 5 }}>
                        <Form.Item name="shopBankAccountId" style={{ width: '100%' }}>
                            <ShopBankAccountInput />
                        </Form.Item>
                    </Space.Compact>
                </Col>
            }
        </Row>
        <div hidden>
            <Form.Item name='paymentMethodObjDto' />
        </div>
    </>
}

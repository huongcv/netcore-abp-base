import {Button, Flex, Form, Input, Modal, Radio, Space} from "antd";
import React, {useEffect, useState} from "react";
import {useSelectPaymentMethod} from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import {useTranslation} from "react-i18next";
import {EditOutlined, MinusCircleOutlined, UndoOutlined} from "@ant-design/icons";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {NumericFormat} from "react-number-format";
import UiUtils from "@ord-core/utils/ui.utils";
import {debounce} from "lodash";
import ShopBankAccountInput from "@pages/SalesInvoice/Form/shopBankAccountInput";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";

export const PaymentMethodEnum = {
    TIEN_MAT: 1,
    CHUYEN_KHOAN: 2,
    THE: 3,
    VI_DIEN_TU: 4,
    KET_HOP: 5,
    CentralBilling:6
}

const defaultMethods = [
    {paymentMethod: PaymentMethodEnum.TIEN_MAT, paymentMethodName: 'Tiền mặt', paymentAmount: 0},
    {paymentMethod: PaymentMethodEnum.CHUYEN_KHOAN, paymentMethodName: 'Chuyển khoản', shopBankAccountId: 1, paymentAmount: 0},
    {paymentMethod: PaymentMethodEnum.THE, paymentMethodName: 'Thẻ Visa', paymentAmount: 0},
]

export const PaymentMethodForm = (props: any) => {
    const {totalPayment, disabled} = props;
    const {t} = useTranslation('sale-invoice');
    const form = Form.useFormInstance();
    const [formKetHop] = Form.useForm();
    const [options, setOptions] = useState<any>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [payments, setPayments] = useState(defaultMethods);
    const paymentObj_w = Form.useWatch('paymentObj', formKetHop);
    const debtAmount_w = Form.useWatch(values => {
        if(values) {
            const sum = values.paymentObj?.reduce((total: number, participant: any) => total + participant.paymentAmount, 0);
            return values.paymentAmount - (sum || 0);
        }
        return  0;
    }, formKetHop);
    const [count, setCount] = useState(payments.length);
    const [totalOfMethod, setTotalOfMethod] = useState(0);
    // const [payMethod, setPayMethod] = useState(1);
    // const [payMethodPrev, setPayMethodPrev] = useState(1);

    const ds = useSelectPaymentMethod();
    useEffect(() => {
        setOptions(ds.data.map(it => {
            return {...it}
        }));
    }, [ds.data]);

    useEffect(() => {
        if(paymentObj_w) {
            setCount(paymentObj_w.length);
            setTotalOfMethod(paymentObj_w.reduce((total: number, participant: any) => total + participant.paymentAmount, 0))
        }
    }, [paymentObj_w]);

    useEffect(() => {
        reCalculatorAmount(true);
    }, [count]);
    const w_paymentMethod = Form.useWatch('paymentMethod', form)
    useEffect(() => {
        if(w_paymentMethod == PaymentMethodEnum.KET_HOP) {
            showModal();
        }
    }, [w_paymentMethod]);

    // const onChange = (option:any) => {
    //     setPayMethod((prevState: number) => {
    //         setPayMethodPrev(prevState);
    //         return option.target.value;
    //     });
    //
    //     if(option.target.value == PaymentMethodEnum.KET_HOP) {
    //         showModal();
    //     }
    // }

    const handleOk = () => {
        formKetHop.submit();
    }
    // const handleClose = () => {
    //     setOpenModal(false);
    //     const hasData = form.getFieldValue('paymentMethodObjDto');
    //     if(!hasData) {
    //         form.setFieldValue('paymentMethod', payMethodPrev);
    //         setPayMethod(payMethodPrev);
    //     }
    // }

    const onFinish = (values:any) => {
        if(totalOfMethod != values.paymentAmount) {
            UiUtils.showError('Tổng tiền của các phương thức không bằng số tiền khách thanh toán.');
            return;
        }
        form.setFieldValue('paymentMethodObjDto', JSON.stringify(values.paymentObj));
        form.setFieldValue('paymentAmount', values.paymentAmount);
        setOpenModal(false);
    }

    const showModal = () => {
        setOpenModal(true);
        const paymentObj = form.getFieldValue('paymentMethodObjDto');
        const paymentAmount = (form.getFieldValue('paymentAmount') || 0);
        formKetHop.setFieldValue('paymentAmount', paymentAmount);
        if(!paymentObj) {
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
                // paymentAmount: amount,
            }
        })
        setPayments(newObj);
        formKetHop.setFieldValue('paymentObj', newObj);
    }

    const undo = () => {
        formKetHop.setFieldValue('paymentObj', defaultMethods);
    }

    const groupRadioClicked = () => {
        showModal();
    }

    return <>
        <Space.Compact>
            <Form.Item noStyle name="paymentMethod" initialValue={PaymentMethodEnum.TIEN_MAT}>
                <Radio.Group disabled={props.disabled} style={{fontSize: 12, fontWeight: "normal"}}  options={options}></Radio.Group>
            </Form.Item>
            {/*{*/}
            {/*    payMethod == PaymentMethodEnum.KET_HOP &&*/}
            {/*    <Button onClick={debounce(groupRadioClicked, 200)} size={"small"} type={"text"} style={{fontSize: 12}} className="h-[20px]">*/}
            {/*        <EditOutlined />*/}
            {/*    </Button>*/}
            {/*}*/}
        </Space.Compact>
        {
            w_paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN &&
            <Space.Compact style={{width: '100%', marginTop: 5}}>
                <Form.Item name="shopBankAccountId" style={{width:'100%'}}>
                    <ShopBankAccountInput/>
                </Form.Item>
            </Space.Compact>
        }
        <Form.Item hidden name='paymentMethodObjDto'>
            <Input></Input>
        </Form.Item>
        {/*<Modal*/}
        {/*    title={"Thanh toán kết hợp các phương thức"}*/}
        {/*    open={openModal}*/}
        {/*    onOk={handleOk}*/}
        {/*    onCancel={handleClose}*/}
        {/*    width={600}*/}
        {/*    footer={<FooterCrudModal onOk={handleOk} onCancel={handleClose} />}>*/}
        {/*    <Form form={formKetHop} onFinish={onFinish}>*/}
        {/*        <Flex className="justify-between items-center mb-2">*/}
        {/*            <strong>Khách thanh toán </strong>*/}
        {/*            <Form.Item name="paymentAmount" className="cs-input">*/}
        {/*                <PriceNumberInput style={{width: 205}} className="border-none" controls={false} step={1000} min={0}></PriceNumberInput>*/}
        {/*            </Form.Item>*/}
        {/*        </Flex>*/}
        {/*        <Form.List name="paymentObj" initialValue={payments}>*/}
        {/*            {(fields, { add, remove }) => {*/}
        {/*                return (*/}
        {/*                <>*/}
        {/*                    {fields.map(({ key, name, ...restField }) => (*/}
        {/*                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>*/}
        {/*                            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>*/}
        {/*                                {formKetHop.getFieldValue(['paymentObj', name, 'paymentMethodName'])}*/}
        {/*                                {*/}
        {/*                                    formKetHop.getFieldValue(['paymentObj', name, 'paymentMethod']) == PaymentMethodEnum.CHUYEN_KHOAN &&*/}
        {/*                                    <div className="flex-1 mx-5">*/}
        {/*                                        <Form.Item noStyle*/}
        {/*                                                   {...restField}*/}
        {/*                                                   name={[name, 'shopBankAccountId']}>*/}
        {/*                                            <ShopBankAccountInput/>*/}
        {/*                                        </Form.Item>*/}
        {/*                                    </div>*/}
        {/*                                }*/}
        {/*                            </div>*/}
        {/*                            <Space style={{ display: "flex" }}>*/}
        {/*                                <Form.Item*/}
        {/*                                    className="cs-input"*/}
        {/*                                    {...restField}*/}
        {/*                                    name={[name, 'paymentAmount']}>*/}
        {/*                                    <PriceNumberInput step={1000} min={0} controls={false}></PriceNumberInput>*/}
        {/*                                </Form.Item>*/}
        {/*                                <MinusCircleOutlined style={{marginBottom: 10}} onClick={() => remove(name)} />*/}
        {/*                            </Space>*/}
        {/*                        </div>*/}
        {/*                    ))}*/}
        {/*                </>*/}
        {/*            )}}*/}
        {/*        </Form.List>*/}
        {/*        <Flex className="justify-between items-center">*/}
        {/*            <strong>Tổng thanh toán</strong>*/}
        {/*            <strong className="text-emerald-600"><NumericFormat value={totalOfMethod} displayType={'text'} thousandSeparator={true}></NumericFormat></strong>*/}
        {/*        </Flex>*/}
        {/*        <Flex className="justify-between items-center mb-2">*/}
        {/*            <strong></strong>*/}
        {/*            {debtAmount_w != 0 &&*/}
        {/*                <strong className={`text-sm`+ (debtAmount_w > 0 && ' text-red')}>*/}
        {/*                    <span className="font-normal">{debtAmount_w > 0 ? "Thiếu: " : "Dư: "}</span>*/}
        {/*                    <NumericFormat value={debtAmount_w < 0 ? debtAmount_w * -1 : debtAmount_w} displayType={'text'}*/}
        {/*                                   thousandSeparator={true}></NumericFormat>*/}
        {/*                </strong>*/}
        {/*            }*/}
        {/*        </Flex>*/}

        {/*        <div className="text-end">*/}
        {/*            {*/}
        {/*                paymentObj_w?.length != defaultMethods.length &&*/}
        {/*                <Button onClick={undo} type={"dashed"} size={"small"}><UndoOutlined /> Đặt lại </Button>*/}
        {/*            }*/}
        {/*        </div>*/}
        {/*    </Form>*/}
        {/*</Modal>*/}
    </>
}

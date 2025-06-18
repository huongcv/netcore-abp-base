import {Col, Form, Input, Row, Space, TimePicker} from "antd";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import DateUtil from "@ord-core/utils/date.util";
import {DateIcon} from "@ord-components/icon/DateIcon";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";

export const InvoiceDateInput = () => {
    const [t] = useTranslation('sale-invoice');
    const [dateStr, setDateStr] = useState('');
    const today = new Date();
    const now = dayjs();
    const form = Form.useFormInstance();
    const changeTime = (v: any, dateStr: any) => {
        setDateStr(dateStr);
        form.setFieldValue('invoiceTimeStr', dateStr);
    }
    const invoiceTimeStr_w = Form.useWatch('invoiceTimeStr', form);
    useEffect(() => {
        console.log(invoiceTimeStr_w, dateStr)
        if (!!invoiceTimeStr_w && dateStr != invoiceTimeStr_w) {
            try {
                form.setFieldValue('invoiceTime', DateUtil.createDateWithTime(invoiceTimeStr_w + ''));
                setDateStr(invoiceTimeStr_w);
            } catch {

            }

        }

    }, [invoiceTimeStr_w]);
    return (
        <Row className="col items-center">
            <Col md={{span: 12}}>{t('invoiceDate')}:</Col>
            <Col md={{span: 12}}>
                <Space.Compact style={{width: '100%'}}>
                    <Form.Item noStyle name={'invoiceDate'} >
                        <OrdDateInput classNames="flex-1 border-none align-end" hiddenSuffixIcon={true}/>
                    </Form.Item>


                    <Form.Item noStyle name={'invoiceTime'} >
                        <TimePicker suffixIcon={<DateIcon />} showSecond={false}
                                    placeholder={'HH:mm'}
                                    className='w-[80px] border-none pr-0 align-end' onChange={changeTime}/>
                    </Form.Item>
                    <Form.Item hidden name={'invoiceTimeStr'}>
                        <Input/>
                    </Form.Item>
                </Space.Compact>
            </Col>
        </Row>

    );
}

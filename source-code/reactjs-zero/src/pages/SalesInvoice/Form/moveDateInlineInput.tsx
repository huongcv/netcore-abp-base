import {Col, Form, Input, Row, Space, TimePicker} from "antd";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {format} from "date-fns";
import DateUtil from "@ord-core/utils/date.util";

export const MoveDateInlineInput = () => {
    const [t] = useTranslation('sale-invoice');
    const [dateStr, setDateStr] = useState('');
    const today = new Date();
    const now = dayjs();
    const form = Form.useFormInstance();
    const changeTime = (v: any, dateStr: any) => {
        setDateStr(dateStr);
        form.setFieldValue('moveTimeStr', dateStr);
    }
    const moveTimeStr_w = Form.useWatch('moveTimeStr', form);
    useEffect(() => {
        if (!!moveTimeStr_w && dateStr != moveTimeStr_w) {
            try {
                form.setFieldValue('moveTime', DateUtil.createDateWithTime(moveTimeStr_w + ''));
                setDateStr(moveTimeStr_w);
            } catch {

            }

        }

    }, [moveTimeStr_w]);
    return (
        <Row className="col">
            <Col md={{span: 12}}>{t('invoiceDate')}</Col>
            <Col md={{span: 12}}>
                <Space.Compact style={{width: '100%'}}>
                    <Form.Item style={{flex: 1}} name={'moveDate'} rules={[ValidateUtils.requiredShortMess]}
                               initialValue={today}>
                        <OrdDateInput/>
                    </Form.Item>
                    <Form.Item style={{width: 100}} name={'moveTime'} rules={[ValidateUtils.requiredShortMess]}
                               initialValue={now}>
                        <TimePicker showSecond={false} className='w-full' onChange={changeTime}/>
                    </Form.Item>
                    <Form.Item hidden name={'moveTimeStr'} initialValue={format(today, 'HH:mm')}>
                        <Input/>
                    </Form.Item>
                </Space.Compact>
            </Col>
        </Row>
    );
}

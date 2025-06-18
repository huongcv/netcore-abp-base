import React from 'react';
import {Button, Form} from 'antd';
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import DateUtil from "@ord-core/utils/date.util";

const DateFormDisable: React.FC = () => {
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        console.log('Form values:', values);
    };
    const ngayNhapVien = Form.useWatch('ngayNhapVien', form);
    const ngayDieuTri = Form.useWatch('ngayDieuTri', form);
    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item
                label="Ngày nhập viện"
                name="ngayNhapVien"
                rules={[{required: true, message: 'Vui lòng chọn ngày nhập viện!'}]}
            >
                <OrdDateInput disabledDate={(current) => DateUtil.disableAfter(current, ngayDieuTri)}/>
            </Form.Item>

            <Form.Item
                label="Ngày điều trị"
                name="ngayDieuTri"
                rules={[{required: true, message: 'Vui lòng chọn ngày điều trị!'}]}
            >
                <OrdDateInput disabledDate={(current) => DateUtil.disableBefore(current, ngayNhapVien)}/>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default DateFormDisable;

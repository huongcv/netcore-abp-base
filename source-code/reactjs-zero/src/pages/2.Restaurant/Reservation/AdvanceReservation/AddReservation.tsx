import React, { useState } from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Checkbox,
    DatePicker,
    Select,
    Button,
    Space,
} from 'antd';
import dayjs from 'dayjs';
import {
    ArrowLeftOutlined,
    PlusOutlined,
    CloseOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {OrdBreadcrumb} from "@ord-components/common/page/PageBreadcrumb";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import './index.scss';

const topAction: IActionBtn[] = [
    {
        content: (
            <Link to="/restaurant/book">
                <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
            </Link>
        )
    }
];

const { RangePicker } = DatePicker;

const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
};

const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
});

const disabledRangeTime: RangePickerProps['disabledTime'] = (_, type) => {
    if (type === 'start') {
        return {
            disabledHours: () => range(0, 60).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
        };
    }
    return {
        disabledHours: () => range(0, 60).splice(20, 4),
        disabledMinutes: () => range(0, 31),
        disabledSeconds: () => [55, 56],
    };
};

const AddReservation = () => {
    const [form] = Form.useForm();

    return (
        <>
            {/* Header Buttons */}
            <Space
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    marginTop: 12
                }}
            >
                <OrdBreadcrumb mainTitle={"Thêm mới đặt bàn"} itemsRoute={[{ title: "Đặt bàn", route: "/restaurant/book" }]} />
                <Space className="bt-booking">
                    <TopAction topActions={topAction}/>
                </Space>
            </Space>

            <Row gutter={16} className="add-reservation">
                {/* Cột trái */}
                <Col span={16}>
                    {/* Thông tin khách hàng */}
                    <Card title="Thông tin khách hàng" className="mb-4">
                        <Form layout="vertical">
                            <Row gutter={24}>
                                <Col span={6}>
                                    <FloatLabel label={"Mã đặt bàn"}>
                                        <Form.Item  name="date">
                                            <Input placeholder="Nhập thông tin" />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={6}>
                                    <FloatLabel label={"Mã thẻ"}>
                                        <Form.Item  name="code">
                                            <Input placeholder="Nhập thông tin" />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={12} className="customer-name">
                                    <FloatLabel label={"Tên người đặt bàn"} required={true}>
                                        <Form.Item
                                            name="name"
                                            rules={[{ required: true, message: 'Vui lòng chọn hoặc thêm mới' }]}
                                        >
                                            <Space style={{ display: 'flex' }} className="full">
                                                <Select placeholder="Nhập thông tin" allowClear style={{ flex: 1 }} />
                                                <Button style={{ background: "var(--main-color)", color: "white" }} icon={<PlusOutlined />} onClick={() => {/* mở modal thêm khách */}} />
                                            </Space>
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={12}>
                                    <FloatLabel label={"Email"} required={false}>
                                        <Form.Item name="email">
                                            <Input placeholder="Nhập thông tin" />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={12}>
                                    <FloatLabel label={"Số điện thoại"} required={false}>
                                        <Form.Item name="phone">
                                            <Input placeholder="Nhập thông tin" />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <FloatLabel label={"Ghi chú"}>
                                        <Form.Item  name="note">
                                            <Input placeholder="Nhập thông tin" />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                            </Row>
                        </Form>
                    </Card>

                    {/* Thông tin đặt bàn */}
                    <Card title="Thông tin đặt bàn" className="mb-4">
                        <Form layout="vertical">
                            <Row gutter={24}>
                                <Col span={8}>
                                    <FloatLabel label={"Thời gian"} required={true}>
                                        <Form.Item name="date">
                                            <DatePicker placeholder="Nhập thông tin" style={{ width: '100%' }}
                                                format="YYYY-MM-DD HH:mm:ss"
                                                disabledDate={disabledDate}
                                                disabledTime={disabledDateTime}
                                                showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                                            />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={8}>
                                    <FloatLabel label={"Dự kiến thời gian phục vụ"} required={true}>
                                        <Form.Item name="expected">
                                            <DatePicker placeholder="Nhập thông tin" style={{ width: '100%' }}
                                                        format="YYYY-MM-DD HH:mm:ss"
                                                        disabledDate={disabledDate}
                                                        disabledTime={disabledDateTime}
                                                        showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                                            />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={8}>
                                    <FloatLabel label={"Số lượng"} required={true}>
                                        <Form.Item name="course">
                                            <Select placeholder="Chọn" />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={12}>
                                    <FloatLabel label={"Khu vực"} required={false}>
                                        <Form.Item name="course">
                                            <Select placeholder="Chọn" />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={12}>
                                    <FloatLabel label={"Loại bàn"} required={false}>
                                        <Form.Item name="course">
                                            <Select placeholder="Chọn" />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <FloatLabel label={"Bàn"} required={false}>
                                        <Form.Item name="course">
                                            <Select placeholder="Chọn" />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                {/* Cột phải: Yêu cầu đặc biệt */}
                <Col span={8}>
                    <Card title="Yêu cầu đặc biệt" className="mb-4 special-requests">
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{ specialRequests: [] }}
                            onFinish={values => {
                                console.log('Submitted:', values);
                            }}
                        >
                            {/* Checkbox nhóm */}
                            <Form.Item name="specialRequests">
                                <Checkbox.Group>
                                    <Space direction="vertical">
                                        <Checkbox value="birthday" style={{fontWeight: 500}}>Tổ chức sinh nhật</Checkbox>
                                        <Checkbox value="rotatable" style={{fontWeight: 500}}>Bàn có thể xoay</Checkbox>
                                        <Checkbox value="other" style={{fontWeight: 500}}>Khác</Checkbox>
                                    </Space>
                                </Checkbox.Group>
                            </Form.Item>

                            {/* TextArea chỉ hiện khi chọn “Khác” */}
                            <Form.Item noStyle shouldUpdate={(prev, curr) =>
                                curr.specialRequests !== prev.specialRequests
                            }>
                                {({ getFieldValue }) =>
                                    getFieldValue('specialRequests')?.includes('other') ? (
                                        <Form.Item
                                            name="otherRequest"
                                            rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                                        >
                                            <Input.TextArea
                                                placeholder="Nhập thông tin"
                                                autoSize={{ minRows: 2, maxRows: 4 }}
                                            />
                                        </Form.Item>
                                    ) : null
                                }
                            </Form.Item>

                            {/* Nút Hủy và Xác nhận */}
                            <Form.Item className="cancel">
                                <Space>
                                    <Link to="/restaurant/book">
                                        <Button icon={<CloseOutlined />}>Hủy</Button>
                                    </Link>

                                    <Button type="primary" icon={<CheckOutlined />} htmlType="submit">
                                        Xác nhận
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>

                </Col>
            </Row>
        </>
    );
};

export default AddReservation;

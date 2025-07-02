import React from 'react';
import {Alert, Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Switch, Typography} from 'antd';
import {MailOutlined} from '@ant-design/icons';

const {Title, Text} = Typography;
const {Option} = Select;
const {TextArea} = Input;

export const SettingSmtpEmail = () => {
    return <Card>
        <Title level={4}>
            <MailOutlined style={{marginRight: 8}}/>
            Cấu hình SMTP Email
        </Title>
        <Alert
            message="Thiết lập máy chủ email để gửi thông báo và xác thực"
            type="info"
            showIcon
            style={{marginBottom: 16}}
        />
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <Form.Item
                    name="smtpHost"
                    label="SMTP Host"
                    rules={[{required: true, message: 'Vui lòng nhập SMTP host!'}]}
                >
                    <Input placeholder="smtp.gmail.com"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="smtpPort"
                    label="SMTP Port"
                    rules={[{required: true, message: 'Vui lòng nhập SMTP port!'}]}
                >
                    <InputNumber min={1} max={65535} defaultValue={587} style={{width: '100%'}}/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="smtpUsername"
                    label="Username"
                    rules={[{required: true, message: 'Vui lòng nhập username!'}]}
                >
                    <Input placeholder="your-email@gmail.com"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="smtpPassword"
                    label="Password"
                    rules={[{required: true, message: 'Vui lòng nhập password!'}]}
                >
                    <Input.Password placeholder="App Password"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item name="smtpSecurity" label="Bảo mật">
                    <Select defaultValue="tls">
                        <Option value="none">Không</Option>
                        <Option value="tls">TLS</Option>
                        <Option value="ssl">SSL</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item name="senderName" label="Tên người gửi">
                    <Input placeholder="Hệ thống ABC"/>
                </Form.Item>
            </Col>
        </Row>
        <Form.Item name="enableEmailNotification" valuePropName="checked">
            <Switch defaultChecked/>
            <Text style={{marginLeft: 8}}>Bật thông báo email</Text>
        </Form.Item>
        <Space>
            <Button type="default">Test kết nối</Button>
            <Button type="default">Gửi email thử nghiệm</Button>
        </Space>
    </Card>
}
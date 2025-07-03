import React, {useState} from 'react';
import {Card, Col, Form, Input, InputNumber, Row, Select, Slider, Switch, Tabs, Typography} from 'antd';
import {BellOutlined, LockOutlined, MailOutlined, SafetyOutlined, SettingOutlined} from '@ant-design/icons';
import {SettingPassword} from "@pages/Admin/Setting/components/SettingPassword";
import {SettingSmtpEmail} from "@pages/Admin/Setting/components/SettingSmtpEmail";

const {Title, Text} = Typography;
const {Option} = Select;
const {TextArea} = Input;

const SystemConfigPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const tabItems = [
        {
            key: 'password',
            label: (
                <div>
                    <LockOutlined/>
                    <span>Mật khẩu</span>
                </div>
            ),
            children: <SettingPassword/>
        },
        {
            key: 'email',
            label: (
                <div>
                    <MailOutlined/>
                    <span>Email SMTP</span>
                </div>
            ),
            children: (
                <SettingSmtpEmail/>
            )
        },
        {
            key: 'system',
            label: (
                <span>
          <SettingOutlined/>
          Hệ thống
        </span>
            ),
            children: (
                <Card>
                    <Title level={4}>
                        <SettingOutlined style={{marginRight: 8}}/>
                        Cấu hình hệ thống chung
                    </Title>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="systemName" label="Tên hệ thống">
                                <Input defaultValue="Hệ thống quản lý ABC"/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="timezone" label="Múi giờ">
                                <Select defaultValue="Asia/Ho_Chi_Minh">
                                    <Option value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</Option>
                                    <Option value="UTC">UTC</Option>
                                    <Option value="America/New_York">New York (UTC-5)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="defaultLanguage" label="Ngôn ngữ mặc định">
                                <Select defaultValue="vi">
                                    <Option value="vi">Tiếng Việt</Option>
                                    <Option value="en">English</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="sessionTimeout" label="Thời gian phiên (phút)">
                                <Slider min={5} max={480} defaultValue={30}
                                        marks={{5: '5', 30: '30', 60: '60', 480: '480'}}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item name="maintenanceMode" valuePropName="checked">
                                <Switch/>
                                <Text style={{marginLeft: 8}}>Chế độ bảo trì</Text>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item name="maintenanceMessage" label="Thông báo bảo trì">
                                <TextArea
                                    rows={3}
                                    placeholder="Hệ thống đang được bảo trì, vui lòng quay lại sau..."
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            )
        }
    ];

    return (
        <div style={{padding: '24px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                <div style={{marginBottom: '24px', textAlign: 'center'}}>
                    <Title level={2}>
                        <SettingOutlined style={{marginRight: 8, color: '#1890ff'}}/>
                        Cấu Hình Hệ Thống
                    </Title>
                    <Text type="secondary">
                        Quản lý và thiết lập các cấu hình hệ thống
                    </Text>
                </div>
                <div>
                    <Tabs
                        defaultActiveKey="password"
                        items={tabItems}
                        tabBarStyle={{
                            margin: 0,
                            padding: '0 24px',
                            background: '#fafafa',
                            borderBottom: '1px solid #d9d9d9'
                        }}
                        style={{minHeight: '600px'}}
                        tabBarGutter={32}
                    />
                </div>
            </div>
        </div>
    );
};

export default SystemConfigPage;
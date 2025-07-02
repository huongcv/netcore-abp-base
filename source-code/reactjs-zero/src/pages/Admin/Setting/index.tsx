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
        },
        {
            key: 'security',
            label: (
                <span>
          <SafetyOutlined/>
          Bảo mật
        </span>
            ),
            children: (
                <Card>
                    <Title level={4}>
                        <SafetyOutlined style={{marginRight: 8}}/>
                        Cấu hình bảo mật
                    </Title>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="enableIPWhitelist" valuePropName="checked">
                                <Switch/>
                                <Text style={{marginLeft: 8}}>Bật danh sách IP được phép</Text>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="enableAuditLog" valuePropName="checked">
                                <Switch defaultChecked/>
                                <Text style={{marginLeft: 8}}>Ghi log hoạt động</Text>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item name="allowedIPs" label="Danh sách IP được phép">
                                <TextArea
                                    rows={3}
                                    placeholder="192.168.1.1&#10;10.0.0.0/24&#10;203.162.4.191"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="maxFileUploadSize" label="Kích thước file tối đa (MB)">
                                <InputNumber min={1} max={1000} defaultValue={10} style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="allowedFileTypes" label="Loại file cho phép">
                                <Select mode="multiple" defaultValue={['jpg', 'png', 'pdf']}>
                                    <Option value="jpg">JPG</Option>
                                    <Option value="png">PNG</Option>
                                    <Option value="pdf">PDF</Option>
                                    <Option value="doc">DOC</Option>
                                    <Option value="xlsx">XLSX</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            )
        },
        {
            key: 'notification',
            label: (
                <span>
          <BellOutlined/>
          Thông báo
        </span>
            ),
            children: (
                <Card>
                    <Title level={4}>
                        <BellOutlined style={{marginRight: 8}}/>
                        Cấu hình thông báo
                    </Title>
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item name="enableSystemNotification" valuePropName="checked">
                                <Switch defaultChecked/>
                                <Text style={{marginLeft: 8}}>Thông báo hệ thống</Text>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="enableEmailAlert" valuePropName="checked">
                                <Switch defaultChecked/>
                                <Text style={{marginLeft: 8}}>Cảnh báo qua email</Text>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="enableSMSAlert" valuePropName="checked">
                                <Switch/>
                                <Text style={{marginLeft: 8}}>Cảnh báo qua SMS</Text>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item name="adminEmails" label="Email quản trị viên">
                                <TextArea
                                    rows={2}
                                    placeholder="admin1@company.com, admin2@company.com"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="notificationRetentionDays" label="Lưu thông báo (ngày)">
                                <InputNumber min={1} max={365} defaultValue={30} style={{width: '100%'}}/>
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
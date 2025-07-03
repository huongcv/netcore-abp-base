import React from 'react';
import {Input, Select, Tabs, Typography} from 'antd';
import {LockOutlined, MailOutlined, SettingOutlined} from '@ant-design/icons';
import {SettingPassword} from "@pages/Admin/Setting/components/SettingPassword";
import {SettingSmtpEmail} from "@pages/Admin/Setting/components/SettingSmtpEmail";
import {CommonSetting} from "@pages/Admin/Setting/components/CommonSetting";

const {Title, Text} = Typography;
const {Option} = Select;
const {TextArea} = Input;

const SystemConfigPage = () => {
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
                <div>
                    <SettingOutlined/>
                    <span>Hệ thống</span>
                </div>
            ),
            children: <CommonSetting/>
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
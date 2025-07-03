import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Card, Descriptions, Divider, Space, Tag, Typography} from 'antd';
import {SmtpMailingDto} from "@api/base/index.defs";
import {Edit, Mail, Send, Wifi} from 'lucide-react';
import {HostSystemSettingService} from "@api/base/HostSystemSettingService";
import {useSmtpConfigModal} from "@pages/Admin/Setting/hook/useSmtpConfigModal";

const {Title, Text} = Typography;

export const SettingSmtpEmail = () => {
    const [currentData, setCurrentData] = useState<SmtpMailingDto>();
    const {openSmtpConfigModal} = useSmtpConfigModal();
    const smtpConfigItems = [
        {
            key: 'host',
            label: 'SMTP Host',
            type: 'text'
        },
        {
            key: 'port',
            label: 'SMTP Port',
            type: 'number'
        },
        {
            key: 'username',
            label: 'Username',
            type: 'text'
        },
        {
            key: 'password',
            label: 'Password',
            type: 'password'
        },
        {
            key: 'displayName',
            label: 'Tên người gửi',
            type: 'text'
        },
        {
            key: 'enableSsl',
            label: 'Bảo mật SSL',
            type: 'boolean'
        }
    ];
    const renderValue = useCallback((item: {
        key: string,
        type: string
    }) => {
        if (!currentData) {
            return null;
        }
        const value = currentData[item.key];
        if (item.type === 'boolean') {
            return (
                <Tag color={value ? 'green' : 'red'}>
                    {value ? 'Bật' : 'Tắt'}
                </Tag>
            );
        }
        if (item.type === 'password') {
            return (
                <Text code>
                    {value ? '••••••••' : 'Chưa cấu hình'}
                </Text>
            );
        }
        return <Text>{value || 'Chưa cấu hình'}</Text>;
    }, [currentData]);
    const loadSetting = async () => {
        const result = await HostSystemSettingService.getMailingSmtp();
        setCurrentData(prevData => ({
            ...result.data
        }));
    };
    useEffect(() => {
        loadSetting();
    }, []);

    const openEditModal = () => {
        if (currentData) {
            openSmtpConfigModal(currentData, (updateValue) => {
                setCurrentData({...updateValue})
            });
        }
    }
    return <Card>
        {
            currentData &&
            <>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                    <Title level={4} style={{margin: 0}}>
                        <Mail className={'inline mr-[8px]'} size={20}/>
                        <span>Cấu hình SMTP Email</span>
                    </Title>
                    <Button
                        icon={<Edit size={16}/>}
                        onClick={openEditModal}
                    >
                        Chỉnh sửa
                    </Button>
                </div>
                <Descriptions
                    column={{xs: 1, sm: 2, md: 3}}
                    bordered
                    size="middle"
                >
                    {smtpConfigItems.map(item => (
                        <Descriptions.Item label={item.label}>
                            {renderValue(item)}
                        </Descriptions.Item>
                    ))}
                </Descriptions>

                <Divider/>

                <div style={{textAlign: 'right'}}>
                    <Space>
                        <Button
                            icon={<Wifi size={16}/>}
                        >
                            Test kết nối
                        </Button>
                        <Button
                            type="default"
                            icon={<Send size={16}/>}
                        >
                            Gửi email thử nghiệm
                        </Button>
                    </Space>
                </div>
            </>
        }
    </Card>
}
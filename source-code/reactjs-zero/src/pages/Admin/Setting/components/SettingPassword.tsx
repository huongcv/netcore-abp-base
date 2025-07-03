import React, {useEffect, useState} from 'react';
import {Button, Card, Descriptions, Divider, Space, Tag, Typography} from 'antd';
import {Edit, ShieldCheck} from 'lucide-react';
import {HostSystemSettingService} from "@api/base/HostSystemSettingService";
import {PasswordConfigDto} from "@api/base/index.defs";
import {usePasswordConfigModal} from "@pages/Admin/Setting/hook/usePasswordConfigModal";

const {Title, Text} = Typography;

export const SettingPassword = () => {
    // Dữ liệu hiện tại
    const [currentData, setCurrentData] = useState<PasswordConfigDto>();
    const {openPasswordConfigModal} = usePasswordConfigModal();

    const passwordPolicyItems = [
        {
            key: 'passwordMinLength',
            label: 'Độ dài tối thiểu',
            type: 'number',
            unit: 'ký tự'
        },
        {
            key: 'requireUppercase',
            label: 'Yêu cầu chữ hoa',
            type: 'boolean'
        },
        {
            key: 'requireLowercase',
            label: 'Yêu cầu chữ thường',
            type: 'boolean'
        },
        {
            key: 'requireNumbers',
            label: 'Yêu cầu số',
            type: 'boolean'
        },
        {
            key: 'requireSpecialChars',
            label: 'Yêu cầu ký tự đặc biệt',
            type: 'boolean'
        },
        {
            key: 'passwordExpiry',
            label: 'Hết hạn sau',
            type: 'number',
            unit: 'ngày'
        },
        {
            key: 'maxLoginAttempts',
            label: 'Số lần đăng nhập sai tối đa',
            type: 'number',
            unit: 'lần'
        }
    ];

    const loadSetting = async () => {
        const result = await HostSystemSettingService.getPasswordConfig();
        setCurrentData({...result.data});
    }
    useEffect(() => {
        loadSetting();
    }, []);
    const openEditModal = () => {
        if (currentData) {
            openPasswordConfigModal(currentData, (updateValue) => {
                setCurrentData({
                    ...updateValue
                })
            });
        }
    }
    const renderValue = (item: any, value: any) => {
        if (item.type === 'boolean') {
            return (
                <Tag color={value ? 'green' : 'red'}>
                    {value ? 'Bật' : 'Tắt'}
                </Tag>
            );
        }
        if (item.type === 'number') {
            return (
                <Text strong>
                    {value} {item.unit}
                </Text>
            );
        }
        return <Text>{value}</Text>;
    };
    if (currentData == null) {
        return null;
    }

    return (
        <div>
            <Card>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                    <Title level={4} style={{margin: 0}}>
                        <ShieldCheck className={'inline mr-[8px]'} size={20}/>
                        <span>Cấu hình chính sách mật khẩu</span>
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
                    {passwordPolicyItems.map(item => (
                        <Descriptions.Item
                            label={item.label}>
                            {renderValue(item, currentData[item.key])}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
                <Divider/>

            </Card>
        </div>
    );
};
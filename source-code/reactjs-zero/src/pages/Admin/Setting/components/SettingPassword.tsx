import React, {useState} from 'react';
import {
    Alert,
    Button,
    Card,
    Descriptions,
    Divider,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Switch,
    Tag,
    Typography
} from 'antd';
import {Edit, ShieldCheck} from 'lucide-react';

const {Title, Text} = Typography;
const {Option} = Select;
const {TextArea} = Input;

export const SettingPassword = () => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Dữ liệu hiện tại
    const [currentData, setCurrentData] = useState({
        passwordMinLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        passwordExpiry: 60,
        maxLoginAttempts: 10,
        enableTwoFA: true
    });

    const passwordPolicyItems = [
        {
            key: 'passwordMinLength',
            label: 'Độ dài tối thiểu',
            component: <InputNumber min={6} max={50} style={{width: '100%'}}/>,
            type: 'number',
            unit: 'ký tự'
        },
        {
            key: 'requireUppercase',
            label: 'Yêu cầu chữ hoa',
            component: <Switch/>,
            type: 'boolean'
        },
        {
            key: 'requireLowercase',
            label: 'Yêu cầu chữ thường',
            component: <Switch/>,
            type: 'boolean'
        },
        {
            key: 'requireNumbers',
            label: 'Yêu cầu số',
            component: <Switch/>,
            type: 'boolean'
        },
        {
            key: 'requireSpecialChars',
            label: 'Yêu cầu ký tự đặc biệt',
            component: <Switch/>,
            type: 'boolean'
        },
        {
            key: 'passwordExpiry',
            label: 'Hết hạn sau',
            component: <InputNumber min={0} max={365} style={{width: '100%'}}/>,
            type: 'number',
            unit: 'ngày'
        },
        {
            key: 'maxLoginAttempts',
            label: 'Số lần đăng nhập sai tối đa',
            component: <InputNumber min={1} max={100} style={{width: '100%'}}/>,
            type: 'number',
            unit: 'lần'
        }
    ];

    const handleEdit = () => {
        form.setFieldsValue(currentData);
        setEditModalVisible(true);
    };

    const handleCancel = () => {
        setEditModalVisible(false);
        form.resetFields();
    };

    const renderValue = (item, value) => {
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

    const getSecurityLevel = () => {
        let score = 0;
        if (currentData.passwordMinLength >= 8) score += 1;
        if (currentData.requireUppercase) score += 1;
        if (currentData.requireLowercase) score += 1;
        if (currentData.requireNumbers) score += 1;
        if (currentData.requireSpecialChars) score += 1;
        if (currentData.passwordExpiry <= 90) score += 1;
        if (currentData.maxLoginAttempts <= 5) score += 1;

        if (score >= 6) return {level: 'Cao', color: 'green'};
        if (score >= 4) return {level: 'Trung bình', color: 'orange'};
        return {level: 'Thấp', color: 'red'};
    };

    const securityLevel = getSecurityLevel();

    return (
        <div>
            <Card>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                    <Title level={4} style={{margin: 0}}>
                        <ShieldCheck style={{marginRight: 8}} size={20}/>
                        Cấu hình chính sách mật khẩu
                    </Title>
                    <Button
                        type="primary"
                        icon={<Edit size={16}/>}
                        onClick={handleEdit}
                    >
                        Chỉnh sửa
                    </Button>
                </div>

                <Alert
                    message={
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <span>Mức độ bảo mật hiện tại</span>
                            <Tag color={securityLevel.color} style={{margin: 0}}>
                                {securityLevel.level}
                            </Tag>
                        </div>
                    }
                    type={securityLevel.color === 'green' ? 'success' : securityLevel.color === 'orange' ? 'warning' : 'error'}
                    showIcon
                    style={{marginBottom: 24}}
                />

                <Descriptions
                    column={{xs: 1, sm: 2, md: 3}}
                    bordered
                    size="middle"
                >
                    {passwordPolicyItems.map(item => (
                        <Descriptions.Item
                            key={item.key}
                            label={item.label}
                        >
                            {renderValue(item, currentData[item.key])}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
                <Divider/>
                <div style={{textAlign: 'right'}}>
                    <Space>
                        <Button>
                            Danh sách mật khẩu yếu
                        </Button>
                    </Space>
                </div>
            </Card>
        </div>
    );
};
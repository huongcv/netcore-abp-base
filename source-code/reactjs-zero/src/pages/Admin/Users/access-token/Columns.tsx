import {TableColumnsType, Tag, Tooltip} from "antd";
import {UserAccessTokenDto} from "@api/base/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    StopOutlined
} from '@ant-design/icons';
// Status constants
const TOKEN_STATUS = {
    ACTIVE: 'active',
    REVOKED: 'revoked',
    EXPIRED: 'expired',
    SUSPENDED: 'suspended'
};

const getStatusFilters = () => [
    {
        text: 'Tất cả hoạt động',
        value: 'all_active',
        children: [
            {text: 'Hoạt động', value: TOKEN_STATUS.ACTIVE},
            {text: 'Session hiện tại', value: 'current'},
        ]
    },
    {
        text: 'Không hoạt động',
        value: 'inactive',
        children: [
            {text: 'Hết hạn', value: TOKEN_STATUS.EXPIRED},
            {text: 'Đã thu hồi', value: TOKEN_STATUS.REVOKED},
            {text: 'Tạm dừng', value: TOKEN_STATUS.SUSPENDED},
        ]
    }
];


// Status configuration
const statusConfig = {
    [TOKEN_STATUS.ACTIVE]: {
        color: 'success',
        icon: <CheckCircleOutlined/>,
        text: 'Hoạt động',
        badgeStatus: 'success'
    },
    [TOKEN_STATUS.REVOKED]: {
        color: 'error',
        icon: <CloseCircleOutlined/>,
        text: 'Đã thu hồi',
        badgeStatus: 'error'
    },
    [TOKEN_STATUS.EXPIRED]: {
        color: 'warning',
        icon: <ClockCircleOutlined/>,
        text: 'Hết hạn',
        badgeStatus: 'warning'
    },
    [TOKEN_STATUS.SUSPENDED]: {
        color: 'default',
        icon: <StopOutlined/>,
        text: 'Tạm dừng',
        badgeStatus: 'default'
    }
};

export const UserAccessTokenColumns: TableColumnsType<UserAccessTokenDto> = [
    {
        title: 'Device',
        dataIndex: 'deviceName',
        width: 180,
        render: (value, dto) => (
            <div>
                <div style={{fontWeight: 500}}>{dto.deviceName || 'Unknown Device'}</div>
                <div style={{fontSize: '12px', color: '#8c8c8c'}}>
                    <Tag color="blue">{dto.platform}</Tag>
                    {dto.isCurrentToken && <Tag color="green">Current</Tag>}
                </div>
            </div>
        ),
    },
    {
        title: 'access_token_id',
        dataIndex: 'tokenId',
        render: (v, dto) => {
            return <>{v}
                {
                    dto.isCurrentToken
                }
            </>;
        }
    },
    {
        title: 'access_token_expires_at',
        dataIndex: 'expiresAt',
        width: 200,
        render: (value, dto) => {
            return DateUtil.showWithFormat(dto.expiresAt, 'dd/MM/yyyy HH:mm');
        }
    },
    {
        title: 'creation_time',
        dataIndex: 'creationTime',
        width: 200,
        render: (value, dto) => {
            return DateUtil.showWithFormat(dto.creationTime, 'dd/MM/yyyy HH:mm');
        }
    },
    {
        title: 'status',
        dataIndex: 'status',
        width: 120,
        render: (status, dto) => {
            // Determine actual status (including expired check)
            let actualStatus = status;
            if (dto.isExpired && status === TOKEN_STATUS.ACTIVE) {
                actualStatus = TOKEN_STATUS.EXPIRED;
            }

            const config = statusConfig[actualStatus] || statusConfig[TOKEN_STATUS.ACTIVE];

            return (
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Tag
                        color={config.color}
                        icon={config.icon}
                        style={{margin: 0, display: 'flex', alignItems: 'center', gap: '4px'}}
                    >
                        {config.text}
                    </Tag>
                    {dto.revokeReason && (
                        <Tooltip title={`Lý do: ${dto.revokeReason}`}>
                            <ExclamationCircleOutlined style={{color: '#8c8c8c', cursor: 'help'}}/>
                        </Tooltip>
                    )}
                </div>
            );
        },
    },
];

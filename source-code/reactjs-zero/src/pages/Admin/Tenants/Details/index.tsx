import React, {useEffect, useState} from 'react';
import {ArrowLeft, Building2, Mail, MapPin, Phone, User, Users} from 'lucide-react';

// Import Ant Design components from CDN
import {Button, Table, Tabs, Tag} from 'antd';
import {useParams} from "react-router-dom";
import {useApiActionHandler} from "@ord-core/hooks/useApiActionHandler";
import {TenantService} from "@api/base/TenantService";
import {TenantDetailDto} from "@api/base/index.defs";
import {TenantInformation} from "@pages/Admin/Tenants/Details/Information";
import {IsActiveStatusDisplay} from "@ord-components/common/display/Status/IsActiveStatusDisplay";
import {Copyable} from "@ord-components/common/display/Copyable";

const TenantDetailPage = () => {

    const {id} = useParams();
    const {executeApiAction} = useApiActionHandler();
    const [tenantData, setTenantData] = useState<TenantDetailDto>();

    const loadTenantDetail = async (encodedId: string) => {
        await executeApiAction(
            () => TenantService.getById({
                body: {
                    encodedId
                }
            }), {
                afterSuccess: (dto) => {
                    setTenantData(dto);
                }
            }
        );
    }
    useEffect(() => {
        if (id) {
            loadTenantDetail(id).then();
        }
    }, [id]);

    // Mock data for tenant


    // Mock data for users
    const userData = [
        {
            key: '1',
            id: 1,
            name: 'Nguyễn Văn An',
            email: 'an.nguyen@abc-company.com',
            role: 'Admin',
            status: 'active',
            lastLogin: '2024-06-27'
        },
        {
            key: '2',
            id: 2,
            name: 'Trần Thị Bình',
            email: 'binh.tran@abc-company.com',
            role: 'Manager',
            status: 'active',
            lastLogin: '2024-06-26'
        },
        {
            key: '3',
            id: 3,
            name: 'Lê Hoàng Cường',
            email: 'cuong.le@abc-company.com',
            role: 'User',
            status: 'inactive',
            lastLogin: '2024-06-20'
        },
        {
            key: '4',
            id: 4,
            name: 'Phạm Thị Dung',
            email: 'dung.pham@abc-company.com',
            role: 'User',
            status: 'active',
            lastLogin: '2024-06-27'
        }
    ];

    const getStatusTag = (isActive: boolean) => {
        return isActive
            ? <Tag color="green">Hoạt động</Tag>
            : <Tag color="red">Không hoạt động</Tag>;
    };

    // Table columns for users
    const userColumns = [
        {
            title: 'Người dùng',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500"/>
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {text}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: getStatusTag,
        },
    ];

    const tabItems = [
        {
            key: 'overview',
            label: 'Thông tin chung',
            children: (
                <TenantInformation tenantData={tenantData}/>
            ),
        },
        {
            key: 'users',
            label: (
                <span className="flex items-center">
          <Users className="h-4 w-4 mr-2"/>
          Danh sách người dùng ({userData.length})
        </span>
            ),
            children: (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <Users className="h-5 w-5 mr-2"/>
                            Danh sách người dùng ({userData.length})
                        </h3>
                        <Button type="primary">
                            Thêm người dùng
                        </Button>
                    </div>

                    <Table
                        columns={userColumns}
                        dataSource={userData}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} người dùng`,
                        }}
                        scroll={{x: 800}}
                    />
                </div>
            ),
        },
    ];

    if (!tenantData) {
        return null;
    }
    const handleBack = () => {

    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <div className="mb-4">
                    <Button
                        icon={<ArrowLeft className="h-4 w-4"/>}
                        onClick={handleBack}
                        className="flex items-center"
                    >
                        Quay lại
                    </Button>
                </div>
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Building2 className="h-8 w-8 text-blue-600"/>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{tenantData.name}</h1>
                                <p className="text-gray-600">Mã: {tenantData.code}</p>
                            </div>
                        </div>
                        <div className={`px-3 py-1`}>
                            <IsActiveStatusDisplay value={tenantData?.isActived} type={'badge'}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Mail className="h-5 w-5 text-gray-600"/>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">
                                    <Copyable textToCopy={tenantData?.email}/>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Phone className="h-5 w-5 text-gray-600"/>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Điện thoại</p>
                                <p className="font-medium text-gray-900">
                                    <Copyable  textToCopy={tenantData?.phoneNumber}/>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <MapPin className="h-5 w-5 text-gray-600"/>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                <p className="font-medium text-gray-900 truncate">{tenantData?.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <Tabs
                        defaultActiveKey="overview"
                        items={tabItems}
                        size="large"
                    />
                </div>
            </div>
        </div>
    );
};
export default TenantDetailPage;
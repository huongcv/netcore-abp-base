import React, {useEffect, useState} from 'react';
import {ArrowLeft, Building2, Mail, MapPin, Phone, Users} from 'lucide-react';

// Import Ant Design components from CDN
import {Button, Tabs} from 'antd';
import {useParams} from "react-router-dom";
import {useApiActionHandler} from "@ord-core/hooks/useApiActionHandler";
import {TenantService} from "@api/base/TenantService";
import {TenantDetailDto} from "@api/base/index.defs";
import {TenantInformation} from "@pages/Admin/Tenants/Details/Information";
import {IsActiveStatusDisplay} from "@ord-components/common/display/Status/IsActiveStatusDisplay";
import {Copyable} from "@ord-components/common/display/Copyable";
import {TenantUserList} from "@pages/Admin/Tenants/Details/UserList";

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
          Danh sách người dùng
        </span>
            ),
            children: (
                <div>
                    <TenantUserList tenantDto={tenantData}/>
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
        <div className="min-h-screen">
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
                                <Phone className="h-5 w-5 text-gray-600"/>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Điện thoại</p>
                                <p className="font-medium text-gray-900">
                                    <Copyable textToCopy={tenantData?.phoneNumber}/>
                                </p>
                            </div>
                        </div>
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
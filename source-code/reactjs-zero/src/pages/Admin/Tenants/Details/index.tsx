import React, {useEffect, useState} from 'react';
import {ArrowLeft, Users} from 'lucide-react';

// Import Ant Design components from CDN
import {Button, Tabs} from 'antd';
import {useParams} from "react-router-dom";
import {useApiActionHandler} from "@ord-core/hooks/useApiActionHandler";
import {TenantService} from "@api/base/TenantService";
import {TenantDetailDto} from "@api/base/index.defs";
import {TenantInformation} from "@pages/Admin/Tenants/Details/Information";
import {TenantUserList} from "@pages/Admin/Tenants/Details/UserList";
import {TenantOverview} from "@pages/Admin/Tenants/Details/Overview";

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
                {
                    tenantData && <TenantOverview tenantData={tenantData}/>
                }
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <Tabs
                        defaultActiveKey="overview"
                        destroyOnHidden
                        items={tabItems}
                        size="large"
                    />
                </div>
            </div>
        </div>
    );
};
export default TenantDetailPage;
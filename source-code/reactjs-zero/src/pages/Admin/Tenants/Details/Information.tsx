import React from "react";
import {TenantDetailDto} from "@api/base/index.defs";
import {Building2, Mail, Phone, MapPin, Activity, Calendar} from "lucide-react";
import {DateDisplay} from "@ord-components/common/display/DateDisplay";
import {Tag} from "antd";
import {IsActiveStatusDisplay} from "@ord-components/common/display/Status/IsActiveStatusDisplay";

export const TenantInformation: React.FC<{
    tenantData?: TenantDetailDto
}> = ({tenantData}) => {
    if (!tenantData) {
        return null;
    }
    return (<>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-gray-400 mt-1"/>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Tên công ty</p>
                        <p className="text-gray-900">{tenantData?.name}</p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-1"/>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                        <p className="text-gray-900">{tenantData?.phoneNumber}</p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-1"/>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{tenantData?.email}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1"/>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                        <p className="text-gray-900">{tenantData?.address}</p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1"/>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
                        <p className="text-gray-900">
                            <DateDisplay value={tenantData?.creationTime}/>
                            <Tag className={'ms-2'}>
                                <DateDisplay value={tenantData?.creationTime}
                                             mode={"relative"}/></Tag>
                        </p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <Activity className="h-5 w-5 text-gray-400 mt-1"/>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                        <IsActiveStatusDisplay value={tenantData?.isActived}/>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
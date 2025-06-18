import { useTranslation } from "react-i18next";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { EmployeeDto } from "@api/index.defs";
import { Divider, Space, Tag } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { EmployeeService } from "@api/EmployeeService";
import { useEffect, useState } from "react";

export const useSelectHrEmployee = (): SelectDataSource => {
    const [dataSource, setDataSource] = useState<SelectDataSource>({
        data: [],
        isPending: true,
    });

    useEffect(() => {
        const fetch = async () => {
            const result = await EmployeeService.getComboOptions();
            const data = result?.map(it => ({
                ...EmployeeRenderSelectItem(it.data),
            })) ?? [];

            setDataSource({ data, isPending: false });
        };

        fetch();
    }, []);

    return dataSource;
};


export const EmployeeRenderSelectItem = (dto: EmployeeDto) => {
    return {
        value: dto.id,
        label: (<Space.Compact><b>{dto.fullUserName}</b></Space.Compact>),
        data: { ...dto },
        fts: Utils.removeAccentVietnamese([
            dto.fullUserName,
            dto.userName,
            dto.phoneNumber,
            dto.email]),
    }
}


export const EmployeeOptionLabel = (props: {
    dto: EmployeeDto
}) => {
    const { dto } = props;
    return (<>
        {
            dto && (<>
                <Space.Compact>
                    <b>{dto?.fullUserName}</b>
                    {
                        dto.phoneNumber && <Tag color={'blue'} className='ms-1'><PhoneOutlined /> {dto.phoneNumber}</Tag>
                    }
                </Space.Compact>
            </>)
        }
    </>)
}

import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {PartnerDto, EmployeeDto} from "@api/index.defs";
import {Space, Tag} from "antd";
import {PhoneOutlined} from "@ant-design/icons";
import {ShopWorkShiftService} from "@api/ShopWorkShiftService";
import {EmployeeService} from "@api/EmployeeService";


export const useSelectEmployee = (): SelectDataSource => {
    const key = 'PartnerEmployee';

    return useSelectDataSource(key, async () => {
        const result = await EmployeeService.getComboOptions();
        if (!result || result.length === 0) {
            return [];
        }
        return result.map(it => {
            return {
                ...EmployeeRenderSelectItem(it.data)
            }
        });
    });
};


export const EmployeeRenderSelectItem = (dto: EmployeeDto) => {
    return {
        value: dto.id,
        label: (<Space.Compact>
            {
                dto.code && <span className='me-1 text-primary'>{dto.code}</span>
            }
            <b>{dto.fullUserName}</b>
        </Space.Compact>),
        data: {...dto},
        fts: Utils.removeAccentVietnamese([
            dto.fullUserName,
            dto.code,
            dto.phoneNumber,
            dto.email]),
    }
}


export const EmployeeOptionLabel = (props: {
    dto: PartnerDto
}) => {
    const {dto} = props;
    return (<>
        {
            dto && (<>
                <Space.Compact>
                    <b>{dto?.name}</b>
                    {
                        dto.code && <Tag className='ms-1'>{dto.code}</Tag>
                    }
                    {
                        dto.phone && <Tag color={'blue'}>
                            <PhoneOutlined></PhoneOutlined> {dto.phone}
                        </Tag>
                    }

                </Space.Compact>
                {
                    dto.address && <div className='italic'>{dto.address}</div>
                }
            </>)

        }
    </>)
}

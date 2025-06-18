import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {PartnerDto, PARTNER_TYPE} from "@api/index.defs";
import {Space, Tag} from "antd";
import {PhoneOutlined} from "@ant-design/icons";
import {PartnerService} from "@api/PartnerService";

export const ComboKeyPartner = (partnerType: PARTNER_TYPE | undefined) => {
    return 'Partner' + partnerType;
}
export const useSelectPartner = (partnerType: PARTNER_TYPE | undefined): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = ComboKeyPartner(partnerType)

    return useSelectDataSource(key, async () => {
        if (partnerType) {
            const result = await PartnerService.getComboOptions({
                partnerType: partnerType as number
            });
            if (!result || result.length === 0) {
                return [];
            }
            return result.map(it => {
                return {
                    ...PartnerRenderSelectItem(it.data)
                }
            });
        } else {
            return [];
        }
    });
};

export const PartnerRenderSelectItem = (dto: PartnerDto) => {
    return {
        value: dto.id,
        label: (<Space.Compact>
            <p>{dto.name}</p>
        </Space.Compact>),
        data: {...dto},
        fts: Utils.removeAccentVietnamese([
            dto.name,
            dto.code,
            dto.phone,
            dto.taxCode,
            dto.email,
            dto.address]),
    }
}


export const PartnerLabel = (props: {
    dto: PartnerDto
}) => {
    const {dto} = props;
    return (<>
        {
            dto && (<>
                <Space.Compact>
                    <strong>{dto?.name}</strong>
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

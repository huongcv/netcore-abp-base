import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {PartnerDto} from "@api/index.defs";
import {Space, Tag} from "antd";
import {PhoneOutlined} from "@ant-design/icons";
import {CustomerService} from "@api/CustomerService";


export const useSelectPartnerCustomer = (): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = "PartnerCustomer"

    return useSelectDataSource(key, async () => {
        const result = await CustomerService.getComboOptions();
        if (!result || result.length === 0) {
            return [];
        }
        return result.map(it => {
            return {
                ...PartnerCustomerRenderSelectItem(it.data)
            }
        });
    });
};

export const PartnerCustomerRenderSelectItem = (dto: PartnerDto) => {
    return {
        value: dto.id,
        label: (<Space.Compact>
            {
                dto.code && <span className='me-1 text-primary'>{dto.code}</span>
            }
            <b>{dto.name}</b>
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


export const PartnerCustomerLabel = (props: {
    dto: PartnerDto
}) => {
    const { dto } = props;
    return (
        <>
            {dto && (
                <>
                    <Space.Compact>
                        <p style={{ fontWeight: 500 }} className="mr-1">{dto.name}</p>
                    </Space.Compact>
                    {dto.type === 2 && dto.taxCode && (
                        <div className="italic">MST: {dto.taxCode}</div>
                    )}
                    {dto.type === 1 && dto.phone && (
                        <div className="italic">SĐT: {dto.phone}</div>
                    )}
                    {dto.address && (
                        <div className="italic">Địa chỉ: {dto.address}</div>
                    )}
                </>
            )}
        </>
    );
}

import { ComboOptionDto, PartnerDto } from "@api/index.defs";
import { SupplierService } from "@api/SupplierService";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";
import { Space } from "antd";

export const AllPartnerSupplierComboKey = 'AllPartnerSupplier';

export const useSelectPartnerSupplier = (): SelectDataSource => {
    return useSelectDataSource(AllPartnerSupplierComboKey, async () => {
        const result = await SupplierService.getComboOptions();
        if (!result || result.length === 0) {
            return [];
        }
        return result.map((it: ComboOptionDto) => {
            return {
                ...PartnerSupplierRenderSelectItem(it.data as PartnerDto)
            }
        });
    });
}

export const PartnerSupplierRenderSelectItem = (dto: PartnerDto) => {
    return {
        value: dto.id,
        label: (<Space.Compact>
            <span>{dto.name}</span>
        </Space.Compact>),
        data: { ...dto },
        fts: Utils.removeAccentVietnamese([
            dto.name,
            dto.code,
            dto.phone,
            dto.taxCode,
            dto.email,
            dto.address]),
    }
}


export const PartnerSupplierLabel = (props: {
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
                    {dto.taxCode && (
                        <div className="italic">MST: {dto.taxCode}</div>
                    )}
                    {dto.address && (
                        <div className="italic">Địa chỉ: {dto.address}</div>
                    )}
                </>
            )}
        </>
    );
}


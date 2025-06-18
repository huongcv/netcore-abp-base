import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {VietQrService} from "@api/VietQrService";
import { ShopBankAccountService } from "@api/ShopBankAccountService";
import { ComboOptionDto } from "@api/index.defs";
import {Space, Tag} from "antd";

export const useSelectBank = (): SelectDataSource => {
    const key = 'bank';

    return useSelectDataSource(key, async () => {
        const result = await ShopBankAccountService.getListBank();
        if (!result || result.length === 0) {
            return [];
        }
        return result.map(it => {
            return {
                ...BankRenderSelectItem(it)
            }
        });
    });
};

export const BankRenderSelectItem = (dto: ComboOptionDto) => {
    return {
        value: dto.value,
        label: (<Space.Compact>
            <p>{dto.value} - {dto.displayName}</p>
        </Space.Compact>),
        data: { ...dto.data },
        fts: Utils.removeAccentVietnamese([dto.value, dto.displayName]),
    };
};
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ShopBankAccountService} from "@api/ShopBankAccountService";
import {ShopBankAccountDto} from "@api/index.defs";
import {Space} from "antd";

export const useSelectShopBankAccount = (): SelectDataSource => {
    const key = 'ShopBankAccount';

    return useSelectDataSource(key, async () => {
        const result = await ShopBankAccountService.getComboOptions();
        return Utils.mapCommonSelectOption(result);
    });
}

export const BankAccountRenderSelectItem = (dto: ShopBankAccountDto) => {
    return {
        value: dto.id,
        label: (<Space.Compact>
            {/*{*/}
            {/*    dto.code && <span className='me-1 text-primary'>{dto.code}</span>*/}
            {/*}*/}
            <span>{dto.accountName}</span>
        </Space.Compact>),
        data: {...dto},
        fts: Utils.removeAccentVietnamese([
            dto.accountCode,
            dto.accountName,
            dto.bankCode]),
    }
}

export const BankAccountLabel = (props: {
    dto: ShopBankAccountDto
}) => {
    const {dto} = props;
    return <>
        {
            dto && (<>
                <Space.Compact>
                    <b>{dto?.accountName}</b>
                </Space.Compact>
                <div className='italic text-emerald-600 text-sm'>{dto.accountCode} - {dto.bankCode}</div>
            </>)
        }
    </>
}

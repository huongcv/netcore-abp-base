import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ComboEnumService} from "@api/ComboEnumService";
import {useTranslation} from "react-i18next";
import {AccessCardTypeEnum, GENDER} from "@api/index.defs";
import {AccessCardService} from "@api/AccessCardService";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectDataSourceNoCache} from "@ord-core/hooks/useSelectDataSourceNoCache";

export const useGolfAccessCardAvailable = (cardType?: AccessCardTypeEnum): SelectDataSource => {
    return useSelectDataSourceNoCache(async () => {
        const result = await AccessCardService.getAccessCardAvairable({
            body: {
                cardType: cardType
            }
        })
        if (result.isSuccessful && result.data)
            return result.data.map(it => ({
                value: it.value,
                label: <div className='flex w-full'>
                    <strong className='flex-1'>Mã thẻ : {it.displayName}</strong>
                    <div className='flex-1 text-green-600 text-right'>Số chíp: {it.data.uid}</div>
                </div>,
                disabled: it.disabled,
                fts: Utils.toLowerCaseNonAccentVietnamese(it.displayName || ''),

                data: {
                    ...it.data
                },
            }) as IOrdSelectOption);
        return Utils.mapCommonSelectOption([]);
    });

};


import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {CHANNEL_TYPE, GENDER} from "@api/index.defs";
import {useTranslation} from "react-i18next";

export const useSelectChannelType = (): SelectDataSource => {
    const key = 'channelType';
    const {t} = useTranslation('enum');

    return useSelectDataSource(key, async () => {
        return [{
            /// bán trực tiếp
            value: 0  as CHANNEL_TYPE,
            label: t('channelType.Direct.Sales'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('channelType.Direct.Sales'))
        },
            // Sàn TMĐT
        {
            value: 1 as CHANNEL_TYPE,
            label: t('channelType.Lazada'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('channelType.Lazada'))
        },
        {
            value: 2 as CHANNEL_TYPE,
            label: t('channelType.Sendo'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('channelType.Sendo'))
        },
        {
            value: 3 as CHANNEL_TYPE,
            label: t('channelType.Shopee'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('channelType.Shopee'))
        },




            // Mạng xã hội
        {
            value: 101 as CHANNEL_TYPE,
            label: t('channelType.Facebook'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('channelType.Facebook'))
        },
        {
            value: 102 as CHANNEL_TYPE,
            label: t('channelType.Tiktok'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('channelType.Tiktok'))
        },

             // Website
        {
            value: 201 as CHANNEL_TYPE,
            label: t('channelType.Website'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('channelType.Website'))
        },


            // Khác
        {
            value: 999 as CHANNEL_TYPE,
            label: t('channelType.Other'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('channelType.Other'))
        },
        ];
    });
};

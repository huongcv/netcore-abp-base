import React from "react";
import {useTranslation} from "react-i18next";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectChannelType} from "@ord-components/forms/select/selectDataSource/useSelectChannelType";

export const ChannelForm = (props: {}) => {
    const {t} = useTranslation('sale-invoice');
    return (
        <OrdSelect placeholder={t("channel")}
                   datasource={useSelectChannelType()}></OrdSelect>
    )
}

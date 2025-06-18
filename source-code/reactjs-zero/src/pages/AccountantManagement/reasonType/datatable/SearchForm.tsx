import {useTranslation} from "react-i18next";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import React from "react";
import {SearchIsActived} from "@ord-components/forms/search/SearchIsActived";
import { Form } from "antd";

const enum REASONTYPE_OTHER {
    CHI_KHAC = 1999,
    THU_KHAC = 999
}

export const ReasonTypeSearchForm = () => {
    const {t} = useTranslation('reason-type');
    const {t: tCommon} = useTranslation('common');
    return (
        <>
            <SearchIsActived span={4}/>
            <SearchFilterText span={10}/>
            <Form.Item hidden name='lstReasonTypeEnumId' initialValue={[REASONTYPE_OTHER.THU_KHAC, REASONTYPE_OTHER.CHI_KHAC]} />
        </>
    )
}

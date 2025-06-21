import React from "react";
import {useTranslation} from "react-i18next";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";

export const UserSearchForm = () => {
    const {t} = useTranslation('common');
    return (<>
        <SearchFilterText placeHolder={'user'} span={12}/>
    </>);
}

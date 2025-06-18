import {ICommonSelectInputProp} from "@ord-components/forms/model/SelectProp";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {BaseOptionType} from "rc-select/lib/Select";
import {useStore} from "@ord-store/index";
import {Select} from "antd";
import {observer} from "mobx-react-lite";
import {
    SETTING_NAME_FOR_APP,
    SETTING_NAME_FOR_TENANT,
    SETTING_NAME_FOR_USER,
    SettingType
} from "@pages/Admin/Setting/setting-name.const";
import Utils from "@ord-core/utils/utils";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";

interface Prop extends ICommonSelectInputProp {
    typeSetting: number;
}

const NameSettingSelectControl = (prop: Prop) => {
    const [t] = useTranslation('setting-list');
    const [options, setOptions] = useState<BaseOptionType[]>([]);
    const {sessionStore} = useStore();
    useEffect(() => {
        if (prop.typeSetting === SettingType.ForApp) {
            setOptions(SETTING_NAME_FOR_APP.map(m => {
                return {
                    value: m,
                    label: t(m.replace(/:/g, '.')),
                }
            }))

        }
        if (prop.typeSetting === SettingType.ForTenant) {
            setOptions(SETTING_NAME_FOR_TENANT.map(m => {
                return {
                    value: m,
                    label: t(m.replace(/:/g, '.')),
                }
            }))

        }
        if (prop.typeSetting === SettingType.ForUser) {
            setOptions(SETTING_NAME_FOR_USER.map(m => {
                return {
                    value: m,
                    label: t(m.replace(/:/g, '.')),
                }
            }))

        }
    }, [prop.typeSetting]);
    const onSearchOption = (input: any, option:any) => {
        const fts = Utils.toLowerCaseNonAccentVietnamese(option?.label) || "";
        return fts
            .toLowerCase()
            .includes(Utils.toLowerCaseNonAccentVietnamese(input.trim().toLowerCase()))
    };
    return (<Select {...prop}
                    showSearch
                    filterOption={(input, option) => onSearchOption(input, option)}
                    options={options}/>);
}

export default observer(NameSettingSelectControl);

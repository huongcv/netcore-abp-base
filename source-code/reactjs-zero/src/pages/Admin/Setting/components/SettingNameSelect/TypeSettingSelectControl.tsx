import {ICommonSelectInputProp} from "@ord-components/forms/model/SelectProp";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {BaseOptionType} from "rc-select/lib/Select";
import {useStore} from "@ord-store/index";
import {Select} from "antd";
import {observer} from "mobx-react-lite";

const TypeSettingSelectControl = (prop: ICommonSelectInputProp) => {
    const [t] = useTranslation('setting-list');
    const [options, setOptions] = useState<BaseOptionType[]>([]);
    const {sessionStore} = useStore();
    useEffect(() => {
        let settingType = [2, 3];
        if (sessionStore.appSession.user?.isSuperAdmin === true) {
            settingType = [1, 2, 3];
        }
        setOptions(settingType.map(v => {
            return {
                value: v,
                label: t('settingType.' + v),
            }
        }))
    }, []);
    return (<Select {...prop} options={options}/>);
}

export default observer(TypeSettingSelectControl);

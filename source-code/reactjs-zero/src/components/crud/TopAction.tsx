import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import AddNewEntity from "@ord-components/btn-action/AddNewEntity";
import {Space} from "antd";
import ExportExcelBtn from "@ord-components/btn-action/ExportExcelBtn";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";

export const TopAction = (prop: {
    topActions?: IActionBtn[],
    hotkeyScope?: string
}) => {
    const {t} = useTranslation('common');
    const {sessionStore} = useStore();
    const clickDefault = (it: IActionBtn) => {
        if (it.onClick) {
            it.onClick();
        }
    }
    useHotkeys('F2', (event) => {
        if (prop.topActions) {
            prop.topActions.forEach(it => {
                if (it.title === 'addNew') {
                    clickDefault(it);
                }
            })
        }
        event.preventDefault();


    }, {scopes: [prop.hotkeyScope || HotKeyScope.crudPageBase], enableOnFormTags: true});
    return (
        <>
            {
                prop?.topActions &&
                prop.topActions.filter(it => {
                    return checkPermissionUser(sessionStore.appSession, it?.permission);
                }).map(it => {
                    if (it.title === 'addNew') {
                        return (<AddNewEntity onClick={() => clickDefault(it)}></AddNewEntity>);
                    }
                    if (it.title === 'exportExcel') {
                        return (<ExportExcelBtn onClick={() => clickDefault(it)}></ExportExcelBtn>);
                    }
                    return it?.content;
                }).map((it, idx) => {
                    return <Space key={idx} className="ms-2">{it}</Space>
                })
            }
        </>
    );
}

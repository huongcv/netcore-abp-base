import {useTranslation} from "react-i18next";
import {Button, Dropdown, MenuProps, Space} from "antd";
import React from "react";
import {DeleteOutlined, DownOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {IconlyLight} from "@ord-components/icon/IconlyLight";

export interface ITableAction<TDto> {
    title: 'view' | 'edit' | 'remove' | string;
    icon?: React.ReactNode,
    onClick?: (record: TDto) => void;
    permission?: string;
    hiddenIf?: (record: any) => boolean;
    content?: (record: any) => React.ReactNode;
    contentLazy?: any;
    callBackSuccess?: (data: any) => void;
    isDanger?: boolean;
}

const TableActionCell = (prop: {
    actions: ITableAction<any>[],
    ns?: string,
    record?: any
}) => {
    const {t} = useTranslation(prop.ns ?? 'common');
    const {sessionStore, entityModalStore} = useStore();
    const mapIcon: any = {
        'view': <EyeOutlined style={{fontSize: 20}}/>,
        edit: <EditOutlined style={{fontSize: 20}}/>,
        remove: <DeleteOutlined style={{fontSize: 20}}/>
    }
    const items: MenuProps['items'] = prop.actions.filter(it => {
        if (it.hiddenIf && it.hiddenIf(prop?.record || {})) {
            return false;
        }
        return checkPermissionUser(sessionStore.appSession, it?.permission);
    }).map((it, idx) => {
        if (it.contentLazy) {
            return {
                key: '' + idx,
                label: <it.contentLazy title={t('actionBtn.' + it.title)}
                                       record={prop.record}
                                       callBackSuccess={it.callBackSuccess}
                                       entityModalStore={entityModalStore}/>
            };
        }
        if (it.content) {
            return {
                key: '' + idx,
                label: it.content(prop.record)
            };
        }
        let icon = mapIcon[it.title] ? mapIcon[it.title] : it.icon;
        let isDanger = it.isDanger || it.title === 'remove';
        return {
            key: '' + idx,
            label: (

                <Space wrap>
                    {icon}
                    {t('actionBtn.' + it.title)}
                </Space>
            ),
            onClick: () => {
                if (it.onClick) {
                    it.onClick(prop?.record);
                }
            },
            danger: isDanger
        };
    });
    return (<>
        {items.length >= 1 ? <Dropdown menu={{items}}>
            <Button style={{width: 36, height: 36, borderColor: '#5e5a5a'}}
                    icon={<IconlyLight type={'Group.svg'}/>}>
            </Button>
        </Dropdown> : null}


    </>);
}
export default observer(TableActionCell);

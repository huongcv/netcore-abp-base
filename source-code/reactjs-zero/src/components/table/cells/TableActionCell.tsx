import {useTranslation} from "react-i18next";
import {Button, Dropdown, MenuProps, Space} from "antd";
import React from "react";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
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
    const {t} = useTranslation('action');
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
        let icon = mapIcon[it.title] ? mapIcon[it.title] : it.icon;
        let isDanger = it.isDanger || it.title === 'remove';
        const defaultIconAndLabelContent = <Space wrap>
            {icon}
            {t(it.title)}
        </Space>;
        if (it.contentLazy) {
            return {
                key: '' + idx,
                label: <it.contentLazy title={t(it.title)}
                                       record={prop.record}
                                       callBackSuccess={it.callBackSuccess}
                                       entityModalStore={entityModalStore}/>,
                onClick: () => {
                    if (it.onClick) {
                        it.onClick(prop?.record);
                    }
                },
            };
        }
        if (it.content) {
            const contentWithRecord = it.content(prop.record);
            return {
                key: '' + idx,
                label: <>{defaultIconAndLabelContent} {contentWithRecord}</>,
                onClick: () => {
                    if (it.onClick) {
                        it.onClick(prop?.record);
                    }
                },
                danger: isDanger
            };
        }

        return {
            key: '' + idx,
            label: (

                <Space wrap>
                    {icon}
                    {t(it.title)}
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

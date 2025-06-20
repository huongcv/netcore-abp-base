import React from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Button, Col, Form, Space, TableColumnsType, Tag} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {observer} from "mobx-react-lite";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import {useTranslation} from "react-i18next";
import {NotificationUserDto} from "@api/index.defs";
import {CheckOutlined} from "@ant-design/icons";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";

const Notification: React.FC = () => {
    const {notificationStore: mainStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            dataIndex: 'notificationName',
            title: 'notificationName',
            render: (data, dataItem: NotificationUserDto) => {
                return <>
                    {dataItem.content?.notificationName}
                </>
            }
        },
        {
            dataIndex: 'title',
            title: 'title',
            render: (data, dataItem: NotificationUserDto) => {
                return <>
                    {dataItem.content?.title}
                </>
            }
        },
        {
            dataIndex: 'body',
            title: 'body',
            render: (data, dataItem: NotificationUserDto) => {
                return <>
                    {dataItem.content?.body}
                </>
            }
        },
        {
            dataIndex: 'state',
            title: 'state',
            align: 'center',
            width: 150,
            render: (data, dataItem: NotificationUserDto) => {
                return (dataItem?.state ?
                    <Tag color="#87d068">{t('read')}</Tag> : <Tag color="#f50">{t('notRead')}</Tag>)
            }
        },
    ], {
        actions: [
            {
                title: 'view',
                onClick: (d) => {
                    mainStore.openViewDetailModal(d);
                }
            },
            {
                title: 'setAsRead',
                icon: <CheckOutlined></CheckOutlined>,
                onClick: (d) => {
                    if (d)
                        mainStore.setAsRead(d).then(r => {
                            mainStore.refreshGridData().then()
                        })
                }
            },
        ],

        ns: mainStore.getNamespaceLocale()
    });
    const topActions: IActionBtn[] = [
        {
            title: t('setAllAsRead'),
            content: <>
                <Button onClick={() => {
                    mainStore.setAllAsRead().then(() => {
                        mainStore.refreshGridData().then()
                    })
                }}>
                    <Space>
                    </Space>
                    {t('setAllAsRead')}
                </Button>
            </>,
        },
    ];

    const useSelectState = (): SelectDataSource => {
        const key = 'FilterIsStateNotification';

        return useSelectDataSource(key, async () => {
            return [{
                value: 2,
                label: t('notRead'),
                fts: Utils.toLowerCaseNonAccentVietnamese(t('notRead'))
            }, {
                value: 1,
                label: t('read'),
                fts: Utils.toLowerCaseNonAccentVietnamese(t('read'))
            }];
        });
    };

    const SearchFilter = () => {
        return (<>
            <Col {...useResponsiveSpan(4)}>
                <FloatLabel label={t('state')}>
                    <Form.Item name='type'>
                        <OrdSelect datasource={useSelectState()}
                                   allowClear
                                   placeholder={t('filterSelectCommonPlaceholder')}/>
                    </Form.Item>
                </FloatLabel>

            </Col>
            <SearchFilterText span={8}/>
        </>);
    }

    return (
        <>
            <PageTopTitleAndAction usingCustom={true} mainTitle={t('titlePage')}>
                <TopAction topActions={topActions}/>
            </PageTopTitleAndAction>
            <OrdCrudPage stored={mainStore}
                         hiddenTopAction={true}
                         columns={columns}
                         searchForm={(f) => <SearchFilter/>}
            ></OrdCrudPage>
        </>)
        ;
}
export default observer(Notification);


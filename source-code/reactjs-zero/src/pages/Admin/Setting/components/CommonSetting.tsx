import React from 'react';
import {Card, Input, Select, Typography} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import {SearchFilterAndIsActived} from "@ord-components/forms/search/SearchFilterAndIsActived";
import TableUtil from "@ord-core/utils/table.util";
import {ColumnBuilder} from "@ord-components/paged-table/columns";
import {RolePagedDto} from "@api/base/index.defs";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {useCommonSettingLogic} from "@pages/Admin/Setting/hook/useCommonSettingLogic";
import {PagedTable} from "@ord-components/paged-table";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {useTranslation} from 'react-i18next';

const {Title, Text} = Typography;

export const CommonSetting = () => {
    const [t] = useTranslation('setting-list');
    const {
        topActions,
        tableStore,
        tableActions
    } = useCommonSettingLogic();
    const columnBuilder = new ColumnBuilder<RolePagedDto>();
    columnBuilder.addText({
        title: 'setting_name',
        dataIndex: 'name',
        width: 200,
        copyable: true,
        render: (v, data) => {
            data.display_name = t(v.replace(/:/g, '.'));
            return data.display_name;
        }
    }).addText({
        title: 'setting_value',
        dataIndex: 'value',
        width: 200,
        copyable: true,
    }).addCustom(IsActivedColumn());
    const columns = TableUtil.getColumns(
        [...columnBuilder.build()],
        {
            actions: tableActions
        });
    return <Card>
        <PageLayoutWithTable
            titleHeader={<Title level={4}>
                <SettingOutlined style={{marginRight: 8}}/>
                <span>Cấu hình hệ thống chung</span>
            </Title>}
            topActions={topActions}
            searchFields={<SearchFilterAndIsActived/>}
            tableStore={tableStore}>
            <PagedTable columns={columns} tableStore={tableStore}/>
        </PageLayoutWithTable>
    </Card>
}
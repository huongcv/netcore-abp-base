import React from 'react';
import {Card, Input, Select, Typography} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import {TitleAndAction} from "@ord-components/common/page/TitleAndAction";
import AddNewEntity from "@ord-components/crud/btn-action/AddNewEntity";
import {SearchablePagedTable} from "@ord-components/paged-table/components/SearchablePagedTable";
import {SearchFilterAndIsActived} from "@ord-components/forms/search/SearchFilterAndIsActived";
import TableUtil from "@ord-core/utils/table.util";
import {ColumnBuilder} from "@ord-components/paged-table/columns";
import {RolePagedDto} from "@api/base/index.defs";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {HostSystemSettingService} from "@api/base/HostSystemSettingService";
import {useCommonSettingLogic} from "@pages/Admin/Setting/hook/useCommonSettingLogic";
import {TenantSearchForm} from "@pages/Admin/Tenants/SearchForm";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {TenantService} from "@api/base/TenantService";
import {PagedTable} from "@ord-components/paged-table";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";

const {Title, Text} = Typography;
const {Option} = Select;
const {TextArea} = Input;
export const CommonSetting = () => {
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
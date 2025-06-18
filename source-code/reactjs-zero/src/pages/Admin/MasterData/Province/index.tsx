import React from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Checkbox, Form, FormInstance, Input, TableColumnsType} from "antd";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TableUtil from "@ord-core/utils/table.util";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {SearchFilterAndIsActived} from "@ord-components/forms/search/SearchFilterAndIsActived";

export const CreateOrUpdateForm = (props: {
    form: FormInstance
}) => {
    const {t} = useTranslation('province');
    const {t:tCommon} = useTranslation('common');

    return (<>
        <Form.Item label={t('ma')} name='ma' rules={[ValidateUtils.required]}>
            <Input maxLength={10}/>
        </Form.Item>
        <Form.Item label={t('ten')} name='ten' rules={[ValidateUtils.required]}>
            <Input maxLength={100}/>
        </Form.Item>
        <Form.Item name='isActived' valuePropName="checked">
            <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
        </Form.Item>
    </>)
}

const Province: React.FC = () => {
    const {useHostListStore: mainStore} = useStore();
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'ma',
            dataIndex: 'ma',
            width: 200,
            sorter: true
        },
        {
            dataIndex: 'ten',
            title: 'ten',
        },
        IsActivedColumn()
    ], {
        actions: [
            {
                title: 'view',
                onClick: (d) => {
                    mainStore.openViewDetailModal(d);
                }
            },
            {
                title: 'edit',
                onClick: (d) => {
                    mainStore.openUpdateModal(d);
                }
            },
            {
                title: 'remove',
                onClick: (d) => {
                    mainStore.openRemoveById(d);
                }
            }
        ],
        ns: mainStore.getNamespaceLocale()
    });
    const topActions: IActionBtn[] = [
        {
            title: 'exportExcel',
            permission: 'MasterData.Tinh',
            onClick: () => {
                mainStore.exportExcelPagedResult().then();
            }
        },
        {
            title: 'addNew',
            permission: 'MasterData.Tinh.Create',
            onClick: () => {
                mainStore.openCreateModal();
            }
        }
    ];
    return (
        <>
            <OrdCrudPage stored={mainStore}
                         topActions={topActions}
                         columns={columns}
                         searchForm={(f) => <SearchFilterAndIsActived/>}
                         entityForm={form => <CreateOrUpdateForm form={form}/>}
            ></OrdCrudPage>
        </>)
        ;
}
export default (Province);


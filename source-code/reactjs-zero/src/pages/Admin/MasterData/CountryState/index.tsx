import React from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Form, FormInstance, Input, TableColumnsType} from "antd";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TableUtil from "@ord-core/utils/table.util";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectCountry} from "@ord-components/forms/select/selectDataSource/useSelectCountry";

export const CreateOrUpdateForm = (props: {
    form: FormInstance
}) => {
    const {t} = useTranslation('country-state');

    return (<>
        <Form.Item label={t('countrySelect')} name='countryId' rules={[ValidateUtils.required]}>
            <OrdSelect datasource={useSelectCountry()}/>
        </Form.Item>
        <Form.Item label={t('ma')} name='stateCode' rules={[ValidateUtils.required]}>
            <Input maxLength={50}/>
        </Form.Item>
        <Form.Item label={t('ten')} name='stateName' rules={[ValidateUtils.required]}>
            <Input maxLength={200}/>
        </Form.Item>
        <Form.Item label={t('stateLevel')} name='stateLevel' rules={[ValidateUtils.required]}>
            <Input maxLength={100}/>
        </Form.Item>
        <div className="inline-block w-full mb-4"></div>
    </>)
}

const CountryState: React.FC = () => {
    const {countryStateStore: mainStore} = useStore();
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'ma',
            dataIndex: 'stateCode',
            width: 200,
            sorter: true
        },
        {
            dataIndex: 'stateName',
            title: 'ten',
        },
        {
            dataIndex: 'countryId',
            title: 'countryId',
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
                         searchForm={(f) => <SearchFilterText/>}
                         entityForm={form => <CreateOrUpdateForm form={form}/>}
            ></OrdCrudPage>
        </>)
        ;
}
export default (CountryState);


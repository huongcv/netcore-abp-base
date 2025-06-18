import React from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Form, FormInstance, Input, TableColumnsType} from "antd";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TableUtil from "@ord-core/utils/table.util";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectState} from "@ord-components/forms/select/selectDataSource/useSelectState";
import {CountryStateDto} from "@api/index.defs";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";

export const CreateOrUpdateForm = (props: {
    form: FormInstance
}) => {
    const {t} = useTranslation('district');

    const setSate = (code: string, data: any) => {
        if (data) {
            const d: CountryStateDto = data.data;
            props.form.setFieldsValue({
                stateName: d.stateName,
                stateId: d.id,
            });
        } else {
            props.form.setFieldsValue({
                stateName: '',
                stateId: '',
            });
        }

    }
    return (<>
        <Form.Item label={t('stateSelect')} name='stateCode' rules={[ValidateUtils.required]}>
            <OrdSelect onChange={setSate} datasource={useSelectState()}/>
        </Form.Item>
        <Form.Item label={t('ma')} name='districtCode' rules={[ValidateUtils.required]}>
            <Input maxLength={10}/>
        </Form.Item>
        <Form.Item label={t('ten')} name='districtName' rules={[ValidateUtils.required]}>
            <Input maxLength={100}/>
        </Form.Item>
        <Form.Item label={t('districtLevel')} name='districtLevel'>
            <Input maxLength={20}/>
        </Form.Item>
        <Form.Item name='stateName' hidden>
            <Input/>
        </Form.Item>
        <Form.Item name='stateId' hidden>
            <Input/>
        </Form.Item>
        <div className="mb-4 inline-block w-full"></div>
    </>)
}

const District: React.FC = () => {
    const {districtStore: mainStore} = useStore();

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'ma',
            dataIndex: 'districtCode',
            width: 200,
            sorter: true
        },
        {
            dataIndex: 'districtName',
            title: 'ten',
        },
        {
            dataIndex: 'stateName',
            title: 'state',
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
export default (District);


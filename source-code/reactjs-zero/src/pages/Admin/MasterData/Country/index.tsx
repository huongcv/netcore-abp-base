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
    const {t} = useTranslation('country');
    const {t:tCommon} = useTranslation('common');

    return (<>
        <Form.Item label={t('ma')} name='code' rules={[ValidateUtils.required]}>
            <Input maxLength={10}/>
        </Form.Item>
        <Form.Item label={t('ten')} name='name' rules={[ValidateUtils.required]}>
            <Input maxLength={100}/>
        </Form.Item>
        <div className="flex gap-4">
            <Form.Item className="w-6/12" label={t('phoneCode')} name='phoneCode'>
                <Input maxLength={50}/>
            </Form.Item>
            <Form.Item className="w-6/12" label={t('currencyCode')} name='currencyCode'>
                <Input maxLength={50} type="tel"/>
            </Form.Item>
        </div>
        <Form.Item name='isActived' valuePropName="checked">
            <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
        </Form.Item>
    </>)
}

const Country: React.FC = () => {
    const {countryStore: mainStore} = useStore();
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'ma',
            dataIndex: 'code',
            width: 200,
            sorter: true
        },
        {
            dataIndex: 'name',
            title: 'ten',
        },
        {
            dataIndex: 'phoneCode',
            title: 'phoneCode',
        },
        {
            dataIndex: 'currencyCode',
            title: 'currencyCode',
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
export default (Country);


import React from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Form, FormInstance, Input, TableColumnsType} from "antd";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TableUtil from "@ord-core/utils/table.util";
import {useSelectState} from "@ord-components/forms/select/selectDataSource/useSelectState";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectDistrict} from "@ord-components/forms/select/selectDataSource/useSelectDistrict";
import {CountryStateDto, DistrictDto} from "@api/index.defs";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";

export const CreateOrUpdateForm = (props: {
    form: FormInstance
}) => {
    const {t} = useTranslation('ward');
    const setState = (code: string, data: any) => {
        props.form.setFieldValue("districtCode", null)
        if(data) {
            const d: CountryStateDto = data.data;
            props.form.setFieldsValue({
                stateId: d.id,
                stateName: d.stateName,
            })
        } else {
            props.form.setFieldsValue({
                stateId: "",
                stateName: "",
            })
        }

    }
    const setDistrict = (code: string, data: any) => {
        if(data) {
            const d: DistrictDto = data.data;
            props.form.setFieldsValue({
                districtId: d.id,
                districtName: d.districtName,
            })
        } else {
            props.form.setFieldsValue({
                districtId: "",
                districtName: "",
            })
        }
    }

    return (<div className="mb-[30px]">
        <div className="flex gap-4">
            <Form.Item className="w-4/12" label={t('state')} name='stateCode' rules={[ValidateUtils.required]}>
                <OrdSelect onChange={setState} datasource={useSelectState()}/>
            </Form.Item>
            <Form.Item className="w-8/12" label={t('district')} name='districtCode' rules={[ValidateUtils.required]}>
                <OrdSelect onChange={setDistrict}
                           datasource={useSelectDistrict(Form.useWatch("stateCode", props.form))}/>
            </Form.Item>
        </div>
        <div className="flex gap-4">
            <Form.Item className="w-4/12" label={t('ma')} name='wardCode' rules={[ValidateUtils.required]}>
                <Input maxLength={50}/>
            </Form.Item>
            <Form.Item className="w-8/12" label={t('ten')} name='wardName' rules={[ValidateUtils.required]}>
                <Input maxLength={100}/>
            </Form.Item>
        </div>
        <div className="flex gap-4">
            <Form.Item className="w-4/12" label={t('wardLevel')} name='wardLevel'>
                <Input maxLength={20}/>
            </Form.Item>
            <Form.Item className="w-8/12" label={t('acronyms')} name='acronyms'>
                <Input maxLength={50}/>
            </Form.Item>
        </div>
        <Form.Item label={t('areaFullName')} name='areaFullName'>
            <Input maxLength={200}/>
        </Form.Item>
        <Form.Item label={t('areaShortName')} name='areaShortName'>
            <Input maxLength={200}/>
        </Form.Item>
        <Form.Item name='districtId' hidden>
            <Input />
        </Form.Item>
        <Form.Item name='districtName' hidden>
            <Input />
        </Form.Item>
        <Form.Item name='stateId' hidden>
            <Input />
        </Form.Item>
        <Form.Item name='stateName' hidden>
            <Input />
        </Form.Item>
    </div>)
}

const Ward: React.FC = () => {
    const {wardStore: mainStore} = useStore();
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'ma',
            dataIndex: 'wardCode',
            width: 200,
            sorter: true
        },
        {
            dataIndex: 'wardName',
            title: 'ten',
        },
        {
            dataIndex: 'districtName',
            title: 'district',
        },
        {
            dataIndex: 'stateName',
            title: 'state',
        },
        {
            dataIndex: 'acronyms',
            title: 'acronyms',
        },
        {
            dataIndex: 'areaFullName',
            title: 'areaFullName',
        }
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
export default (Ward);


import {Checkbox, Col, Form, FormInstance, Input, InputNumber, Row, TableColumnsType} from "antd";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import React from "react";
import {useStore} from "@ord-store/index";
import TableUtil from "@ord-core/utils/table.util";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {SearchFilterAndIsActived} from "@ord-components/forms/search/SearchFilterAndIsActived";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {useSelectPackageType} from "@ord-components/forms/select/selectDataSource/useSelectPackageType";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectTimeUnit} from "@ord-components/forms/select/selectDataSource/useSelectTimeUnit";
import {NumericFormat} from "react-number-format";

export const CreateOrUpdateForm = (props: {
    form: FormInstance
}) => {
    const {t} = useTranslation('package');
    const {t:tCommon} = useTranslation('common');
    const form = props.form;

    const priceChange = (value: any) => {
        form.setFieldValue('totalAmount', value - (form.getFieldValue('discountAmount')??0))
    }

    const discountChange = (value: any) => {
        form.setFieldValue('totalAmount', (form.getFieldValue('price')??0) - value)
    }

    const chargeTimeChange = (value: any) => {
        form.setFieldValue('totalTime', value + (form.getFieldValue('freeTime')??0))
    }

    const freeTimeChange = (value: any) => {
        form.setFieldValue('totalTime', (form.getFieldValue('chargeTime')??0) + value)
    }

    return (<>
        <Row gutter={12}>
            <Col span={8}>
                <FloatLabel label={t('packageCode')} required>
                    <Form.Item name='packageRegistrationCode' rules={[ValidateUtils.required]}>
                        <Input maxLength={10}/>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('packageName')} required>
                    <Form.Item name='packageRegistrationName' rules={[ValidateUtils.required]}>
                        <Input maxLength={200}/>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('packageType')} required>
                    <Form.Item name='packageRegistrationType' rules={[ValidateUtils.required]}>
                        <OrdSelect datasource={useSelectPackageType()}
                                   placeholder={tCommon('')}></OrdSelect>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('price')} required>
                    <Form.Item name='price' rules={[ValidateUtils.required]}>
                        <PriceNumberInput onChange={priceChange}
                                          defaultValue={0}
                                          step={1000} min={0}
                                          style={{width: '100%'}}
                        />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('discountAmount')}>
                    <Form.Item name='discountAmount'>
                        <PriceNumberInput onChange={discountChange}
                                          step={1000} min={0}
                                          defaultValue={0}
                        />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('totalAmount')}>
                    <Form.Item name='totalAmount'>
                        <PriceNumberInput step={1000} min={0} disabled/>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('chargeTime')}>
                    <Form.Item name='chargeTime'>
                        <InputNumber defaultValue={0}
                                     onChange={chargeTimeChange}
                                     maxLength={20}
                                     style={{width: '100%'}}
                        />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('freeTime')}>
                    <Form.Item name='freeTime'>
                        <InputNumber  defaultValue={0}
                                      onChange={freeTimeChange}
                                      maxLength={50}
                                      style={{width: '100%'}}
                        />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('totalTime')}>
                    <Form.Item name='totalTime'>
                        <InputNumber maxLength={50} style={{width: '100%'}} disabled/>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('timeUnit')}>
                    <Form.Item name='timeUnit'>
                        <OrdSelect datasource={useSelectTimeUnit()}
                                   placeholder={tCommon('')}></OrdSelect>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('packageAccountNumber')}>
                    <Form.Item name='packageAccountNumber'>
                        <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('packageShopNumber')}>
                    <Form.Item name='packageShopNumber'>
                        <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={24}>
                <FloatLabel label={t('notes')}>
                    <Form.Item name='notes'>
                        <Input/>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Form.Item name='isActived' valuePropName="checked">
                <Checkbox defaultChecked>{tCommon('dang_hoat_dong')}</Checkbox>
            </Form.Item>
        </Row>
    </>)
}

const Package: React.FC = () => {
    const {packageStore: mainStore} = useStore();
    const selectPackageType = useSelectPackageType();
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'packageCode',
            dataIndex: 'packageRegistrationCode',
            width: 200,
            sorter: true
        },
        {
            dataIndex: 'packageRegistrationName',
            title: 'packageName',
            width: 250,
        },
        {
            dataIndex: 'packageRegistrationType',
            title: 'packageType',
            width: 200,
            render: value => {
                return <DisplayTextFormSelectDataSource
                    datasource={selectPackageType}
                    value={value}/>
            }
        },
        {
            dataIndex: 'price',
            title: 'price',
            width: 150,
            render: value => {
                return <>
                    <p><NumericFormat value={value} displayType={'text'} thousandSeparator={true}/> đ</p>
                </>
            }
        },
        {
            dataIndex: 'packageAccountNumber',
            title: 'packageAccountNumber',
            width: 150,
        },
        {
            dataIndex: 'notes',
            title: 'notes',
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
            permission: 'MasterData.Package',
            onClick: () => {
                mainStore.exportExcelPagedResult().then();
            }
        },
        {
            title: 'addNew',
            permission: 'MasterData.Package.Create',
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
        </>);
}
export default (Package);

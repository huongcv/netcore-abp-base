import { Checkbox, Col, Form, FormInstance, Input, InputNumber, Row, Space, TableColumnsType } from "antd";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import React, { useEffect } from "react";
import { useStore } from "@ord-store/index";
import TableUtil from "@ord-core/utils/table.util";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterAndIsActived } from "@ord-components/forms/search/SearchFilterAndIsActived";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useSelectPackageType } from "@ord-components/forms/select/selectDataSource/useSelectPackageType";
import { NumericFormat } from "react-number-format";
import TextArea from "antd/lib/input/TextArea";
import AllowanceStore from "@ord-store/Payroll/Allowance/AllowanceStore";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectAllowanceType } from "@ord-components/forms/select/selectDataSource/useSelectAllowanceType";
import { useSelectPartnerType } from "@ord-components/forms/select/selectDataSource/useSelectPartnerType";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import uiUtils from "@ord-core/utils/ui.utils";
import { AllowanceService } from "@api/AllowanceService";
import { AllowanceDto } from "@api/index.defs";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";

export const CreateOrUpdateForm = (props: {
    form: FormInstance
}) => {
    const { t } = useTranslation('allowance');
    const { t: tCommon } = useTranslation('common');
    const form = props.form;
    const { AllowanceStore: mainStore } = useStore();

    const focusRef = useAutoFocus();

    return (<>
        <Row gutter={12}>
            <Col span={10}>
                <FloatLabel label={t('code')}>
                    <Form.Item name='code'>
                        <Input maxLength={10} ref={focusRef} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={14}>
                <FloatLabel>
                    <Space>
                        <Form.Item name="isActived" valuePropName="checked" initialValue={true} noStyle>
                            <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
                        </Form.Item>
                        <Form.Item name="isTaxable" valuePropName="checked" initialValue={true} noStyle>
                            <Checkbox>{tCommon('isTaxable')}</Checkbox>
                        </Form.Item>
                        <Form.Item name="isInsurance" valuePropName="checked" initialValue={true} noStyle>
                            <Checkbox>{tCommon('isInsurance')}</Checkbox>
                        </Form.Item>
                    </Space>
                </FloatLabel>
            </Col>

            <Col span={24}>
                <FloatLabel label={t('name')} required>
                    <Form.Item name='name' rules={[ValidateUtils.required]}>
                        <Input maxLength={200} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={12}>
                <FloatLabel label={t('amount')} required>
                    <Form.Item name='amount' rules={[ValidateUtils.required]}>
                        <PriceNumberInput className="w-full" step={1000} min={0} />

                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={12}>
                <FloatLabel label={t('type')}>
                    <Form.Item name='type' >
                        <OrdSelect datasource={useSelectAllowanceType()} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={24}>
                <FloatLabel label={t('notes')} >
                    <Form.Item name='notes' >
                        <TextArea disabled={mainStore.createOrUpdateModal.mode == "viewDetail"} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Form.Item name='id' valuePropName="checked" hidden={true}>
                <input />
            </Form.Item>

        </Row>
    </>)
}

const Allowance: React.FC = () => {
    const { AllowanceStore: mainStore } = useStore();
    const { t } = useTranslation('allowance');

    const handleChangeIsActive = async (
        id: number,
        isActived: boolean
    ) => {
        try {
            uiUtils.setBusy();
            if (id == 0 || isActived == null || isActived == undefined) return;
            const update = await AllowanceService.changeWorkAllowanceStatus({
                allowanceId: id,
                isActived: isActived,
            });
            if (update.isSuccessful) {
                uiUtils.showSuccess(t(`updateIsActiveSuccessfully`));
                mainStore.refreshGridData(true);
            } else {
                uiUtils.showError(update.message || t(`updateIsActiveFaild`));
            }
        } catch (err: any) {
            uiUtils.showError(t(`updateIsActiveFaildErr500`) + err?.Message);
        } finally {
            uiUtils.clearBusy();
        }
    };
    const SelectAllowanceType = useSelectAllowanceType();
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: t('code'),
            dataIndex: 'code',
            width: 100,
        },
        {
            dataIndex: 'name',
            title: t('name'),
            width: 200,
        },
        {
            dataIndex: 'amount',
            title: t('amount'),
            width: 150,
            render: value => {
                return <>
                    <p><NumericFormat value={value} displayType={'text'} thousandSeparator={true} /></p>
                </>
            }
        },
        {
            dataIndex: 'type',
            title: t('type'),
            width: 300,
            render: value => {
                return <DisplayTextFormSelectDataSource
                    datasource={SelectAllowanceType}
                    value={value} />
            }
        },
        {
            dataIndex: 'notes',
            title: t('notes'),
        },
        IsActivedColumn()
    ], {
        actions: [
            {
                title: "",
                content: (d: AllowanceDto) => {
                    return d.isActived ? (
                        <div
                            onClick={() => {
                                handleChangeIsActive(Number(d.id), false);
                            }}
                        >
                            <StopOutlined />{" "}
                            <span className="ml-1">{t("changeIsActive.unActive")}</span>
                        </div>
                    ) : (
                        <div
                            onClick={() => {
                                handleChangeIsActive(Number(d.id), true);
                            }}
                        >
                            <CheckCircleOutlined />{" "}
                            <span className="ml-1">{t("changeIsActive.active")}</span>
                        </div>
                    );
                },
            },
            {
                title: 'remove',
                permission: PERMISSION_APP.human.allowance + '.Remove',
                onClick: (d) => {
                    mainStore.openRemoveById(d);
                }
            }
        ],
        viewAction: (d) => {
            mainStore.openUpdateModal(d);
        },
        viewActionPermission: PERMISSION_APP.human.allowance + '.Update',
        ns: mainStore.getNamespaceLocale()
    });
    const topActions: IActionBtn[] = [
        {
            title: 'exportExcel',
            // permission: 'MasterData.Package',
            onClick: () => {
                mainStore.exportExcelPagedResult().then();
            }
        },
        {
            title: 'addNew',
            permission: PERMISSION_APP.human.allowance + '.Create',
            onClick: () => {
                mainStore.openCreateModal();
            }
        }
    ];
    return (
        <>
            <OrdCrudPage stored={mainStore}
                contentTopTable={
                    <IsActiveStatusCounter getCountApi={AllowanceService.getCount} />
                }
                topActions={topActions}
                columns={columns}
                searchForm={(f) => <SearchFilterAndIsActived />}
                entityForm={form => <CreateOrUpdateForm form={form} />}
            ></OrdCrudPage>
        </>);
}
export default (Allowance);

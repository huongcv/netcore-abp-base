import React, {useEffect, useState} from 'react';
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Card, Col, DatePicker, Form, Input, Row, Space, TableProps} from "antd";
import DateUtil from "@ord-core/utils/date.util";
import {ArrowLeftOutlined, ExportOutlined, RedoOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {observer} from "mobx-react-lite";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useNavigate, useParams} from "react-router-dom";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import DateCell from "@ord-components/table/cells/DateCell";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {
    PharmacyLogReportPrescriptionDrugSalesFlatDto
} from "@ord-store/Report/PharmacyLogPrescriptionDrugSalesReportStore";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import GridProductItems from "@pages/Report/PharmacyLog/QualityInspection/GridProductItems";
import UiUtils from "@ord-core/utils/ui.utils";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {sourceTimeType} from './ReportPharmacyLogQualityInspection';
import dayjs, {Dayjs} from "dayjs";
import OrdMonthInput from "@ord-components/forms/OrdMonthInput";

function CruQualityInspectionReport() {

    const {reportPharmacyLogQualityInspectionReportStore: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const {hashId, timeType, executionTime, readonly} = useParams();
    const [formCru] = Form.useForm()
    useEffect(() => {
        if (stored) {
            if (hashId) {
                stored.getByHashId(hashId)
                    .then(res => {
                        if (res.isSuccessful && res.data)
                            formCru.setFieldsValue(res.data)
                    })
            } else {
                const time = dayjs(executionTime, "DD-MM-YYYY");
                const t = timeType ? parseInt(timeType) : 1;
                const name = t == 1 ? ("Sổ kiểm soát định kỳ chất lượng thuốc ngày " + time.format("DD/MM/YYYY"))
                    : ("Sổ kiểm soát định kỳ chất lượng thuốc tháng " + time.format("MM/YYYY"));
                formCru.setFieldsValue({
                    timeType: t,
                    executionTime: time.toDate(),
                    reportName: name
                })
            }
        }
    }, [hashId]);
    const navigate = useNavigate();
    const onSave = async () => {
        try {
            const data = await formCru.validateFields();
            UiUtils.setBusy();
            try {
                console.log("data", data)
                const isCreate = !hashId;
                const apiCru = isCreate ?
                    stored.createEntity({
                        ...data,
                    }) : stored.updateEntity({
                        ...data,
                    });
                UiUtils.clearBusy();
                await apiCru.then(result => {
                    if (result) {
                        UiUtils.showSuccess(t(isCreate ? 'addNewSuccess' : 'updateSuccess', {
                            ...data
                        }) as any);
                        navigate(-1);
                    }
                })
            } catch (e) {

            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }

    const topAction: IActionBtn[] = [
        {
            content: <>
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined/>
                    </Space>
                    {t('actionBtn.back')}
                </Button>
            </>
        },
        {
            permission: readonly ? "zzHiHIzz" : "",
            content: <Button type='primary' onClick={onSave}>
                <Space>
                    <SaveOutlined/>
                </Space>
                {t('actionBtn.save')}
            </Button>
        },
    ]

    const w_timeType = Form.useWatch('timeType', formCru)
    return (
        <>
            <PageTopTitleAndAction usingCustom={true}
                                   mainTitle={hashId ? (readonly ? t('pageTitleView') : t('pageTitleUpdate')) : t('pageTitleCreate')}
                                   items={[t('titlePageLvl1'), t('titlePageLvl2'), t('titlePage')]}>
                <TopAction topActions={topAction}/>
            </PageTopTitleAndAction>
            <Form className={'ord-container-box'} form={formCru} layout={"vertical"}
                  disabled={!!readonly}
                  onFinish={debounce((d) => {
                      stored.searchData(d);
                  }, 250)}>
                <Form.Item name='id' hidden noStyle>
                    <Input></Input>
                </Form.Item>
                <Row gutter={16}>
                    <Col {...useResponsiveSpan(6)}>
                        <FloatLabel label={t('timeType')} required>
                            <Form.Item name='timeType' rules={[ValidateUtils.required]}>
                                <OrdSelect datasource={sourceTimeType()} disabled></OrdSelect>
                            </Form.Item>
                        </FloatLabel>

                    </Col>
                    <Col {...useResponsiveSpan(6)}>
                        <FloatLabel label={t('executionTime')} required>
                            <Form.Item name='executionTime' rules={[ValidateUtils.required]}>
                                {w_timeType == 1 ? <OrdDateInput disabled></OrdDateInput> : <OrdMonthInput
                                    disabled
                                    format={{
                                        format: 'MM/YYYY',
                                        type: 'mask',
                                    }}
                                ></OrdMonthInput>}
                            </Form.Item>
                        </FloatLabel>

                    </Col>
                    <Col {...useResponsiveSpan(12)}>
                        <FloatLabel label={t('reportName')}>
                            <Form.Item name='reportName' className='flex-auto'>
                                <Input disabled placeholder={t("reportName")}></Input>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(12)}>
                        <FloatLabel label={t('note')}>
                            <Form.Item name='note' className='flex-auto'>
                                <Input.TextArea
                                    rows={1} placeholder={t("note")}></Input.TextArea>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(12)}>
                        <FloatLabel label={t('reason')}>
                            <Form.Item name='reason' className='flex-auto'>
                                <Input.TextArea
                                    rows={1} placeholder={t("reason")}></Input.TextArea>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
            </Form>
            <Card title={t('addProductToStick')}>
                {readonly ? <GridProductItems form={formCru} disable={true}></GridProductItems>
                    : <GridProductItems form={formCru} disable={false}></GridProductItems>
                }


            </Card>
        </>
    );

}

export default observer(CruQualityInspectionReport);




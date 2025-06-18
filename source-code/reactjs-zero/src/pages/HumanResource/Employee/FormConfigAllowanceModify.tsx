import { AllowanceService } from "@api/AllowanceService";
import { AllowanceDto } from "@api/index.defs";
import { DecimalNumberInput } from "@ord-components/forms/DecimalNumberInput";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectWorkCalendar } from "@ord-components/forms/select/selectDataSource/useSelectWorkCalendar";
import { useStore } from "@ord-store/index";
import { Col, Form, FormInstance, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfigAllowanceTable } from "./ConfigAllowanceTable";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { ShopWorkCalendarService } from "@api/ShopWorkCalendarService";
import Utils from "@ord-core/utils/utils";

export const FormConfigAllowanceModify = (props: {
    form: FormInstance,
}) => {
    const { t } = useTranslation('allowance');
    const { employeeStore: mainStore } = useStore();

    const [allowanceDatasource, setAllowanceDatasource] = useState<SelectDataSource>();
    const { form } = props;



    useEffect(() => {
        getAllowanceDatasource();
    }, []);

    const getAllowanceDatasource = async () => {
        const result = await ShopWorkCalendarService.getComboOptions({});
        setAllowanceDatasource({ data: Utils.mapCommonSelectOption(result), isPending: false });
    };

    return (<>
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <FloatLabel label={t('workCalendar')} >
                    <Form.Item name='workCalendarId' >
                        <OrdSelect datasource={allowanceDatasource || { data: [], isPending: false }} placeholder={t('')} allowClear></OrdSelect>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={12}>
                <FloatLabel label={t('salaryAmount')}>
                    <Form.Item name='salaryAmount'>
                        <DecimalNumberInput min={0} integerLimit={20} decimalLimit={5} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={12}>
                <FloatLabel label={t('numberOfDependentPerson')}>
                    <Form.Item name='NumberOfDependentPerson'>
                        <DecimalNumberInput min={0} integerLimit={20} decimalLimit={5} />
                    </Form.Item>
                </FloatLabel>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <ConfigAllowanceTable form={form}></ConfigAllowanceTable>
            </Col>
        </Row>
    </>)
}

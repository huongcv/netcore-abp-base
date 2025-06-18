import {Form, FormInstance, Input} from "antd";
import {useTranslation} from "react-i18next";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectEmployee} from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import * as React from "react";
import {useEffect} from "react";

export const CreateOrUpdateForm = (props: {
    form: FormInstance
}) => {
    const {t} = useTranslation('work-shift');
    useEffect(() => {
        // props.form.setFieldValue('startDate', new Date())
    }, []);
    return (<>
        <FloatLabel label={t('openingCash')} required>
            <Form.Item name='openingCash' rules={[ValidateUtils.required]}>
                <PriceNumberInput step={1000} min={0}/>
            </Form.Item>
        </FloatLabel>
        <FloatLabel label={"Nhận từ"}>
            <Form.Item name='openingEmployeeId'>
                <OrdSelect datasource={useSelectEmployee()}></OrdSelect>
            </Form.Item>
        </FloatLabel>

        <FloatLabel label={"Người nhận"} required>
            <Form.Item name='closingEmployeeId' rules={[ValidateUtils.required]}>
                <OrdSelect datasource={useSelectEmployee()}></OrdSelect>
            </Form.Item>
        </FloatLabel>

        {/*<FloatLabel label={t('ten')} required>*/}
        {/*    <Form.Item name='name' rules={[ValidateUtils.required]}>*/}
        {/*        <Input maxLength={100}/>*/}
        {/*    </Form.Item>*/}
        {/*</FloatLabel>*/}

        <FloatLabel label={t('startDate')}>
            <Form.Item name='startDate'>
                <OrdDateInput showTime format="DD/MM/YYYY HH:mm"></OrdDateInput>
            </Form.Item>
        </FloatLabel>
    </>)
}

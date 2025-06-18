import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import DateUtil from "@ord-core/utils/date.util";
import { Form } from "antd";
import { useWatch } from "antd/es/form/Form";
import { useTranslation } from "react-i18next";

export const NationalPharmacySearch = (props: {
    isAlowDateRange?: boolean
}) => {

    const form = Form.useFormInstance();
    const nationalPharmacyType_w = useWatch('nationalPharmacyType', form); 
    const {t} = useTranslation('integration');
    return (
        <>
            {props.isAlowDateRange && <ColSpanResponsive span={8}>
                <Form.Item name='rangeDate' initialValue={DateUtil.getDateRange('thang_nay')}>
                    <OrdDateRangeInput allowEq labelMode={'fromToLabel'} />
                </Form.Item>
            </ColSpanResponsive>}
            <SearchFilterText span={10} 
                placeHolder={nationalPharmacyType_w == 0 ? t('drugNationalPlaceholder') : t('ticketNationalPlaceholder')} 
                onReset={() => {
                    form.resetFields();
                    form.submit();
                }} />
            <div hidden>
                <Form.Item name={'onSearchBeginning'} initialValue={0} noStyle />
                <Form.Item name='nationalPharmacyType' />
            </div>
        </>
    )
}

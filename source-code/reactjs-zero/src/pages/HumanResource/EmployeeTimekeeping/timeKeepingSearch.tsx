import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import React, {useEffect, useState} from "react";
import {DatePicker, Form, FormInstance, Input} from "antd";
import {useTranslation} from "react-i18next";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {useStore} from "@ord-store/index";
import {useDebounce} from "use-debounce";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import DateUtil from "@ord-core/utils/date.util";
import OrdYearInput from "@ord-components/forms/OrdYearInput";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import dayjs from "dayjs";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectHrEmployee} from "@ord-components/forms/select/selectDataSource/useSelectHrEmployee";
import {useSelectTimekeepingStatus} from "@ord-components/forms/select/selectDataSource/useSelectTimekeepingStatus";

export const TimeKeepingSearch = (props: {
    formSearch: FormInstance
}) => {
    const {t} = useTranslation('employeeTimekeeping');
    const [statusChange, setStatusChange] = useState(0);
    const [debouncedStatus] = useDebounce(statusChange, 300);

    useEffect(() => {
        props.formSearch.setFieldValue('workDate',dayjs(new Date()));
    }, []);

    useEffect(() => {
        if (debouncedStatus > 0) {
            props.formSearch.submit();
        }
    }, [debouncedStatus]);

    return (
        <>
            <ColSpanResponsive span={8}>
                    <Form.Item name='dateRange' initialValue={DateUtil.getDateRange('thang_nay')}>
                        <OrdDateRangeInput allowEq labelMode={'fromToLabel'}/>
                    </Form.Item>
            </ColSpanResponsive>
            {/* <ColSpanResponsive span={4}>
                <FloatLabel label={t('employeeId')}>
                    <Form.Item name='employeeId' >
                      <OrdSelect datasource={useSelectHrEmployee()} allowClear={true}/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive> */}
            {/*<ColSpanResponsive span={4}>*/}
            {/*    <FloatLabel label={t('status')}>*/}
            {/*        <Form.Item name='status' >*/}
            {/*            <OrdSelect allowClear={true} datasource={useSelectTimekeepingStatus()}/>*/}
            {/*        </Form.Item>*/}
            {/*    </FloatLabel>*/}
            {/*</ColSpanResponsive>*/}
            <SearchFilterText span={12}/>
        </>
    )
}

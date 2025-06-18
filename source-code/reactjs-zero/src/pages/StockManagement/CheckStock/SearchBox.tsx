import {Form} from "antd";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import React from "react";
import {useTranslation} from "react-i18next";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import DateUtil from "@ord-core/utils/date.util";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";

const CheckStockSearchBox = () => {
    const [t] = useTranslation('stock');
    const initRange = DateUtil.getDateRange('thang_nay');
    const form = Form.useFormInstance();


    return (<>
        <ColSpanResponsive span={8}>
            <Form.Item name='moveDateRange' initialValue={initRange}>
                <OrdDateRangeInput allowEq labelMode={'fromToLabel'}/>
            </Form.Item>
        </ColSpanResponsive>
        <SearchFilterText span={16}/>
        {/*<Col {...useResponsiveSpan(5)}>*/}
        {/*    <FloatLabel label={t('stockInventoryFilter')}>*/}
        {/*        <Form.Item name='inventoryId'>*/}
        {/*            <OrdSelect datasource={useSelectStock()} allowClear></OrdSelect>*/}
        {/*        </Form.Item>*/}
        {/*    </FloatLabel>*/}
        {/*</Col>*/}
        {/*<SearchFilterText/>*/}
        <div hidden>
            <Form.Item name='moveType' noStyle></Form.Item>
        </div>
    </>);
}
export default CheckStockSearchBox;

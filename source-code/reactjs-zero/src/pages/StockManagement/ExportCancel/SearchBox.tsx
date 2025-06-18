import {Form} from "antd";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import React from "react";
import {useTranslation} from "react-i18next";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import DateUtil from "@ord-core/utils/date.util";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";

const ExportCancelSearchBox = () => {
    const [t] = useTranslation("stock");
    const initRange = DateUtil.getDateRange("thang_nay");
    const form = Form.useFormInstance();

    return (
        <>
            <ColSpanResponsive span={8}>
                <Form.Item name="moveDateRange" initialValue={initRange}>
                    <OrdDateRangeInput allowEq labelMode={"fromToLabel"}/>
                </Form.Item>
            </ColSpanResponsive>
            <SearchFilterText span={16}/>

            <div hidden>
                <Form.Item name="moveType" initialValue={MoveType.PhieuXuatHuy}/>
            </div>
        </>
    );
};
export default ExportCancelSearchBox;

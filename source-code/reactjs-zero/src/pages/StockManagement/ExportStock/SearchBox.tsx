import {Col, Form} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import React from "react";
import {useTranslation} from "react-i18next";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import DateUtil from "@ord-core/utils/date.util";
import {useSelectPartnerSupplier} from "@ord-components/forms/select/selectDataSource/useSelectPartnerSupplier";
import {useSelectStock} from "@ord-components/forms/select/selectDataSource/useSelectStock";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import {useSelectMoveType} from "@ord-components/forms/select/selectDataSource/useSelectMoveType";

const ExportStockSearchBox = () => {
    const [t] = useTranslation("stock");
    const initRange = DateUtil.getDateRange("thang_nay");
    const form = Form.useFormInstance();
    const isShowAdvanceSearch_w = Form.useWatch("isShowAdvanceSearch", form);
    const partner_Select = useSelectPartnerSupplier();
    const stock_Select = useSelectStock();

    const ds = useSelectMoveType();
    const getText = (moveType: any) => {
        const f = ds.data.find((x) => x.value == moveType);
        return f ? f?.fts : "";
    };

    return (
        <>
            <ColSpanResponsive span={8}>
                <Form.Item name="moveDateRange" initialValue={initRange}>
                    <OrdDateRangeInput allowEq labelMode={"fromToLabel"}/>
                </Form.Item>
            </ColSpanResponsive>
            <SearchFilterText span={16} hasAdvanceSearchBtn/>
            {isShowAdvanceSearch_w && (
                <>
                    {/*  <Col span={6}>
            <FloatLabel label={t("moveType")}>
              <Form.Item name="moveType">
                <OrdSelect
                  datasource={{
                    isPending: false,
                    data: [
                      MoveType.PhieuXuatTraNhaCungCap,
                      MoveType.PhieuXuatHuy,
                      MoveType.HoaDon,
                    ].map((moveType) => ({
                      label: <MoveTypeDisplayText value={moveType} />,
                      value: moveType,
                      fts: getText(moveType),
                    })),
                  }}
                  allowClear
                ></OrdSelect>
              </Form.Item>
            </FloatLabel>
          </Col>*/}
                    <Col span={8}>
                        <FloatLabel label={t("partnerIdFilter")}>
                            <Form.Item name="partnerId">
                                <OrdSelect datasource={partner_Select} allowClear></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    {/* <Col span={10}>
            <FloatLabel label={t("stockInventoryFilter")}>
              <Form.Item name="inventoryId">
                <OrdSelect datasource={stock_Select} allowClear></OrdSelect>
              </Form.Item>
            </FloatLabel>
          </Col>*/}

                </>
            )}

            <div hidden>
                <Form.Item name="moveType" initialValue={MoveType.PhieuXuatTraNhaCungCap}/>
            </div>
        </>
    );
};
export default ExportStockSearchBox;

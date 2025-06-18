import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { useStore } from "@ord-store/index";
import { useDebounce } from "use-debounce";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import DateUtil from "@ord-core/utils/date.util";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectChannelType } from "@ord-components/forms/select/selectDataSource/useSelectChannelType";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { useSelectPaymentMethod } from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";

export const InvoiceSearch = (props: {
  defaultStatus?: number;
  onlyThreeMonthsFilter?: boolean;
  alowEq?: boolean;
}) => {
  const { t } = useTranslation("sale-invoice");
  const { t: tEnum } = useTranslation("enum");
  const { saleInvoiceStore: mainStore } = useStore();
  const { invoiceReturnStore: returnStore } = useStore();
  const form = Form.useFormInstance();
  const [statusOptions, setStatusOptions] = useState<any>();
  const [moveStatusChange, setMoveStatusChange] = useState(0);
  const [debouncedMoveStatus] = useDebounce(moveStatusChange, 300);
  const [isHiddenFilterAdvanced, setIsHiddenFilterAdvanced] = useState(false);
  const isShowAdvanceSearch_w = Form.useWatch("isShowAdvanceSearch", form);


  useEffect(() => {
    form.setFieldValue("status", props.defaultStatus);
  }, [props.defaultStatus]);

  const handlerChange = () => {
    setMoveStatusChange(Number(new Date()));
  };
  useEffect(() => {
    if (debouncedMoveStatus > 0) {
      form.submit();
    }
  }, [debouncedMoveStatus]);

  const channelTypeDataSource = useSelectChannelType(); 
  const einvoiceFilterDataSource = useSelectEinvoiceFilter(); 
  const paymentMethodDataSource = useSelectPaymentMethod();

  return (
    <>
      <ColSpanResponsive span={8}>
        <Form.Item
          name="dateRange"
          initialValue={DateUtil.getDateRange("thang_nay")}
        >
          <OrdDateRangeInput
            allowEq={props.alowEq}
            labelMode={"fromToLabel"}
            onlyThreeMonths={props.onlyThreeMonthsFilter}
          />
        </Form.Item>
      </ColSpanResponsive>
        <SearchFilterText hasAdvanceSearchBtn span={16} />
      {isShowAdvanceSearch_w && (
        <>
          {/* <ColSpanResponsive span={8}>
            <FloatLabel style={{ width: "100%" }} label={t("channel")}>
              <Form.Item noStyle name="saleChannelTypeId">
                <OrdSelect datasource={channelTypeDataSource} allowClear />
              </Form.Item>
            </FloatLabel>
          </ColSpanResponsive> */}
          <ColSpanResponsive span={8}>
            <FloatLabel style={{ width: "100%" }} label={t("Phương phức thanh toán")}>
              <Form.Item noStyle name="paymentMethod">
                <OrdSelect datasource={paymentMethodDataSource} allowClear />
              </Form.Item>
            </FloatLabel>
          </ColSpanResponsive>
          <ColSpanResponsive span={8}>
            <FloatLabel style={{ width: "100%" }} label={t("Trạng thái xuất HĐĐT")}>
              <Form.Item noStyle name="einvoiceStatus">
                <OrdSelect datasource={einvoiceFilterDataSource} allowClear />
              </Form.Item>
            </FloatLabel>
          </ColSpanResponsive>
        </>
      )}

      {!props.defaultStatus ? (
        ""
      ) : (
        <Form.Item name="status" hidden initialValue={props.defaultStatus}>
          <Input />
        </Form.Item>
      )}
    </>
  );
};

const useSelectEinvoiceFilter = (): SelectDataSource => {
  const key = 'einvoiceFilter';
  const { t } = useTranslation('enum');

  return useSelectDataSource(key, async () => {
    return [{
      value: 1,
      label: t('Chưa xuất hoá đơn điện tử'),
    },
    {
      value: 2,
      label: t('Đã xuất hoá đơn điện tử'),
    }
    ];
  });
};

import { Form, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { SelectProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { SaleInvoiceDto } from "@api/index.defs";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import { useSearchInvoice } from "@pages/SalesInvoice/Utils/useSearchInvoice";

interface Props extends SelectProps {
  onInvoiceSelected?: (dto: SaleInvoiceDto) => void;
}

export const InvoiceSelectSearchApi = (props: Props) => {
  const { onInvoiceSelected, ...rest } = props;
  // const {formMoveTicket} = useUpsertStockMove();
  const form = Form.useFormInstance();
  const [t] = useTranslation("sale-invoice");
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [delayTimeSearch, setDelayTimeSearch] = useState<number>(666);
  const [debouncedSearchValue] = useDebounce(searchValue, delayTimeSearch);
  const [focusReady, setFocusReady] = useState(false);
  // const moveType_w = Form.useWatch('moveType', formMoveTicket);
  const firstFocusRef = useAutoFocus();
  const relatedInvoiceId_w = Form.useWatch("relatedInvoiceId", form);

  const [loadMore, setLoadMore] = useState(0);
  const { data, isPending, isSearchOnClient } = useSearchInvoice(
    debouncedSearchValue,
    focusReady,
    loadMore,
    4
  );

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);
  useEffect(() => {
    if (isSearchOnClient) {
      setDelayTimeSearch(100);
    }
  }, [isSearchOnClient]);

  const handlerSearch = (v: string) => {
    setSearchValue(v?.trim());
    setLoading(true);
  };
  const handlerChange = (v: number, dto: any) => {
    setValue(v);
    if (onInvoiceSelected) {
      onInvoiceSelected(dto?.data);
    }
  };
  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isSearchOnClient) {
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } =
      e.target as HTMLDivElement;

    // Kiểm tra xem đã cuộn đến cuối hay chưa
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setLoadMore(Number(new Date()));
    }
  };
  const labelRender = (val: any) => {
    const it = data.find((_) => _.value === val);
    return it?.data?.invoiceCode;
  };

  return (
    <>
      {data && (
        <Select
          ref={firstFocusRef}
          onFocus={() => {
            setFocusReady(true);
          }}
          className={"product-search"}
          {...rest}
          style={{ width: "100%" }}
          options={data}
          labelRender={(v) => {
            return labelRender(v.value);
          }}
          onChange={handlerChange}
          // value={value}
          showSearch
          allowClear
          filterOption={false}
          onSearch={(v) => handlerSearch(v)}
          placeholder={t("searchInputInvoicePlaceholder")}
          dropdownRender={(menu) => (
            <Spin spinning={loading && !isSearchOnClient}>{menu}</Spin>
          )}
          onPopupScroll={handlePopupScroll}
        />
      )}
      {(searchValue || relatedInvoiceId_w) && (
        <label className="f-label">Hóa đơn</label>
      )}
    </>
  );
};

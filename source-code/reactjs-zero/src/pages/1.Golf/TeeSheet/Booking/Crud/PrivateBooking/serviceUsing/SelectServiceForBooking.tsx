import React, { useEffect, useState } from "react";
import { Checkbox, Input, InputNumber, TableColumnsType } from "antd";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import { useStore } from "@ord-store/index";
import { ProductSearch } from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/serviceUsing/ProductSearch";
import TableUtil from "@ord-core/utils/table.util";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import {
  ProductDto,
  ProductTypeEnum, SaleInvoiceDetailDto,
} from "@api/index.defs";
import { round } from "lodash";
import "./SelectServiceForBooking.scss";

const SelectServiceForBooking = (props: {
  selectedRecords: SaleInvoiceDetailDto[];
  discountPercent?: number;
  onSelectedChange?: (
    ids: string[],
    records: SaleInvoiceDetailDto[],
    action: "add" | "remove",
    record: SaleInvoiceDetailDto
  ) => void;
}) => {
  const { golfServicesStore: mainStore, golfBookingStore: bookingStore } =
    useStore();
  // const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<
      SaleInvoiceDetailDto[]
  >([]);
  const selectedIds = selectedRecords.map((x) => x.productId ?? "");

  useEffect(() => {
    if (props.selectedRecords) {
      // setSelectedIds(props.selectedRecords.map(x=>x.productId??""));
      setSelectedRecords(props.selectedRecords);
    }
  }, [props.selectedRecords]);

  const toggleSelect = (productId: string, record: ProductDto) => {
    let newSelectedIds: string[] = [];
    let newSelectedRecords: SaleInvoiceDetailDto[] = [];
    let action: "add" | "remove" = "add";

    if (selectedIds.includes(productId)) {
      newSelectedIds = selectedIds.filter((id) => id !== productId);
      newSelectedRecords = selectedRecords.filter(
        (r) => r.productId !== productId
      );
      action = "remove";
    } else {
      newSelectedIds = [...selectedIds, productId];
      const qty = 1;
      const val = calValue(record, qty);
      newSelectedRecords = [
        ...selectedRecords,
        {
          productId: record.id,
          productName: record.productName,
          qty: qty,
          isPriceIncludeTax: record.isProductPriceIncludeTax,
          price: record.productPrice,
          priceWithTax: record.productPriceWithTax,
          productTypeId: record.productTypeId as ProductTypeEnum,
          productUnitName: record.productUnitName,
          productUnitId: record.productUnitId,
          taxCode: record.taxCode,
          taxPercent: record.taxPercent,
          taxAmount: val.subTaxAmount,
          totalAmountAfterDiscount: val.totalAmountAfterDiscount,
          totalAmount: val.subTotalAmount,
          discountAmount: val.discountAmount,
          discountPercent: val.discountPercent,
          discountType: 2,
        } ,
      ];
      action = "add";
    }

    // setSelectedIds(newSelectedIds);
    setSelectedRecords(newSelectedRecords);

    props.onSelectedChange?.(
      newSelectedIds,
      newSelectedRecords,
      action,
      record
    );
  };

  function calValue(input: ProductDto, qty: number) {
    const taxPercent = input.taxPercent ?? 0;
    const basePrice = input.isProductPriceIncludeTax
      ? (input.productPriceWithTax ?? 0) / (1 + taxPercent / 100)
      : input.productPriceWithTax ?? 0;
    const productAmount = round(basePrice * qty, 2);
    const discountAmount = calDiscountAmount(productAmount);

    const totalAfterDiscount = round(basePrice * qty - discountAmount, 2);
    const tax = round(
      (basePrice * qty - discountAmount) * (taxPercent / 100),
      2
    );

    return {
      productAmount: productAmount,
      totalAmountAfterDiscount: totalAfterDiscount,
      subTaxAmount: tax,
      discountAmount: discountAmount,
      subTotalAmount: round(totalAfterDiscount + tax, 0),
      discountPercent: props.discountPercent ??0
    };
  }
  function calDiscountAmount(price: number){
    const discountPercent = props.discountPercent ?? 0;
    return round(price * discountPercent / 100, 2);
  }

  const columns: TableColumnsType<ProductDto> = TableUtil.getColumns(
    [
      {
        title: "name",
        dataIndex: "productName",
        width: 300,
        render: (t: string) => {
          return <TextLineClampDisplay content={t}></TextLineClampDisplay>;
        },
      },
      {
        dataIndex: "qty",
        title: "qty",
        width: 100,
        align: "center",
        render: (_, record) => {
          const findItem = selectedRecords.find(
            (f) => f.productId == record.id
          ); // dùng productId để so sánh
          const tempValue = findItem?.qty ?? 1;
          if (findItem) {
            const onChangeQty = (value: number | null) => {
              const newQty = value ?? 1;
              const updatedRecords = selectedRecords.map((sr) => {
                if (sr.productId === record.id) {
                  const val = calValue(record, newQty);
                  return {
                    ...sr,
                    qty: newQty,
                    taxAmount: val.subTaxAmount,
                    totalAmountAfterDiscount: val.totalAmountAfterDiscount,
                    totalAmount: val.subTotalAmount,
                    discountAmount: val.discountAmount,
                    discountPercent: val.discountPercent
                  };
                }
                return sr;
              });
              setSelectedRecords(updatedRecords);

              props.onSelectedChange?.(
                selectedIds,
                updatedRecords,
                "add",
                record
              );
            };
            return (
              <InputNumber
                className="input-qty"
                variant="borderless"
                min={1}
                onChange={(val) => {
                  findItem.qty = val ?? 1;
                  onChangeQty(findItem.qty);
                }}
                defaultValue={tempValue}
              ></InputNumber>
            );
          } else {
            return "1";
          }
        },
      },
      {
        dataIndex: "basicUnitName",
        title: "basicUnitName",
        align: "center",
        width: 120,
      },
      {
        dataIndex: "productPriceWithTax",
        title: "ProductPrice",
        align: "end",
        render: (v, dto) => (
          <>
            <PriceCell value={v- calDiscountAmount(v)} />
          </>
        ),
        width: 110,
      },
      {
        title: "action",
        dataIndex: "action",
        align: "center",
        width: 80,
        render: (_, record) => {
          const isSelected = selectedIds.includes(record.id); // dùng productId để so sánh
          return (
            <Checkbox
              checked={isSelected}
              onChange={() => toggleSelect(record.id, record)}
            />
          );
        },
      },
    ],
    {
      ns: bookingStore.getNamespaceLocale(),
      widthRowIndexCol: 50,
    }
  );
  return (
    <div>
      <OrdCrudPage
        hiddenTopAction={true}
        stored={mainStore}
        columns={columns}
        searchForm={(f) => <ProductSearch />}
      ></OrdCrudPage>
    </div>
  );
};

SelectServiceForBooking.propTypes = {};

export default SelectServiceForBooking;

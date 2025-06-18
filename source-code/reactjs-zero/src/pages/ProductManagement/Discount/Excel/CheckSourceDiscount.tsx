import {
  ImportDiscountSupplierInputDto,
  ImportDiscountSupplierOutputDto,
} from "@api/index.defs";
import { Select, Table, TableProps } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Option } from "antd/lib/mentions";
import DateUtil from "@ord-core/utils/date.util";
import {StatusCell} from "@ord-components/table/cells/StatusCell";

export default function CheckSourceDiscount({ result }: any) {
  const resultImport = result as ImportDiscountSupplierOutputDto;
  const [dataSource, setDataSource] = useState<
    ImportDiscountSupplierInputDto[]
  >(result.successImportList);
  const { t } = useTranslation("discount");
  const { t: tCommon } = useTranslation("common");

  const handleDataSourceChange = (value: any) => {
    if (value === "error") {
      setDataSource(resultImport.errorImportList ?? []);
    } else if (value === "success") {
      setDataSource(resultImport.successImportList ?? []);
    }
  };

  const columns: TableProps<ImportDiscountSupplierInputDto>["columns"] = [
    {
      title: t("code"),
      dataIndex: "code",
      align: "left",
      width: 200,
    },
    {
      title: t("discountUseType"),
      dataIndex: "discountUseType",
      align: "left",
      width: 100,
      render(value) {
        return t(`discountUseType.${value}`);
      },
    },
    {
      title: t("discountType"),
      dataIndex: "discountType",
      align: "left",
      width: 150,
      render(value) {
        return t(`discountType.${value}`);
      },
    },
    {
      title: t("discountValue"),
      dataIndex: "discountValue",
      align: "left",
      width: 100,
    },
    {
      title: t("validDate"),
      width: 300,
      render: (value, record) => {
        return (
          <>
            {record.startDate && "Từ " + DateUtil.toFormat(record.startDate)} -{" "}
            {record.endDate && "Đến " + DateUtil.toFormat(record.endDate)}
          </>
        );
      },
    },
    {
      title: t("usageLimit"),
      dataIndex: "usageLimit",
      align: "left",
      width: 100,
    },
    {
      title: t("usageCount"),
      dataIndex: "usageCount",
      align: "left",
      width: 100,
    },
    {
      dataIndex: "discountStatus",
      title: t("discountStatus"),
      align: "center",
      // render: (v) => <StatusCell isActived={v} />,
      width: 100,
      render(value) {
        return <StatusCell isActived={value} />;
      },
    },
  ];

  return (
    <>
      <p
        style={{
          textAlign: "center",
          fontSize: 16,
          fontWeight: "600",
          color: "#3BB54A",
        }}
      >
        {t("checkErrorTitle")}
      </p>
      <div
        className={"py-3"}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "end",
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          <p
            style={{
              color: "#3BB54A",
              marginRight: 5,
            }}
          >
            {tCommon("excelAlert.selectCheck.success")}:{" "}
            {resultImport.succesImportCount}
          </p>
          <p
            style={{
              color: "red",
              marginLeft: 5,
            }}
          >
            {tCommon("excelAlert.selectCheck.error")}:{" "}
            {resultImport.errorImportCount}
          </p>
        </div>
        <Select
          defaultValue="success"
          style={{ width: 200 }}
          onChange={handleDataSourceChange}
        >
          <Option value="success">
            {tCommon("excelAlert.selectCheck.success")}
          </Option>
          <Option value="error">
            {tCommon("excelAlert.selectCheck.error")}
          </Option>
        </Select>
      </div>
      <Table<ImportDiscountSupplierInputDto>
        columns={columns}
        dataSource={dataSource}
      />
    </>
  );
}

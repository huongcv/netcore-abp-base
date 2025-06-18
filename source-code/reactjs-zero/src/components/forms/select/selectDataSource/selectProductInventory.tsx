import React from "react";
import { Select } from "antd";
import { ProductInventoryAvailableDto } from "@api/index.defs";
import { useTranslation } from "react-i18next";

interface ProductSelectProps {
  disabled?: boolean;
  productInventory: ProductInventoryAvailableDto[];
  showSearch?: boolean | undefined;
  value?: any;
  className?: string;
  onChange?: (value: any) => void;
  getOptionValue?: (product: ProductInventoryAvailableDto) => string;
  getOptionLabel?: (product: ProductInventoryAvailableDto) => string;
}

const TagSelectProductInventory: React.FC<ProductSelectProps> = ({
  disabled = false,
  productInventory,
  showSearch,
  value,
  className,
  onChange,
  getOptionValue = (product) => String(product.id), // Mặc định value là ID
  getOptionLabel = (product) =>
    `${product.productName} - ${product.productCode}`, // Mặc định label
}) => {
  const { t } = useTranslation("common");
  return (
    <Select
      className={className}
      disabled={disabled}
      style={{ width: "100%" }}
      showSearch={showSearch}
      placeholder={t("search")}
      value={value}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option?.["data-name"]?.toLowerCase().includes(input.toLowerCase())
      }
      onChange={onChange}
    >
      {productInventory.map((product: ProductInventoryAvailableDto) => (
        <Select.Option
          key={product.id}
          value={getOptionValue(product)}
          data-name={product.productName}
        >
          {getOptionLabel(product)}
        </Select.Option>
      ))}
    </Select>
  );
};

export default TagSelectProductInventory;

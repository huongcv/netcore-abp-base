import { AutoComplete } from "antd";
import * as React from "react";
import Utils from "@ord-core/utils/utils";
import { IOrdSelectOption } from "@ord-components/forms/select/OrdSelect";

export const GolfProductUnitAutoComplete = (props: {
  placeholder?: React.ReactNode;
  style?: React.CSSProperties;
  onChange?: (value: any, option: any | any[]) => void;
  disabledOptions?: string[]; // Thêm prop để nhận danh sách các mục cần vô hiệu hóa
  [key: string]: string | unknown;
}) => {
  const units = ["Lượt", "Vé", "Đôi", "Cái"];
  const options: IOrdSelectOption[] = units.map((it) => {
    const normalizedValue = Utils.toLowerCaseNonAccentVietnamese(it);
    return {
      value: it,
      fts: normalizedValue,
      disabled: props.disabledOptions?.some(
        (opt) => Utils.toLowerCaseNonAccentVietnamese(opt) === normalizedValue
      ),
    };
  });

  const onSearchOption = (input: any, option?: IOrdSelectOption) => {
    const fts = option?.fts || "";
    const ftsStr = Array.isArray(fts) ? fts.join(" ") : fts;
    return ftsStr
      .toLowerCase()
      .includes(Utils.toLowerCaseNonAccentVietnamese(input.toLowerCase()));
  };

  const handleChange = (value: any, option: any | any[]) => {
    if (props.onChange) {
      props.onChange(value, option);
    }
  };

  return (
    <AutoComplete
      {...props}
      options={options}
      placeholder={props.placeholder}
      showSearch
      filterOption={(input, option) => onSearchOption(input, option)}
      allowClear
      onChange={handleChange}
    />
  );
};

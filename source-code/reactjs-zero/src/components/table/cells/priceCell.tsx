import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Utils from "@ord-core/utils/utils";

export const PriceCell = (props: {
  value?: number | null | undefined;
  className?: string | undefined;
  fixed?: number;
}) => {
  const { value, fixed, ...rest } = props;
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const safeValue = value ?? 0; // Nếu null/undefined => gán 0
    setDisplayValue(Utils.parseFloatWithFixed(+safeValue, fixed) || 0);
  }, [value]);

  return (
    <NumericFormat
      {...rest}
      value={displayValue}
      displayType={"text"}
      thousandSeparator={true}
    />
  );
};

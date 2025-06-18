import React from "react";
import { ProductSearchWithUnitDto } from "@api/index.defs";
import OrdDisplayEllipsisTextLong from "@ord-components/displays/OrdDisplayEllipsisTextLong";

export const ProductInMoveStockDisplay = (props: {
  productItem?: ProductSearchWithUnitDto;
}) => {
  const { productItem } = props;
  return (
    <>
      {productItem && (
        <>
          {/*<span className={'block font-semibold'}>{productItem.productCode}</span>*/}
          {/* <span className=" block productName">{productItem.productName}</span> */}
          <OrdDisplayEllipsisTextLong
            text={productItem.productName ?? ""}
            maxWidth={300}
            className="block productName"
          />
        </>
      )}
    </>
  );
};

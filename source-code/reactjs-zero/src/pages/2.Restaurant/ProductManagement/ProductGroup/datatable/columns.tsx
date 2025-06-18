import { IsActivedColumnWithFilter } from "@ord-components/table/columns/IsActivedColumn";
import React from "react";
import { ProductGroupTypeCell } from "@pages/ProductManagement/ProductGroup/datatable/productGroupTypeCell";
import { ColumnType } from "antd/es/table/interface";
import { ProductGroupDto } from "@api/index.defs";

export const ProductGroupDtColumns: ColumnType<ProductGroupDto>[] = [
  // {
  //     title: 'OrderNumber',
  //     dataIndex: 'orderNumber',
  //     width: 150,
  //     sorter: true
  // },
  // {
  //   title: "type",
  //   dataIndex: "type",
  //   width: 200,
  //   sorter: true,
  //   render: (value) => {
  //     return <ProductGroupTypeCell value={value} />;
  //   },
  // },
  {
    title: "code",
    dataIndex: "groupCode",
    width: 100,
  },

  {
    dataIndex: "groupName",
    title: "name",
    width: 200,
    ellipsis: true,
    render: (value) => <div className="max-w-3xl text-ellipsis overflow-hidden">{value}</div>,
  },
  IsActivedColumnWithFilter(),
];

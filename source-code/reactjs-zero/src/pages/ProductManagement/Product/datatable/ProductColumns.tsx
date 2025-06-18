import {IsActivedColumnWithFilter} from "@ord-components/table/columns/IsActivedColumn";
import React from "react";
import {ColumnType} from "antd/es/table/interface";
import {ProductDto} from "@api/index.defs";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {ProductTypeCell} from "@pages/ProductManagement/Product/datatable/ProductTypeCell";
import {ProductNameCell} from "@pages/ProductManagement/Product/datatable/ProductNameCell";
import {ProductInventoryStockQtyCell} from "@pages/ProductManagement/Product/datatable/ProductInventoryStockQtyCell";
import {CostPriceProduct} from "@pages/ProductManagement/Product/datatable/CostPriceProduct";

export const ProductColumns: ColumnType<ProductDto>[] = [
    {
        title: 'type',
        dataIndex: 'productTypeId',
        width: 130,
        render: value => {
            return <ProductTypeCell value={value}/>
        }
    },
    {
        dataIndex: 'productCode',
        title: 'code',
        width: 130,
    },
    {
        title: 'name',
        dataIndex: 'productName',
        render: (text, dto) => <ProductNameCell product={dto}/>
    },
    {
        dataIndex: 'qtyInventory',
        title: 'qtyInventory',
        width: 110,
        align: 'end',
        render: (text, dto) => <ProductInventoryStockQtyCell product={dto}/>
    },
    {
        dataIndex: 'basicUnitName',
        title: 'basicUnitNameShort',
        width: 110,
    },
    {
        dataIndex: 'productPrice',
        title: 'ProductPrice',
        align: 'end',
        render: (v, dto) => (<>
            <PriceCell value={v}/>
        </>),
        width: 90,
    },
    {
        title: 'costPrice',
        align: 'end',
        render: (v, dto) => (<>
            <CostPriceProduct productDto={dto}/>
        </>),
        width: 90,
    },
    {
        ...IsActivedColumnWithFilter(),
        width: 130,
        sorter: false,
        align: 'center'

    }

];

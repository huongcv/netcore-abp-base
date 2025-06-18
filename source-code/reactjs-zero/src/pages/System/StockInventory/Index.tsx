import {TableColumnsType} from "antd";
import {useStore} from "@ord-store/index";
import TableUtil from "@ord-core/utils/table.util";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import React from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {SearchFilterAndIsActived} from "@ord-components/forms/search/SearchFilterAndIsActived";
import {useSelectStockType} from "@ord-components/forms/select/selectDataSource/useSelectStockType";
import ModalTabStockInventory from "@pages/System/StockInventory/ModalTabStockInventory";


const StockInventory = () => {
    const {stockInventoryStore: mainStore} = useStore();
    const selectStockType = useSelectStockType();
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'inventoryName',
            dataIndex: 'inventoryName',
            width: 200,
            sorter: true
        },
        {
            dataIndex: 'inventoryCode',
            title: 'inventoryCode',
            width: 120,
        },
        {
            dataIndex: 'inventoryType',
            title: 'inventoryType',
            render: value => {
                return <DisplayTextFormSelectDataSource
                    datasource={selectStockType}
                    value={value}/>
            },
            width: 150,
        },
        {
            dataIndex: 'inventoryTel',
            title: 'inventoryTel',
            width: 150,
        },
        {
            dataIndex: 'inventoryEmail',
            title: 'inventoryEmail',
            width: 200,
        },
        {
            dataIndex: 'inventoryAddress',
            title: 'inventoryAddress',
        },
        IsActivedColumn()
    ], {
        actions: [
            {
                title: 'view',
                onClick: (d) => {
                    mainStore.openViewDetailModal(d);
                }
            },
            {
                title: 'edit',
                permission: 'System.StockInventory.Create',
                onClick: (d) => {
                    mainStore.openUpdateModal(d);
                }
            },
            {
                title: 'remove',
                permission: 'System.StockInventory.Remove',
                onClick: (d) => {
                    mainStore.openRemoveById(d);
                }
            }
        ],
        ns: mainStore.getNamespaceLocale()
    });


    const topActions: IActionBtn[] = [
        {
            title: 'addNew',
            permission: 'System.StockInventory.Create',
            onClick: () => {
                mainStore.openCreateModal();
            }
        }
    ];
    return (
        <>
            <OrdCrudPage stored={mainStore}
                         topActions={topActions}
                         columns={columns}
                         searchForm={(f) => <SearchFilterAndIsActived/>}
                         entityForm={form => <ModalTabStockInventory/>}
            ></OrdCrudPage>
        </>
    )
};
export default StockInventory;

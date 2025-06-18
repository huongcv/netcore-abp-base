import { FnbAreaService } from "@api/FnbAreaService";
import { FnbTableService } from "@api/FnbTableService";
import { FnbAreaDto } from "@api/index.defs";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import tableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import { Col, Spin, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CreateOrUpdateFormFnbTable from "./CreateOrUpdateFormFnbTable";

const FnbTable = () => {
    const {
        fnbTableStore: mainStore,
    } = useStore();
    const { t } = useTranslation(mainStore.getNamespaceLocale());
    const navigate = useNavigate();

    const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    });


    const columns: TableColumnsType<FnbAreaDto> = tableUtil.getColumns(
        [
            {
                dataIndex: "code",
                title: "code",
                width: 100,
            },
            {
                dataIndex: "name",
                title: "name",
                width: 200,
            },
            {
                dataIndex: "numberOfSeat",
                title: "numberOfSeat",
                width: 200,
            },
            {
                dataIndex: "areaName",
                title: "area",
                width: 200,
            },
            IsActivedColumn(),
        ],
        {
            actions: [
                {
                    title: "remove",
                    onClick: (d) => {
                        mainStore.openRemoveById(d);
                    },
                },
            ],
            viewAction: (d) => {
                mainStore.openUpdateModal(d);
            },
            ns: mainStore.getNamespaceLocale(),
        }
    );

    const topActions: IActionBtn[] = [
        {
            title: "addNew",
            onClick: () => {
                mainStore.openCreateModal();
            },
        },
    ];

    return (
        <>
            <OrdCrudPage
                stored={mainStore}
                topActions={topActions}
                columns={columns}
                contentTopTable={
                    <IsActiveStatusCounter getCountApi={FnbTableService.getCount} />
                }
                searchForm={(f) => (
                    <>
                        <SearchFilterText
                            span={10}
                        />
                    </>
                )}
                onEntitySavedSuccess={() => {
                    mainStore.refreshGridData()
                }}
            ></OrdCrudPage>
            <OrdCreateOrUpdateModal
                stored={mainStore}
                entityForm={() => <CreateOrUpdateFormFnbTable />}
                onSavedSuccess={() => {
                    mainStore.refreshGridData()
                }}
            />
        </>
    );
};

export default observer(FnbTable);

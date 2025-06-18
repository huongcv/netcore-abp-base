import { FnbAreaService } from "@api/FnbAreaService";
import { FnbAreaDto } from "@api/index.defs";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import tableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import { TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CreateOrUpdateFormFnbArea from "./CreateOrUpdateFormFnbArea";
import utils from "@ord-core/utils/utils";

const FnbArea = () => {
    const {
        fnbAreaStore: mainStore,
        selectDataSourceStore
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
                    <IsActiveStatusCounter getCountApi={FnbAreaService.getCount} />
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
                    selectDataSourceStore.clearByName("FnbArea"),
                        selectDataSourceStore.getOptions("FnbArea", async () => {
                            const result = await FnbAreaService.getComboOptions({
                            });
                            return utils.mapCommonSelectOption(result);
                        });
                }}
            ></OrdCrudPage>
            <OrdCreateOrUpdateModal
                stored={mainStore}
                entityForm={() => <CreateOrUpdateFormFnbArea />}
                onSavedSuccess={() => {
                    mainStore.refreshGridData()
                    selectDataSourceStore.clearByName("FnbArea"),
                        selectDataSourceStore.getOptions("FnbArea", async () => {
                            const result = await FnbAreaService.getComboOptions({
                            });
                            return utils.mapCommonSelectOption(result);
                        });
                }}
            />
        </>
    );
};

export default observer(FnbArea);

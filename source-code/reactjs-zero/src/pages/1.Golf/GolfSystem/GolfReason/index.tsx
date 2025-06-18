import { useStore } from "@ord-store/index";
import { TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import { GolfReasonDto } from "@api/index.defs";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { GolfReasonSearchForm } from "./Form/GolfReasonSearchForm";
import GolfReasonCruForm from "./Form/GolfReasonCruForm";

const GolfReasonList = () => {
  const { golfReasonStore: mainStore } = useStore();
  const { t: tEnum } = useTranslation("enum");
  const { t } = useTranslation("golfReason");

  const columns: TableColumnsType<GolfReasonDto> = TableUtil.getColumns(
    [
      {
        title: "reasonCode",
        dataIndex: "reasonCode",
        align: "left",
        width: 200,
      },
      {
        title: "reasonName",
        dataIndex: "reasonName",
        align: "left",
        width: 200,
      },
      {
        title: "reasonNote",
        dataIndex: "reasonNote",
        align: "left",
        width: 200,
      },
    ],
    {
      actions: [
        {
          title: "view",
          onClick: (d) => {
            mainStore.openViewDetailModal(d);
          },
        },
        {
          title: "edit",
          onClick: (d) => {
            mainStore.openUpdateModal(d);
          },
        },
        {
          title: "remove",
          onClick: (d: GolfReasonDto) => {
            const removeByHash = {
              ...d,
              id: d.id,
            };
            mainStore.openRemoveById(removeByHash);
          },
        },
      ] as ITableAction<GolfReasonDto>[],
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
        searchForm={(f) => <GolfReasonSearchForm />}
        entityForm={() => <GolfReasonCruForm />}
      />
    </>
  );
};
export default observer(GolfReasonList);

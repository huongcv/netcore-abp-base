import { useStore } from "@ord-store/index";
import { Form, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import TableUtil from "@ord-core/utils/table.util";
import { useTranslation } from "react-i18next";
import { BuggyCurrentStatusEnum, GolfBuggyOutPutDto } from "@api/index.defs";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { GolfCartSearchForm } from "./form/GolfCartSearch";
import GolfCartCruModal from "./modal/GolfBuggyCruModal";
import BuggyGroupList from "@pages/1.Golf/Category/GolfBuggyGroup/index";
import { BuggyStatusCell } from "./components/BuggyStatusCell";
import { useState } from "react";

const GolfCartList = () => {
  const { golfBuggyStore: mainStore } = useStore();
  const { t: tEnum } = useTranslation("comboEnum");
  const { t } = useTranslation("GolfBuggy");

  const columns: TableColumnsType<GolfBuggyOutPutDto> = TableUtil.getColumns(
    [
      {
        title: "buggyName",
        dataIndex: "buggyName",
        align: "left",
        width: 200,
      },
      {
        title: "licensePlate",
        dataIndex: "licensePlate",
        align: "left",
        width: 200,
      },
      {
        title: "buggyType",
        dataIndex: "buggyType",
        align: "left",
        width: 100,
        render(value) {
          return tEnum(`buggyType.${value}`);
        },
      },
      {
        title: "buggyGroupName",
        dataIndex: "buggyGroupName",
        align: "left",
        width: 100,
      },
      {
        title: "batteryCapacity",
        dataIndex: "batteryCapacity",
        align: "left",
        width: 100,
      },
      {
        title: "currentStatus",
        dataIndex: "currentStatus",
        align: "center",
        width: 100,
        render: (value: BuggyCurrentStatusEnum) => (
          <BuggyStatusCell status={value} />
        ),
      },
    ],
    {
      actions: [
        // {
        //   title: "view",
        //   onClick: (d) => {
        //     mainStore.openUpdateModal(d);
        //   },
        // },
        // {
        //   title: "edit",
        //   onClick: (d) => {
        //     mainStore.openUpdateModal(d);
        //   },
        // },
        {
          title: "remove",
          onClick: (d: GolfBuggyOutPutDto) => {
            const removeByHash = {
              ...d,
              id: d.id,
            };
            mainStore.openRemoveById(removeByHash);
          },
        },
      ] as ITableAction<GolfBuggyOutPutDto>[],
      viewAction: (d) => {
        mainStore.openUpdateModal(d);
      },
      ns: mainStore.getNamespaceLocale(),
    }
  );

  const topActions: IActionBtn[] = [
    {
      title: "Nhóm xe",
      content: (
        <>
          <BuggyGroupList />
        </>
      ),
    },
    {
      title: "addNew",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
  ];

  return (
    <>
      <PageTopTitleAndAction>
        <TopAction topActions={topActions} />
      </PageTopTitleAndAction>
      <OrdCrudPage
        hiddenTopAction={true}
        stored={mainStore}
        topActions={topActions}
        columns={columns}
        searchForm={(f) => <GolfCartSearchForm />}
        entityForm={(form) => <GolfCartCruModal cusForm={form} />}
      />
    </>
  );
};

export default observer(GolfCartList);

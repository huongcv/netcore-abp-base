import {
  CleaningTaskDto,
  CleaningTaskGroupByDateParamDto,
} from "@api/index.defs";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useStore } from "@ord-store/index";
import { Button, Space, Spin, TableColumnsType } from "antd";
import TableUtil from "@ord-core/utils/table.util";
import { Trans, useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import CleaningTaskSearchForm from "./Form/CleaningTaskSearchForm";
import CleaningTaskCRUModal from "./Modal/CleaningTaskCRUModal";
import { CleaningTaskService } from "@api/CleaningTaskService";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./index.scss";
import UiUtils from "@ord-core/utils/ui.utils";

const CleaningTaskList = () => {
  const { cleaningTaskTrackingStore: mainStore } = useStore();
  const { t } = useTranslation("cleaningTask");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const topActions: IActionBtn[] = [
    {
      content: (
        <>
          <Button onClick={() => navigate(-1)}>
            <Space>
              <ArrowLeftOutlined />
            </Space>
            {t("backToIndex")}
          </Button>
        </>
      ),
    },
    {
      title: "addNew",
      // permission: "ShopWeatherData.CreateOrUpdate",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
  ];

  const columns: TableColumnsType<CleaningTaskGroupByDateParamDto> =
    TableUtil.getColumns(
      [
        {
          title: t("executionDate"),
          dataIndex: "executionDate",
          align: "left",
          width: 200,
          render: (value, record) => {
            return (
              <>
                {record.executionDate &&
                  "Tháng " + format(new Date(value), "MM/yyyy")}
              </>
            );
          },
        },
      ],
      {
        actions: [
          {
            title: "edit",
            onClick: async (record: CleaningTaskDto) => {
              setLoading(true);
              try {
                const response = await CleaningTaskService.getByDate({
                  body: { executionDate: record.executionDate },
                });
                mainStore.openUpdateModal({
                  day: dayjs(record.executionDate),
                  cleaningTasks: response,
                });
              } catch (error) {
                console.error("Error fetching data:", error);
              } finally {
                setLoading(false);
              }
            },
          },
          {
            title: "remove",
            onClick: (d) => {
              UiUtils.showConfirm({
                title: t("confirmDelete"),
                icon: "remove",
                content: (
                  <Trans
                    ns={mainStore.getNamespaceLocale()}
                    i18nKey="confirmRemove"
                    values={{
                      executionDate: dayjs(d.executionDate).format("MM/YYYY"),
                    }}
                    components={{ italic: <i />, bold: <strong /> }}
                  ></Trans>
                ),
                onOk: () => {
                  mainStore.removeEntityByExecutionDate(d);
                },
                onCancel: () => {},
                isDanger: true,
              });
            },
          },
        ] as ITableAction<CleaningTaskGroupByDateParamDto>[],
        ns: mainStore.getNamespaceLocale(),
      }
    );
  return (
    <>
      <PageTopTitleAndAction
        usingCustom={true}
        mainTitle={t("titlePage")}
        items={[t("titlePageLvl1"), t("titlePageLvl2")]}
      >
        <TopAction topActions={topActions} />
      </PageTopTitleAndAction>
      {loading && (
        <div className="loading-overlay">
          <Spin />
        </div>
      )}
      <OrdCrudPage
        tableBordered={true}
        stored={mainStore}
        columns={columns}
        hiddenTopAction={true}
        searchForm={() => <CleaningTaskSearchForm />}
        entityForm={(form) => <CleaningTaskCRUModal />}
      ></OrdCrudPage>
    </>
  );
};

export default observer(CleaningTaskList);

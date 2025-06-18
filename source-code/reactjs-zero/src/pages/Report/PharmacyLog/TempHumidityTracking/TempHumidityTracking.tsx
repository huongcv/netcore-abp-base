import { GroupByDateDto, ShopWeatherDataDto } from "@api/index.defs";
import { useStore } from "@ord-store/index";
import { Button, Space, Spin, TableColumnsType } from "antd";
import { Trans, useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import TempHumiditySearchForm from "./Form/TempHumiditySearchForm";
import CreateOrUpdateModal from "./Modal/CreateOrUpdateModal";
import { WeatherDataService } from "@api/WeatherDataService";
import { format } from "date-fns";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./index.scss";
import UiUtils from "@ord-core/utils/ui.utils";

const TempHumidityTracking: React.FC = () => {
  const { tempHumidityTrackingStore: mainStore } = useStore();
  // const { t: tCommon } = useTranslation("common");
  const { t: tEnum } = useTranslation("enum");
  const { t } = useTranslation("tracking");
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

  const columns: TableColumnsType<GroupByDateDto> = TableUtil.getColumns(
    [
      {
        title: t("measureDate"),
        dataIndex: "measureDate",
        align: "left",
        width: 200,
        render: (value, record) => {
          return (
            <>
              {record.measureDate &&
                "Tháng " + format(new Date(value), "MM/yyyy")}
            </>
          );
        },
        // sorter: true,
      },
    ],
    {
      actions: [
        {
          title: "edit",
          onClick: async (record: ShopWeatherDataDto) => {
            const measureDate = record.measureDate!;
            const formattedDate = format(measureDate, "yyyy-MM-dd");
            setLoading(true);
            try {
              const response = await WeatherDataService.getById({
                measureDate: formattedDate,
              });
              mainStore.openUpdateModal({
                day: dayjs(record.measureDate),
                trackingItems: response,
              });
            } catch (error) {
              console.error("Error fetching data by measureDate:", error);
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
                    measureDate: dayjs(d.measureDate).format("MM/YYYY"),
                  }}
                  components={{ italic: <i />, bold: <strong /> }}
                ></Trans>
              ),
              onOk: () => {
                mainStore.removeEntityByMeasureDate(d);
              },
              onCancel: () => {},
              isDanger: true,
            });
          },
        },
      ] as ITableAction<GroupByDateDto>[],
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
        searchForm={() => <TempHumiditySearchForm />}
        entityForm={(form) => <CreateOrUpdateModal />}
      ></OrdCrudPage>
    </>
  );
};

export default observer(TempHumidityTracking);

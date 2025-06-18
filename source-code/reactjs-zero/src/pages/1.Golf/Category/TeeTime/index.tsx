import {
  GolfTeeTimeConfigDto,
} from "@api/index.defs";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useStore } from "@ord-store/index";
import { Form, Spin, TableColumnsType } from "antd";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectCourseType } from "@ord-components/forms/select/selectDataSource/useSelectCourseType";
import { lazy, Suspense, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import DateUtil from "@ord-core/utils/date.util";
import dayjs, { Dayjs } from 'dayjs';
import { TeeTimeConfigService } from "@api/TeeTimeConfigService";
import Utils from "@ord-core/utils/utils";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";

const TeeTimeConfig: React.FC = () => {
  const { golfTeeTimeStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const { t: tEnum } = useTranslation("enum");
  const [golfCourseData, setGolfCourseData] = useState<SelectDataSource>()

  const getGolfCourseData = async () => {
    const result = await TeeTimeConfigService.getGolfCourseComboOptions({});
    setGolfCourseData({ data: Utils.mapCommonSelectOption(result), isPending: false });
  };

  useEffect(() => {
    getGolfCourseData();
  }, []);

  const columns: TableColumnsType<GolfTeeTimeConfigDto> = TableUtil.getColumns(
    [
      {
        title: t("tenSan"),
        dataIndex: "courseName",
        align: "left",
        width: 100,
      },
      {
        title: t("thoiGianApDung"),
        align: "center",
        width: 150,
        render: (value, record: GolfTeeTimeConfigDto) => {
          return <>{record.strApplyMode && tEnum(record.strApplyMode)}</>;
        }
      },
      {
        title: t("gioBatDau"),
        dataIndex: "startHour",
        align: "center",
        width: 100,
        render: (value, record: GolfTeeTimeConfigDto) => {
          const startHourStr = record.startHour?.toString();
          const time = startHourStr ? dayjs(startHourStr, ["HH:mm", "HH:mm:ss"]) : null;
          return <>{time && time.isValid() ? time.format("HH:mm") : "-"}</>;
        }
      },
      {
        title: t("gioKetThuc"),
        dataIndex: "endHour",
        align: "center",
        width: 100,
        render: (value, record: GolfTeeTimeConfigDto) => {
          const endHourStr = record.endHour?.toString();
          const time = endHourStr ? dayjs(endHourStr, ["HH:mm", "HH:mm:ss"]) : null;
          return <>{time && time.isValid() ? time.format("HH:mm") : "-"}</>;
        }
      },
      {
        title: t("ngayHieuLuc"),
        dataIndex: "name",
        align: "left",
        width: 150,
        render: (value, record: GolfTeeTimeConfigDto) => {
          return <>{record.applyFromDate
            ? DateUtil.toFormat(
              record?.applyFromDate,
              "DD/MM/YYYY"
            )
            : "-"}
            {record.applyToDate
              ? " - " + DateUtil.toFormat(
                record?.applyToDate,
                "DD/MM/YYYY"
              )
              : "-"}</>;
        }
      },
      {
        title: t("khoangCach"),
        dataIndex: "intervalMinutes",
        align: "center",
        width: 100,
        render: (value, record: GolfTeeTimeConfigDto) => {
          return <>{record.intervalMinutes != undefined ? record.intervalMinutes + " " + t("minute").toLowerCase() : "-"}</>;
        }
      },
      {
        title: t("soTeeTime"),
        align: "center",
        width: 100,
        render: (value, record: GolfTeeTimeConfigDto) => {
          return <>
            {record.endHour && record.startHour && record.intervalMinutes
              ? (dayjs(record.endHour?.toString(), ["HH:mm", "HH:mm:ss"]).diff(dayjs(record.startHour?.toString(), ["HH:mm", "HH:mm:ss"]), "minute") / record.intervalMinutes)
              : "-"}
          </>;
        }
      },
      {
        title: t("soFlight"),
        dataIndex: "maxGroupPerFlight",
        align: "center",
        width: 100,
      },
      IsActivedColumn(),

    ],

    {
      actions: [

        {
          title: "edit",
          onClick: (d: GolfTeeTimeConfigDto) => {
            mainStore.createOrUpdateModal.width = 800;
            mainStore.openUpdateModal(d);
          }
        },
        {
          title: "remove",
          onClick: (d: GolfTeeTimeConfigDto) => {
            const removeByHash = {
              ...d,
              id: d.id,
            };
            mainStore.openRemoveById(removeByHash);
          }
        },
      ] as ITableAction<GolfTeeTimeConfigDto>[],
      viewAction: (d) => {
        mainStore.createOrUpdateModal.width = 800;
        mainStore.openUpdateModal(d);
      },
      ns: mainStore.getNamespaceLocale(),
    }
  );

  const topActions: IActionBtn[] = [
    {
      title: "addNew",
      // permission: "ProductPriceList.Create",
      onClick: () => {
        mainStore.createOrUpdateModal.width = 800;
        mainStore.openCreateModal();
      },
    },
  ];
  const SearchForm = () => {
    return (
      <>
        <ColSpanResponsive span={4}>
          <FloatLabel label={t("date")}>
            <Form.Item name="date">
              <OrdDateInput allowClear placeholder={t("date")} />
            </Form.Item>
          </FloatLabel>
        </ColSpanResponsive>
        <ColSpanResponsive span={4}>
          <FloatLabel label={t("san")}>
            <Form.Item name="courseId">
              <OrdSelect
                datasource={golfCourseData || { data: [], isPending: true }}
                allowClear
                placeholder={t("selectCourse")}
              />
            </Form.Item>
          </FloatLabel>
        </ColSpanResponsive>
        <SearchFilterText span={8} />
      </>
    );
  };

  const TeeTimeConfigCruForm =
    lazy(() => import('@pages/1.Golf/Category/TeeTime/modal/TeeTimeConfigCruModal'));


  return (
    <>
      <PageTopTitleAndAction
        usingCustom={true}
        mainTitle={t("titlePage")}
        items={[t("titlePageLvl1")]}
      >
        <TopAction topActions={topActions} />
      </PageTopTitleAndAction>
      <OrdCrudPage
        hiddenTopAction={true}
        stored={mainStore}
        searchForm={(f) => <SearchForm />}
        columns={columns}
        topActions={topActions}
      ></OrdCrudPage>
      <Suspense >
        {(mainStore.createOrUpdateModal.visible) &&
          <TeeTimeConfigCruForm></TeeTimeConfigCruForm>
        }
      </Suspense>
    </>
  );
};
export default observer(TeeTimeConfig);

import { GolfCaddyService } from "@api/GolfCaddyService";
import {
  CaddyWorkScheduleDto,
  ShopWorkCalendarDetailDto,
} from "@api/index.defs";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { useStore } from "@ord-store/index";
import { TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";

const CaddyWorkScheduleForm = () => {
  const { t } = useTranslation("GolfCaddy");
  const { t: tEnum } = useTranslation("enum");
  const { golfCaddyStore: mainStore } = useStore();

  const columns: TableColumnsType<CaddyWorkScheduleDto> = TableUtil.getColumns(
    [
      {
        dataIndex: "name",
        width: "200px",
        title: t("workTime"),
        // do tên của calendar Detail là tên enum thứ trong tuần nên sẽ lấy bản dịch của enum
        render: (value) => {
          return <span> {tEnum(value)}</span>;
        },
      },
      {
        dataIndex: "hourFrom",
        title: t("hourFrom"),
        width: "120px",
        align: "center",
      },
      {
        dataIndex: "hourFrom",
        title: t("breakTime"),
        width: "220px",
        render: (data: number, record: ShopWorkCalendarDetailDto) => {
          return (
            <span>
              {" "}
              {record.hourBreakTimeFrom} - {record.hourBreakTimeTo}
            </span>
          );
        },
        align: "center",
      },

      {
        dataIndex: "hourTo",
        title: t("hourTo"),
        width: "120px",
        align: "center",
      },
    ],
    {
      ns: mainStore.getNamespaceLocale(),
    }
  );

  return (
    <>
      <AntTableWithDataPaged
        getPageResult={(d) => {
          return GolfCaddyService.getCaddyWorkSchedule(
            {
              body: {
                ...d.body,
                caddyId: mainStore.entityUpdateData.id.toString(),
              },
            },
            {}
          );
        }}
        columns={columns}
        searchData={mainStore.searchDataState}
        refreshDatasource={mainStore.refreshDataState}
        hiddenPagination={true}
      />
    </>
  );
};

export default observer(CaddyWorkScheduleForm);

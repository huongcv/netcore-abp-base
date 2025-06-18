import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import { useStore } from "@ord-store/index";
import { Button, Form, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import { PartnerDto } from "@api/index.defs";
import { GolfCaddySearchForm } from "./form/CaddySearchForm";
import CaddyCruModal from "./modal/CaddyCruModal";
import DateCell from "@ord-components/table/cells/DateCell";
import Utils from "@ord-core/utils/utils";
import { CalendarOutlined, FileExcelOutlined } from "@ant-design/icons";
import PartnerGroupBtn from "@pages/Partner/Shared/PartnerGroup/PartnerGroupBtn";

const GolfCaddyList = () => {
  const { golfCaddyStore: mainStore, golfCaddyGroupStore } = useStore();
  const { t: tEnum } = useTranslation("enum");
  const { t } = useTranslation("GolfCaddy");
  const [searchFormRef] = Form.useForm();
  const columns: TableColumnsType<any> = TableUtil.getColumns(
    [
      {
        title: "code",
        dataIndex: "code",
        align: "left",
        width: 200,
      },
      {
        title: "name",
        dataIndex: "name",
        align: "left",
        width: 200,
        render: (_, record: PartnerDto) => {
          return (
            <>
              {record.name} {"-"} {tEnum(`GENDER.${record.gender}`)}
            </>
          );
        },
      },
      {
        title: "dateOfBirth",
        dataIndex: "dateOfBirth",
        align: "left",
        width: 100,
        render: (_) =>
          _ ? <DateCell date={_} format="DD/MM/YYYY"></DateCell> : "-",
      },
      {
        title: "phone",
        dataIndex: "phone",
        align: "left",
        width: 200,
        render: (_) => (_ ? <>{Utils.transformPhoneNumber(_)}</> : "-"),
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
          onClick: (d: PartnerDto) => {
            const removeByHash = {
              ...d,
              id: d.id,
            };
            mainStore.openRemoveById(removeByHash);
          },
        },
      ] as ITableAction<PartnerDto>[],
      ns: mainStore.getNamespaceLocale(),
    }
  );

  const topActions: IActionBtn[] = [
    {
      title: "exportExcel",
      content: (
        <Button
          icon={<FileExcelOutlined style={{ color: "#FFFFFF" }} />}
          style={{
            borderColor: "#163422 !important",
            color: "#FFFFFF",
          }}
        >
          Excel
        </Button>
      ),
      onClick: () => mainStore.exportExcelPagedResult(),
    },
    {
      title: t("actionBtn.CustomerGroup"),
      // permission: PERMISSION_APP.customer.customerGroup,
      content: (
        <>
          <PartnerGroupBtn
            partnerType={4}
            store={golfCaddyGroupStore}
          ></PartnerGroupBtn>
        </>
      ),
    },
    {
      title: "Phân bổ Caddy",
      content: (
        <Button
          icon={<CalendarOutlined style={{ color: "white" }} />}
          style={{
            background: "#163422",
            color: "white",
          }}
        >
          Phần bổ Caddy
        </Button>
      ),
      onClick: () => {},
    },
    {
      title: "Quản lý lịch làm",
      content: (
        <Button
          icon={<CalendarOutlined style={{ color: "white" }} />}
          style={{
            background: "#163422",
            color: "white",
          }}
        >
          Quản lý lịch làm
        </Button>
      ),
      onClick: () => {},
    },
    {
      title: "addNew",
      //   permission: "ProductPriceList.Create",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
  ];
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
        topActions={topActions}
        columns={columns}
        searchForm={(f) => <GolfCaddySearchForm />}
        entityForm={() => <CaddyCruModal />}
      ></OrdCrudPage>
    </>
  );
};

export default observer(GolfCaddyList);

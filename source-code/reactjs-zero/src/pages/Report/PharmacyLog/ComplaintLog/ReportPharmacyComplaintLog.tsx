import { PharmacyComplaintLogDto } from "@api/index.defs";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import tableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Space,
  TableColumnsType,
} from "antd";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { CreateOrUpdateFormComplaintLog } from "./Form/CreateOrUpdateFormComplaintLog";
import {
  ArrowLeftOutlined,
  ExportOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import DateUtil from "@ord-core/utils/date.util";

const ReportPharmacyComplaintLog: React.FC = () => {
  const { reportPharmacyLogComplaintLogStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const navigate = useNavigate();

  const columes: TableColumnsType<any> = tableUtil.getColumns(
    [
      {
        title: "createdTime",
        dataIndex: "createdTime",
        width: 100,
        render: (v: string) => format(new Date(v), "dd/MM/yyyy"),
      },
      {
        title: "email",
        dataIndex: "email",
        width: 100,
      },
      {
        title: "phoneNumber",
        dataIndex: "phoneNumber",
        width: 75,
      },
      {
        title: "informationRecipientName",
        dataIndex: "informationRecipientName",
        width: 150,
      },
      {
        title: "patientName",
        dataIndex: "patientName",
        width: 120,
      },
      {
        title: "productName",
        dataIndex: "productName",
        width: 100,
      },
      {
        title: "lotNumber",
        dataIndex: "lotNumber",
        width: 90,
      },
      {
        title: "qty",
        dataIndex: "qty",
        width: 100,
        align: "end",
      },
      {
        title: "SoldUnitName",
        dataIndex: "basicUnitName",
        width: 90,
        align: "start",
      },
      {
        title: "complaintContent",
        dataIndex: "complaintContent",
        width: 200,
      },
    ],
    {
      actions: [
        {
          title: "view",
          onClick: (d: PharmacyComplaintLogDto) => {
            mainStore.openViewDetailModal(d);
          },
        },
        {
          title: "edit",
          onClick: (d: PharmacyComplaintLogDto) => {
            mainStore.openUpdateModal(d);
          },
        },
        {
          title: "remove",
          onClick: (d: any) => {
            mainStore.openRemoveById(d);
          },
        },
      ],
      ns: mainStore.getNamespaceLocale(),
    }
  );
  const topActions: IActionBtn[] = [
    {
      content: (
        <>
          <Button onClick={() => navigate(-1)}>
            <Space>
              <ArrowLeftOutlined />
            </Space>
            {t("backIndex")}
          </Button>
        </>
      ),
    },
    {
      content: (
        <Button
          type="primary"
          style={{ backgroundColor: "#2353A8" }}
          onClick={() => {
            mainStore.exportExcelPagedResult().then((res) => {});
          }}
        >
          <Space>
            <ExportOutlined />
          </Space>
          {t("actionBtn.exportExcel")}
        </Button>
      ),
    },
    {
      title: "addNew", //permission
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
  ];
  const SearchForm = ({ searchFormRef }: { searchFormRef: FormInstance }) => {
    const [t] = useTranslation("report_pharmacyLogComplaintLog");

    const onResetClick = () => {
      searchFormRef.resetFields();
      mainStore.searchData({});
    };
    useHotkeys(
      "F3",
      (event) => {
        searchFormRef.submit();
        event.preventDefault();
      },
      { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true }
    );
    return (
      <>
        <Col {...useResponsiveSpan(8)}>
          <Space.Compact style={{ width: "100%", gap: 15 }}>
            <FloatLabel style={{ flex: 1 }} label={t("validDate")}>
              <Form.Item name="dateRange" initialValue={DateUtil.getDateRange("thang_nay")}>
                <OrdDateRangeInput></OrdDateRangeInput>
              </Form.Item>
            </FloatLabel>
          </Space.Compact>
        </Col>
        <Col {...useResponsiveSpan(8)}>
          <SearchFilterText span={24} />
        </Col>
      </>
    );
  };

  return (
    <>
      <PageTopTitleAndAction
        usingCustom={true}
        mainTitle={t("titlePage")}
        items={[t("titlePageLvl1"), t("titlePageLvl2")]}
      >
        {/* <Button
          type="default"
          onClick={() => {
            navigate("/report");
          }}
        >
          <ArrowLeftOutlined />
          {t("backIndex")}
        </Button> */}
        <TopAction topActions={topActions} />
      </PageTopTitleAndAction>
      <OrdCrudPage
        stored={mainStore}
        hiddenTopAction={true}
        columns={columes}
        searchForm={(searchFormRef) => (
          <SearchForm searchFormRef={searchFormRef} />
        )}
        entityForm={(form) => <CreateOrUpdateFormComplaintLog form={form} />}
      ></OrdCrudPage>
    </>
  );
};
export default observer(ReportPharmacyComplaintLog);

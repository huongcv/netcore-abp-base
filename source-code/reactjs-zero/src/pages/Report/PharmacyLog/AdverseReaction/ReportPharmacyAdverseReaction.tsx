import {
  ArrowLeftOutlined,
  ExportOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { PharmacyAdverseReactionDto } from "@api/index.defs";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { HotKeyScope } from "@ord-core/AppConst";
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
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DateUtil from "@ord-core/utils/date.util";

const ReportPharmacyAdverseReaction: React.FC = () => {
  const { reportPharmacyLogAdverseReactionStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const navigate = useNavigate();

  const columes: TableColumnsType<PharmacyAdverseReactionDto> =
    tableUtil.getColumns(
      [
        {
          title: "createdTime",
          dataIndex: "createdTime",
          width: 100,
          render: (v: string) => format(new Date(v), "dd/MM/yyyy"),
        },
        {
          title: "reportName",
          dataIndex: "reportName",
          width: 150,
        },
        {
          title: "patientFullName",
          dataIndex: "patientFullName",
          width: 150,
        },
        {
          title: "patientNation",
          dataIndex: "patientNation",
          width: 100,
        },
        {
          title: "patientAge",
          dataIndex: "patientAge",
          width: 70,
          //align: "end",
        },
        {
          title: "patientGender",
          dataIndex: "patientGender",
          width: 70,
          render: (v: any) => t(`GENDER.${v}`),
        },
        {
          title: "reporterName",
          dataIndex: "reporterName",
          width: 120,
        },
      ],
      {
        actions: [
          {
            title: "edit",
            onClick: (p: PharmacyAdverseReactionDto) => {
              navigate(
                `/report/pharmacy-log/adverse-drug-reaction/create-update/${p.id}`
              );
            },
          },
          {
            title: "remove",
            onClick: (p) => {
              mainStore.openRemoveById(p);
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
          <Button onClick={() => navigate("/report")}>
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
        navigate(`/report/pharmacy-log/adverse-drug-reaction/create-update`);
      },
    },
  ];
  const SearchForm = ({ searchFormRef }: { searchFormRef: FormInstance }) => {
    const [t] = useTranslation("report_adverse_reaction");

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
        <Col {...useResponsiveSpan(12)}>
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
        <TopAction topActions={topActions} />
      </PageTopTitleAndAction>
      <OrdCrudPage
        stored={mainStore}
        hiddenTopAction={true}
        columns={columes}
        searchForm={(searchFormRef) => (
          <SearchForm searchFormRef={searchFormRef} />
        )}
        //entityForm={(form) => <CreateOrUpdateFormAdverseReaction form={form} />}
      ></OrdCrudPage>
    </>
  );
};
export default observer(ReportPharmacyAdverseReaction);

import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchIsActived } from "@ord-components/forms/search/SearchIsActived";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import tableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import { Button, Col, Form, Input, Space, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { DrugRecallDto } from "@api/index.defs";
import { format } from "date-fns";
import { CreateOrUpdateFormDrugRecall } from "./Form/CreateOrUpdateFormDrugRecall";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { FormInstance } from "antd/lib";
import {
  ArrowLeftOutlined,
  ExportOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { StatusCell } from "@ord-components/table/cells/StatusCell";
import { l } from "@ord-core/language/lang.utils";
import DateUtil from "@ord-core/utils/date.util";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";

const ReportPharmacyLogDrugRecall: React.FC = () => {
  const { reportPharmacyLogDrugRecallReportStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const navigate = useNavigate();

  const columes: TableColumnsType<any> = tableUtil.getColumns(
    [
      {
        title: "createdTime",
        dataIndex: "createdTime",
        width: 120,
        render: (v: string) => format(new Date(v), "dd/MM/yyyy"),
      },
      {
        title: "ProductId",
        // dataIndex: "productId",
        dataIndex: "productName",
        width: 150,
        render: (text) => <TextLineClampDisplay content={text}/> 
      },
      {
        title: "placeRequestRecall",
        dataIndex: "placeRequestRecall",
        width: 160,
      },
      {
        title: "placeRecovery",
        dataIndex: "placeRecovery",
        width: 160,
      },
      {
        title: "soldQty",
        dataIndex: "soldQty",
        width: 90,
        align: "end",
      },
      {
        title: "soldUnitName",
        dataIndex: "soldUnitName",
        width: 100,
        align: "center",
      },
      {
        title: "recalledQty",
        dataIndex: "recalledQty",
        width: 90,
        align: "end",
      },
      {
        title: "recalledUnitName",
        dataIndex: "recalledUnitName",
        width: 100,
        align: "center",
      },
      {
        title: "reasonRecall",
        dataIndex: "reasonRecall",
        width: 200,
      },
      {
        title: "notes",
        dataIndex: "notes",
        width: 150,
        align: "left",
        render: (text) => <TextLineClampDisplay content={text}/> 
      },
    ],
    {
      actions: [
        {
          title: "view",
          onClick: (d: DrugRecallDto) => {
            mainStore.openViewDetailModal(d);
          },
        },
        {
          title: "edit",
          onClick: (d: DrugRecallDto) => {
            mainStore.openUpdateModal(d);
          },
        },
        {
          title: "remove",
          onClick: (d) => {
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
            {t("BackToIndex")}
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
      title: "addNew", //permission:
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
  ];
  const SearchForm = ({ searchFormRef }: { searchFormRef: FormInstance }) => {
    const [t] = useTranslation("drugrecall");
    function onResetClick() {
      searchFormRef.resetFields();
      mainStore.searchData({});
    }
    return (
      <>
        <Col {...useResponsiveSpan(12)}>
          <Space.Compact style={{ width: "100%", gap: 15 }}>
            <FloatLabel style={{ flex: 1 }} label={t("validDate")}>
              <Form.Item
                name="dateRange"
                initialValue={DateUtil.getDateRange("thang_nay")}
              >
                <OrdDateRangeInput></OrdDateRangeInput>
              </Form.Item>
            </FloatLabel>
          </Space.Compact>
        </Col>
        <Col {...useResponsiveSpan(12)}>
          <SearchFilterText onReset={onResetClick} span={24}/>
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
        entityForm={(form) => <CreateOrUpdateFormDrugRecall form={form} />}
      ></OrdCrudPage>
    </>
  );
};
export default observer(ReportPharmacyLogDrugRecall);

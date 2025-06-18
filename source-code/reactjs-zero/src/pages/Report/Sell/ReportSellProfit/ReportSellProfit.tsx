import React, { useEffect } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row, Space } from "antd";
import DateUtil from "@ord-core/utils/date.util";
import { useNavigate } from "react-router-dom";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import {
  ArrowLeftOutlined,
  ExportOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { TopAction } from "@ord-components/crud/TopAction";
import { debounce } from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";
import TableProfitByMoney from "@pages/Report/Sell/ReportSellProfit/TableProfitByMoney";
import TableProfitByBill from "@pages/Report/Sell/ReportSellProfit/TableProfitByBill";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import TableProfitByProduct from "@pages/Report/Sell/ReportSellProfit/TableProfitByProduct";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

type SellReportType = "time" | "bill" | "product";

function ReportSellProfit() {
  const { reportSellProfit: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const { t: tCommon } = useTranslation("common");
  const [searchFormRef] = Form.useForm();
  useEffect(() => {
    if (stored) {
      stored.setSearchFormRef(searchFormRef);
      searchFormRef.setFields([
        {
          name: "rangeDate",
          value: DateUtil.getDateRange("thang_nay"),
        },
        {
          name: "reportType",
          value: "time",
        },
      ]);
      stored.loadSummary();
    }
  }, []);
  const useSelectReportType = (): SelectDataSource => {
    const key = "FilterSellReportType";
    return useSelectDataSource(key, async () => {
      return [
        {
          value: "time",
          label: t("reportType.time"),
          fts: Utils.toLowerCaseNonAccentVietnamese(t("reportType.time")),
        },
        {
          value: "bill",
          label: t("reportType.bill"),
          fts: Utils.toLowerCaseNonAccentVietnamese(t("reportType.bill")),
        },
        {
          value: "product",
          label: t("reportType.product"),
          fts: Utils.toLowerCaseNonAccentVietnamese(t("reportType.product")),
        },
      ];
    });
  };
  const navigate = useNavigate();
  function onResetClick() {
    searchFormRef.resetFields();
    searchFormRef.setFields([
      {
        name: "rangeDate",
        value: DateUtil.getDateRange("thang_nay"),
      },
      {
        name: "reportType",
        value: "time",
      },
    ]);
    stored.searchData({});
    stored.loadSummary();
  }
  function TableProfit() {
    const results: SellReportType = Form.useWatch("reportType", searchFormRef);
    switch (results) {
      case "time":
        return <TableProfitByMoney stored={stored}></TableProfitByMoney>;
      case "bill":
        return <TableProfitByBill stored={stored}></TableProfitByBill>;
      case "product":
        return <TableProfitByProduct stored={stored}></TableProfitByProduct>;
      default:
        return <>-</>;
    }
  }

  const topAction: IActionBtn[] = [
    {
      content: (
        <>
          <Button onClick={() => navigate(-1)}>
            <Space>
              <ArrowLeftOutlined />
            </Space>
            {t("actionBtn.back")}
          </Button>
        </>
      ),
    },
    {
      content: (
        <Button
          type="primary"
          onClick={() => {
            stored.exportExcelPagedResult().then();
          }}
        >
          <Space>
            <ExportOutlined />
          </Space>
          {t("actionBtn.exportExcel")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageTopTitleAndAction
        usingCustom={true}
        mainTitle={t("titlePage")}
        items={[t("titlePageLvl1"), t("titlePageLvl2")]}
      >
        <TopAction topActions={topAction} />
      </PageTopTitleAndAction>

      <Form
        className={"ord-container-box"}
        form={searchFormRef}
        layout={"vertical"}
        onFinish={debounce((d) => {
          stored.searchData(d);
          stored.loadSummary();
        }, 250)}
      >
        <Row gutter={16}>
          <Col lg={8} md={12}>
            <FloatLabel label={t("rangeDate")}>
              <Form.Item name="rangeDate" className="flex-auto">
                <OrdDateRangeInput></OrdDateRangeInput>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col lg={4} md={12}>
            <FloatLabel label={t("reportTypeShow")}>
              <Form.Item name="reportType" className="flex-auto">
                <OrdSelect datasource={useSelectReportType()}></OrdSelect>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(8)}>
            <SearchFilterText onReset={onResetClick} span={24} />
          </Col>
        </Row>
      </Form>
      <div className={"ord-container-box"}>
        <TableProfit></TableProfit>
      </div>
    </>
  );
}
export default ReportSellProfit;

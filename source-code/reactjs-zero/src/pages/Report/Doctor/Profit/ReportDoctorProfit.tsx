import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row, Space } from "antd";
import React, { useEffect } from "react";
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
import { observer } from "mobx-react-lite";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import Utils from "@ord-core/utils/utils";
import TableDoctorProfitByMoney from "@pages/Report/Doctor/Profit/TableDoctorProfitByMoney";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { DoctorProfitReportType } from "@ord-store/Report/doctorProfitReportStore";
import TableDoctorProfitByBill from "./TableDoctorProfitByBill";
import TableDoctorProfitByProduct from "@pages/Report/Doctor/Profit/TableDoctorProfitByProduct";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

function ReportDoctorProfit() {
  const { doctorProfitReportStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
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
          value: "money",
        },
      ]);
      stored.loadSummary();
    }
  }, []);

  useHotkeys(
    "F3",
    (event) => {
      searchFormRef.submit();
      event.preventDefault();
    },
    { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true }
  );

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
        value: "money",
      },
    ]);
    stored.searchData({});
    stored.loadSummary();
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
            stored.exportExcelPagedResult().then((res) => {});
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
  const TableRevenue = () => {
    const results: DoctorProfitReportType = Form.useWatch(
      "reportType",
      searchFormRef
    );
    switch (results) {
      case "money":
        return (
          <TableDoctorProfitByMoney stored={stored}></TableDoctorProfitByMoney>
        );
      case "bill":
        return (
          <TableDoctorProfitByBill stored={stored}></TableDoctorProfitByBill>
        );
      case "product":
        return (
          <TableDoctorProfitByProduct
            stored={stored}
          ></TableDoctorProfitByProduct>
        );
      default:
        return <>-</>;
    }
  };
  const useSelectReportType = (): SelectDataSource => {
    const key = "FilterDoctorProfitReportType";
    return useSelectDataSource(key, async () => {
      return [
        {
          value: "money",
          label: t("reportType.money"),
          fts: Utils.toLowerCaseNonAccentVietnamese(t("reportType.money")),
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
  const filterPlHolder = () => {
    const w_type = Form.useWatch(
      "reportType",
      searchFormRef
    ) as DoctorProfitReportType;
    switch (w_type) {
      case "money":
        return t("filterByDoctor");
      case "bill":
        return t("filterByBill");
      case "product":
        return t("filterByProduct");
    }
  };
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
                <OrdDateRangeInput allowEq></OrdDateRangeInput>
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
          <Col {...useResponsiveSpan(9)}>
            <SearchFilterText span={24} placeHolder={filterPlHolder()} onReset={()=>onResetClick()}/>
          </Col>
        </Row>
      </Form>
      <TableRevenue></TableRevenue>
    </>
  );
}

export default observer(ReportDoctorProfit);

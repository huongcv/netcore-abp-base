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
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import TableDoctorRevenueByProduct from "@pages/Report/Doctor/Revenue/TableDoctorRevenueByProduct";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

function ReportDoctorProduct() {
  const { doctorProductReportStore: stored } = useStore();
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
          value: "product",
        },
      ]);
      stored.loadSummary();
    }
  }, []);

  useHotkeys(
    "F3",
    (event) => {
      event.preventDefault();
      const input = document.querySelector(
        'input[placeholder="' + t('filterByProduct') + '"]'
      ) as HTMLInputElement;

      if (input) {
        input.focus();
      }
      searchFormRef.submit();
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
        value: "product",
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
          <Col lg={4} md={12} hidden>
            <FloatLabel label={t("reportTypeShow")}>
              <Form.Item name="reportType" className="flex-auto">
                <Input />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(9)}>
            <SearchFilterText onReset={onResetClick} span={24} placeHolder={t("placeholderFilter")} />
          </Col>
        </Row>
      </Form>
      <TableDoctorRevenueByProduct
        stored={stored}
      ></TableDoctorRevenueByProduct>
    </>
  );
}

export default observer(ReportDoctorProduct);

import React, { useEffect, useRef } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {
  ArrowLeftOutlined,
  ExportOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { observer } from "mobx-react-lite";
import { TopAction } from "@ord-components/crud/TopAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useNavigate } from "react-router-dom";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import Utils from "@ord-core/utils/utils";
import DateUtil from "@ord-core/utils/date.util";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { DailySummaryProductReportOutputDto } from "@api/index.defs";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { OpenOrCloseSaleWorkShiftForm } from "@pages/WorkShift/ShopWorkShift/Form/openOrCloseSaleWorkShiftForm";

function ReportDailySummaryShiftRevenue() {
  const { reportDailySummaryShiftRevenueStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const { t: tCommon } = useTranslation("common");
  const [searchFormRef] = Form.useForm();
  useEffect(() => {
    if (stored) {
      searchFormRef.setFields([
        {
          name: "reportDate",
          value: new Date(),
        },
      ]);
      stored.setSearchFormRef(searchFormRef);
      stored.loadSummary();
    }
  }, []);
  const formatterNumber = Utils.formatterNumber;

  useHotkeys(
    "F3",
    (event) => {
      event.preventDefault();
      const input = document.querySelector(
        'input[placeholder="' + tCommon("filterSearch") + '"]'
      ) as HTMLInputElement;

      if (input) {
        input.focus();
      }
      searchFormRef.submit();
    },
    { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true }
  );

  const columns: TableColumnsType<any> = TableUtil.getColumns(
    [
      {
        dataIndex: "name",
        width: "120px",
        title: "name",
      },
      {
        dataIndex: "openingEmployeeName",
        title: "employeeName",
        width: "200px",
      },
      {
        dataIndex: "fromDate",
        title: "Thời gian",
        width: "280px",
        align: "center",
        render: (text, dto) => {
          return (
            <>
              {DateUtil.toFormat(dto.startDate)} -{" "}
              {DateUtil.toFormat(dto.endDate || undefined)}
            </>
          );
        },
      },
      {
        dataIndex: "openingCash",
        title: "openingCash",
        align: "right",
        render: (v) => <PriceCell value={v} />,
        width: "150px",
      },
      {
        dataIndex: "totalCash",
        title: "totalCash",
        align: "right",
        render: (v) => <PriceCell value={v} />,
        width: "150px",
      },
      {
        dataIndex: "totalBank",
        title: "totalBank",
        align: "right",
        render: (v) => <PriceCell value={v} />,
        width: "150px",
      },
      {
        dataIndex: "totalOther",
        title: "totalOther",
        align: "right",
        render: (v) => <PriceCell value={v} />,
        width: "150px",
      },
      {
        dataIndex: "invoiceAmount",
        title: "receiptAmount",
        align: "right",
        width: "150px",
        render: (text, dto) => {
          return (
            <>
              <div>
                <PriceCell value={dto.invoiceAmount} />
              </div>
            </>
          );
        },
      },
      {
        dataIndex: "otherReceiptAmount",
        title: "otherReceiptAmount",
        align: "right",
        render: (v) => <PriceCell value={v} />,
        width: "120px",
      },
      {
        dataIndex: "otherPaymentAmount",
        title: "otherPaymentAmount",
        align: "right",
        render: (v) => <PriceCell value={v} />,
        width: "120px",
      },
      {
        dataIndex: "closingCash",
        title: "closingCash",
        align: "right",
        render: (v) => <PriceCell value={v} />,
        width: "150px",
      },
    ],
    {
      actions: [
        {
          title: "edit",
          hiddenIf: (d) => true,
        },
      ],
      viewAction: (d: any) => {
        openClosingForm(d);
      },
      ns: stored.getNamespaceLocale(),
    }
  );
  const navigate = useNavigate();

  const closingFormRef = useRef();
  const openClosingForm = (d: any) => {
    // @ts-ignore
    closingFormRef.current.showModal(d)
  }

  function onResetClick() {
    searchFormRef.resetFields();
    searchFormRef.setFields([
      {
        name: "reportDate",
        value: new Date(),
      },
    ]);
    stored.searchData({});
    stored.loadSummary();
  }

  const topAction: IActionBtn[] = [
    {
      title: t("actionBtn.ReasonType"),
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
            stored.exportExcelPagedResult().then((res) => { });
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
  const { summaryData } = stored;

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
          console.log("d", d);
          stored.searchData(d);
          stored.loadSummary();
        }, 250)}
      >
        <Row gutter={16}>
          <Col lg={8} md={12}>
            <FloatLabel label={t("reportDate")}>
              <Form.Item name="reportDate" className="flex-auto">
                <OrdDateInput></OrdDateInput>
              </Form.Item>
            </FloatLabel>
          </Col>
          <SearchFilterText onReset={onResetClick} span={12} ></SearchFilterText>
        </Row>
      </Form>
      <OpenOrCloseSaleWorkShiftForm ref={closingFormRef} />
      <div className="ord-container-box">
        <AntTableWithDataPaged
          searchForm={searchFormRef}
          getPageResult={(d) => {
            return stored.apiService().getPaged(
              {
                body: {
                  ...d.body,
                },
              },
              {}
            );
          }}

          summary={(pageData) => {
            return (
              <Table.Summary fixed="top">
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4} align="left">
                    <strong className="">{t("total")}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={5}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.openingCash)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={6}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.totalRevenuePaymentCash)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={6}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.totalRevenuePaymentBank)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={6}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.totalRevenuePaymentOther)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={6}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.invoiceAmount)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={7}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.otherReceiptAmount)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={8}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.otherPaymentAmount)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={9}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.closingCash)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={10}
                    align="right"
                    className="font-bold !pr-1.5"
                  > </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
          columns={columns}
          searchData={stored.searchDataState}
          refreshDatasource={stored.refreshDataState}
        />
      </div>
    </>
  );
}

export default observer(ReportDailySummaryShiftRevenue);

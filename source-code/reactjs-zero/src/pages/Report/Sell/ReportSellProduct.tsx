import React, { useEffect } from "react";
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
import {
  SellReportProductOutputDto,
  SellReportRevenueDetailOutputDto,
} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import DateUtil from "@ord-core/utils/date.util";
import {
  ArrowLeftOutlined,
  ExportOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { observer } from "mobx-react-lite";
import { TopAction } from "@ord-components/crud/TopAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useNavigate } from "react-router-dom";
import { withDataTableFetching } from "@ord-core/hoc/withDataTableFetching";
import { TableProps } from "antd/es/table/InternalTable";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import Utils from "@ord-core/utils/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import "./Sell.scss";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { useSelectProductType } from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import OrdSelect from "@ord-components/forms/select/OrdSelect";

function ReportSellProduct() {
  const { reportSellProductStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const { t: tCommon } = useTranslation("common");
  const [searchFormRef] = Form.useForm();
  const productTypeCombo = useSelectProductType();

  useEffect(() => {
    if (stored) {
      searchFormRef.setFields([
        {
          name: "rangeDate",
          value: DateUtil.getDateRange("thang_nay"),
        },
      ]);
      stored.setSearchFormRef(searchFormRef);
      stored.loadSummary();
    }
  }, []);
  const formatterNumber = Utils.formatterNumber;

  const columns: TableColumnsType<any> = TableUtil.getColumns(
    [
      {
        title: "productCode",
        dataIndex: "productCode",
        width: 130,
        fixed: "left",
        className: "overide-ant-col-fixed-left",
        // align:'center',
        render: (data: string, record: SellReportRevenueDetailOutputDto) => {
          return <strong>{data}</strong>;
        },
        sorter: false,
      },
      {
        title: "productName",
        dataIndex: "productName",
        width: 250,
        render: (data: string, record: SellReportProductOutputDto) => {
          return (
            <>
              <TextLineClampDisplay content={data} />{" "}
            </>
          );
        },
      },
      {
        title: "basicUnitName",
        dataIndex: "basicUnitName",
        width: 70,
      },
      {
        title: "qtyConvert",
        dataIndex: "qtyConvert",
        align: "center",
        width: 100,
        render: (data: string, record: SellReportProductOutputDto) => {
          return <span>{formatterNumber(record.qtyConvert ?? 0, 0)}</span>;
        },
      },

      {
        dataIndex: "totalPrice",
        title: "totalPrice",
        align: "right",
        width: 150,
        render: (data: string, record: SellReportProductOutputDto) => {
          return (
            <span>{formatterNumber(record.totalPriceBeforeTax ?? 0, 0)}</span>
          );
        },
      },

      {
        title: "discount",
        width: 150,
        align: "right",
        render: (data: string, record: SellReportProductOutputDto) => {
          return <>{formatterNumber(record.totalDiscountAmount ?? 0, 0)}</>;
        },
      },
      {
        dataIndex: "taxAmount",
        title: "taxAmount",
        align: "right",
        width: 150,
        render: (data: string, record: SellReportProductOutputDto) => {
          return <>{formatterNumber(record.taxAmount ?? 0, 0)}</>;
        },
      },
      {
        title: "returnQtyConvert",
        dataIndex: "returnQtyConvert",
        align: "center",
        width: 80,
        render: (data: string, record: SellReportProductOutputDto) => {
          return (
            <span>{formatterNumber(record.returnQtyConvert ?? 0, 0)}</span>
          );
        },
      },
      {
        dataIndex: "returnTotalAmount",
        title: "returnTotalAmount",
        align: "right",
        width: 150,
        render: (data: string, record: SellReportProductOutputDto) => {
          return <span>{formatterNumber(record.returnTotalAmount, 0)}</span>;
        },
      },
      {
        dataIndex: "revenueAmount",
        title: "revenueAmount",
        align: "right",
        width: 150,
        render: (data: string, record: SellReportProductOutputDto) => {
          return (
            <strong>{formatterNumber(record.revenueAmount ?? 0, 0)}</strong>
          );
        },
      },
    ],
    {
      ns: stored.getNamespaceLocale(),
    }
  );
  const navigate = useNavigate();

  function onResetClick() {
    searchFormRef.resetFields();
    searchFormRef.setFields([
      {
        name: "rangeDate",
        value: DateUtil.getDateRange("thang_nay"),
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
            <FloatLabel label={t("rangeDate")}>
              <Form.Item name="rangeDate" className="flex-auto">
                <OrdDateRangeInput></OrdDateRangeInput>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(4)}>
            <FloatLabel label={t("type")}>
              <Form.Item name="productTypeId">
                <OrdSelect allowClear datasource={productTypeCombo} />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(12)}>
            <SearchFilterText onReset={onResetClick} span={24} />
          </Col>
        </Row>
      </Form>
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
                    align="center"
                    className="font-bold "
                  >
                    {formatterNumber(summaryData?.qtyConvert ?? 0, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={6}
                    align="right"
                    className="font-bold  !pr-1.5"
                  >
                    {formatterNumber(summaryData?.totalPriceBeforeTax, 0)}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell
                    index={8}
                    align="right"
                    className="font-bold  !pr-1.5"
                  >
                    {formatterNumber(summaryData?.totalDiscountAmount, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={7}
                    align="right"
                    className="font-bold  !pr-1.5"
                  >
                    {formatterNumber(summaryData?.taxAmount, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={9}
                    align="center"
                    className="font-bold "
                  >
                    {formatterNumber(summaryData?.returnQtyConvert ?? 0, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={10}
                    align="right"
                    className="font-bold  !pr-1.5"
                  >
                    {formatterNumber(summaryData?.returnTotalAmount ?? 0, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={11}
                    align="right"
                    className="font-bold  !pr-1.5"
                  >
                    {formatterNumber(summaryData?.revenueAmount ?? 0, 0)}
                  </Table.Summary.Cell>
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

export default observer(ReportSellProduct);

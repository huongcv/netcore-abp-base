import React, { useEffect } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import {
  PharmacyLogReportDrugStockInOutOutputDto,
  PharmacyLogReportPageListDrugStockInOutOutputDto,
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
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectIsActived } from "@ord-components/forms/select/selectDataSource/useSelectIsActived";
import { useSelectStock } from "@ord-components/forms/select/selectDataSource/useSelectStock";
import Utils from "@ord-core/utils/utils";
import DateCell from "@ord-components/table/cells/DateCell";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";

function ReportPharmacyLogDrugStockInOut() {
  const { reportPharmacyLogDrugStockInOutStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const [searchFormRef] = Form.useForm();
  useEffect(() => {
    if (stored) {
      searchFormRef.setFields([
        {
          name: "rangeDate",
          value: DateUtil.getDateRange("thang_nay"),
        },
      ]);
      stored.setSearchFormRef(searchFormRef);
    }
  }, []);

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

  const columns: TableColumnsType<any> = TableUtil.getColumns(
    [
      {
        title: "productCode",
        dataIndex: "productCode",
        width: 100,
      },
      {
        title: "productName",
        dataIndex: "productName",
        width: 200,
        render: (text) => <TextLineClampDisplay content={text} />,
      },
      {
        title: "lotNumber",
        dataIndex: "lotNumber",
        align: "center",
        width: 100,
      },
      {
        title: "expiryDate",
        dataIndex: "expiryDate",
        align: "center",
        width: 120,
        render: (_, __: PharmacyLogReportDrugStockInOutOutputDto) =>
          _ ? (
            <>
              {__.status == 3 && (
                <Badge color="red" text={<DateCell date={_} />} />
              )}
              {__.status == 2 && (
                <Badge color="gold" text={<DateCell date={_} />} />
              )}
              {__.status == 1 && (
                <Badge color="green" text={<DateCell date={_} />} />
              )}
            </>
          ) : (
            "-"
          ),
      },
      {
        title: "basicUnitName",
        dataIndex: "basicUnitName",
        width: 70,
        align: "center",
      },
      {
        title: "qty",
        children: [
          {
            title: (
              <div className="text-center">{t("beginningBalanceQty")}</div>
            ),
            dataIndex: "beginningBalanceQty",
            align: "right",
            width: 100,
            render: (value) => <>{formatterNumber(value ?? 0, 0)}</>,
          },
          {
            title: <div className="text-center">{t("importQty")}</div>,
            dataIndex: "importQty",
            width: 100,
            align: "right",
            render: (value) => <>{formatterNumber(value ?? 0, 0)}</>,
          },
          {
            title: <div className="text-center">{t("returnsQty")}</div>,
            dataIndex: "returnsQty",
            width: 140,
            align: "right",
            render: (value) => <>{formatterNumber(value ?? 0, 0)}</>,
          },
          {
            title: <div className="text-center">{t("inventoryCheckQty")}</div>,
            dataIndex: "inventoryCheckQty",
            width: 100,
            align: "right",
            render: (value) => <>{formatterNumber(value ?? 0, 0)}</>,
          },

          {
            title: <div className="text-center">{t("exportQty")}</div>,
            dataIndex: "exportQty",
            align: "right",
            width: 100,
            render: (value) => <>{formatterNumber(value ?? 0, 0)}</>,
          },
          {
            title: <div className="text-center">{t("endingBalanceQty")}</div>,
            dataIndex: "endingBalanceQty",
            align: "right",
            width: 100,
            render: (value) => <>{formatterNumber(value ?? 0, 0)}</>,
          },
        ],
      },
    ],
    {
      ns: stored.getNamespaceLocale(),
    }
  );

  const formatterNumber = Utils.formatterNumber;
  const DataTable = (props: any) => {
    const { currentPageResult: summaryData } = stored as {
      currentPageResult: PharmacyLogReportPageListDrugStockInOutOutputDto;
    };
    return (
      <>
        <Table
          {...props}
          bordered={true}
          scroll={{ x: "max-content" }}
          tableLayout="auto"
          pagination={false}
          summary={(pageData) => {
            return (
              <Table.Summary fixed="top">
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={6} align="left">
                    <strong className="">{t("total")}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={6}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.beginningBalanceQty, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={7}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.importQty, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={8}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.returnsQty, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={9}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.inventoryCheckQty, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={10}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.exportQty, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={11}
                    align="right"
                    className="font-bold !pr-1.5"
                  >
                    {formatterNumber(summaryData?.endingBalanceQty, 0)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
          sticky={{ offsetHeader: 1 }}
        />
        <div
          className={
            "custom-pagination mt-3 flex flex-wrap items-center justify-between"
          }
        >
          <div className="text-right mb-2">
            <Badge className="mr-1.5" color="green" text={t("inGoodUse")} />
            <Badge className="mr-1.5" color="gold" text={t("nearExpiration")} />
            <Badge color="red" text={t("expired")} />
          </div>
          <div className="flex items-center">
            <Pagination
              onChange={props.onChangePaginationSummary}
              {...props.pagination}
              showSizeChanger
            />
          </div>
        </div>
      </>
    );
  };
  const TableData = withDataTableFetching<any>(DataTable);

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
        }, 250)}
      >
        <Row gutter={16}>
          <Col lg={8} md={12}>
            <FloatLabel label={t("rangeDate")}>
              <Form.Item name="rangeDate" className="flex-auto">
                <OrdDateRangeInput allowClear={false}></OrdDateRangeInput>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col lg={4} md={12}>
            <FloatLabel label={t("isActived")}>
              <Form.Item name="isActived" className="flex-auto">
                <OrdSelect
                  allowClear
                  datasource={useSelectIsActived()}
                ></OrdSelect>
              </Form.Item>
            </FloatLabel>
          </Col>
          {/* <Col lg={4} md={12}>
            <FloatLabel label={t("inventoryId")}>
              <Form.Item name="inventoryId" className="flex-auto">
                <OrdSelect allowClear datasource={useSelectStock()}></OrdSelect>
              </Form.Item>
            </FloatLabel>
          </Col> */}
          <Col {...useResponsiveSpan(12)}>
            <SearchFilterText onReset={onResetClick} span={24} />
          </Col>
        </Row>
      </Form>
      <div className="ord-container-box">
        <TableData
          searchForm={stored.searchFormRef}
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
          onChangePageResult={(d) => {
            if (stored) {
              stored.setPageResult(d);
            }
          }}
          columns={columns}
          searchData={stored.searchDataState}
          refreshDatasource={stored.refreshDataState}
        />
      </div>
    </>
  );
}

export default observer(ReportPharmacyLogDrugStockInOut);

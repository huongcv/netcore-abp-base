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
import { StockDisposalReportPagingOutputDto } from "@api/index.defs";
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
import { useSelectStock } from "@ord-components/forms/select/selectDataSource/useSelectStock";
import Utils from "@ord-core/utils/utils";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

function ReportStockDisposalReport() {
  const { reportStockDisposalReportStore: stored } = useStore();
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
  const formatterNumber = Utils.formatterNumber;

  const columns: TableColumnsType<any> = TableUtil.getColumns(
    [
      {
        title: "productCode",
        dataIndex: "productCode",
        width: 80,
      },
      {
        title: "productName",
        dataIndex: "productName",
        width: 500,
        render: (text) => <TextLineClampDisplay content={text}/> 
      },
      {
        title: "basicUnitName",
        dataIndex: "basicUnitName",
        width: 70,
        align: "center",
      },
      {
        title: "numberOfDestruction",
        dataIndex: "numberOfDestruction",
        width: 100,
        align: "center",
      },
      {
        title: "valueOfDestruction",
        dataIndex: "valueOfDestruction",
        width: 100,
        align: "right",
        render: (value: number) => {
          return formatterNumber(value, 0);
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
  const { currentPageResult: summaryData } = stored as {
    currentPageResult: StockDisposalReportPagingOutputDto;
  };


  return (
      <>
        <PageTopTitleAndAction
            usingCustom={true}
            mainTitle={t("titlePage")}
            items={[t("titlePageLvl1"), t("titlePageLvl2")]}
        >
          <TopAction topActions={topAction}/>
        </PageTopTitleAndAction>
        <Form
            className={"ord-container-box"}
            form={searchFormRef}
            layout={"vertical"}
            onFinish={debounce((d) => {
              stored.searchData(d);
            }, 250)}
        >
          <Row gutter={16}>
            <Col lg={12} md={12}>
              <FloatLabel label={t("rangeDate")}>
                <Form.Item name="rangeDate" className="flex-auto">
                  <OrdDateRangeInput allowClear={false}></OrdDateRangeInput>
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
              onChangePageResult={(d) => {
                if (stored) {
                  stored.setPageResult(d);
                }
              }}
              summary={(pageData) => {
                return (
                    <Table.Summary fixed="top">
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={4} align="left">
                          <strong className="">{t("total")}</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell
                            index={6}
                            align="center"
                            className="font-bold  !pr-1.5"
                        >
                          {summaryData?.numberOfDestruction}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell
                            index={7}
                            align="right"
                            className="font-bold  !pr-1.5"
                        >
                          {formatterNumber(summaryData?.valueOfDestruction, 0)}
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

export default observer(ReportStockDisposalReport);

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
import { StockReportPageListImportExportInventoryOutputDto } from "@api/index.defs";
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
import ReportStockCommodityPlanStore from "@ord-store/Report/ReportStockCommodityPlanStore";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import TopTableFilter, {
  ITopTableFilterData,
} from "@ord-components/table/TopTableFilter";
import { useSelectProductType } from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import { SelectAddNewProductGroup } from "@ord-components/forms/select/addNewEntityAfterForm/selectAddNewProductGroup";
import Utils from "@ord-core/utils/utils";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";

function ReportStockCommodityPlan() {
  const { reportStockCommodityPlanStore: stored } = useStore();
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
        width: 400,
        render: (text) => <TextLineClampDisplay content={text}/> 
      },
      {
        title: "basicUnitName",
        dataIndex: "basicUnitName",
        align: "center",
        width: 80,
      },
      {
        title: "inventoryQtyMax",
        dataIndex: "inventoryQtyMax",
        align: "center",
        width: 120,
      },
      {
        title: "inventoryQty",
        dataIndex: "inventoryQty",
        align: "center",
        width: 120,
      },
      {
        title: "forecast",
        dataIndex: "forecast",
        align: "center",
        width: 120,
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
          console.log("d", d);
          stored.searchData(d);
        }, 250)}
      >
        <Row gutter={16}>
          <Col {...useResponsiveSpan(4)}>
            <FloatLabel label={t("productType")}>
              <Form.Item name="productType">
                <OrdSelect datasource={useSelectProductType()} />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(8)}>
            <FloatLabel label={t("productGroup")}>
              <Form.Item name="listProductGroup">
                <SelectAddNewProductGroup hiddenAddNew={true} />
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
          columns={columns}
          searchData={stored.searchDataState}
          refreshDatasource={stored.refreshDataState}
        />
      </div>
    </>
  );
}

export default observer(ReportStockCommodityPlan);

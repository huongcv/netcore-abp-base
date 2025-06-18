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
  TableColumnsType,
  TableProps,
} from "antd";
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
import { observer } from "mobx-react-lite";
import { TopAction } from "@ord-components/crud/TopAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useNavigate } from "react-router-dom";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectStock } from "@ord-components/forms/select/selectDataSource/useSelectStock";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { useSelectProductType } from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import { SelectAddNewProductGroup } from "@ord-components/forms/select/addNewEntityAfterForm/selectAddNewProductGroup";
import Utils from "@ord-core/utils/utils";
import { useSelectProductPriceList } from "@ord-components/forms/select/selectDataSource/useSelectProductPriceList";
import DateCell from "@ord-components/table/cells/DateCell";
import { PharmacyLogReportMedicationSalesOutputDto } from "@api/index.defs";
import { PharmacyLogReportMedicationSalesFlatDto } from "@ord-store/Report/PharmacyLogMedicationSalesReportStore";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { HotKeyScope } from "@ord-core/AppConst";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

function ReportMedicationSales() {
  const { reportPharmacyLogMedicationSalesStore: stored } = useStore();
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
  const sharedOnCell = (
    _: PharmacyLogReportMedicationSalesFlatDto,
    index?: number
  ) => {
    return { rowSpan: _.rowSpan };
  };

  const formatValue = (val: any) => {
    if (val === true || val === "true") return t("yes");
    if (val === false || val === "false") return t("no");
    if (val === 1 || val === "1") return t("yes");
    if (val === 0 || val === "0") return t("no");
    if (val === "") return "";
    return val;
  };

  const columns: TableProps<PharmacyLogReportMedicationSalesFlatDto>["columns"] =
    [
      {
        title: t("order"),
        dataIndex: "order",
        key: "order",
        width: 50,
        onCell: sharedOnCell,
      },
      {
        title: t("moveDate"),
        dataIndex: "moveDate",
        key: "moveDate",
        width: 130,
        onCell: sharedOnCell,
        render: (_) => <DateCell date={_} format="DD/MM/YYYY HH:mm"></DateCell>,
      },
      {
        title: t("moveCode"),
        dataIndex: "moveCode",
        width: 90,
        key: "moveCode",
        onCell: sharedOnCell,
      },
      {
        title: t("partnerName"),
        width: 130,
        dataIndex: "partnerName",
        key: "partnerName",
        onCell: sharedOnCell,
      },
      {
        title: t("productName"),
        width: 170,
        dataIndex: "productName",
        key: "productName",
        render: (text) => <TextLineClampDisplay content={text} />,
      },
      {
        width: 100,
        title: t("lotNumber"),
        dataIndex: "lotNumber",
        key: "lotNumber",
      },
      {
        width: 120,
        title: t("expiryDate"),
        dataIndex: "expiryDate",
        key: "expiryDate",
        align: "center",
        render: (_) =>
          _ ? <DateCell date={_} format="DD/MM/YYYY"></DateCell> : "-",
      },

      {
        width: 200,
        title: t("productExtendInfo"),
        dataIndex: "productExtendInfo",
        key: "productExtendInfo",
        render: (info) =>
          info && Object.keys(info).length > 0 ? (
            <ul>
              {Object.entries(info).map(([key, val]) => (
                // @ts-ignore
                <li key={key}>
                  <strong>{t(key)}:</strong> {formatValue(val)}
                </li>
              ))}
            </ul>
          ) : (
            <>{t("notInfo")}</>
          ),
      },
      {
        width: 100,
        title: t("basicUnitName"),
        dataIndex: "basicUnitName",
        key: "basicUnitName",
        align: "center",
      },
      {
        width: 120,
        title: t("qtyImport"),
        dataIndex: "qtyImport",
        key: "qtyImport",
        align: "center",
      },
      {
        width: 120,
        title: t("qtyExport"),
        dataIndex: "qtyExport",
        key: "qtyExport",
        align: "center",
      },
    ];

  // const columns: TableColumnsType<PharmacyLogReportMedicationSalesFlatDto> = TableUtil.getColumns([
  //
  // ], {
  //
  //     ns: stored.getNamespaceLocale()
  // });
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
          <Col lg={12} md={12}>
            <FloatLabel label={t("rangeDate")}>
              <Form.Item name="rangeDate" className="flex-auto">
                <OrdDateRangeInput></OrdDateRangeInput>
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
          bordered={true}
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

export default observer(ReportMedicationSales);

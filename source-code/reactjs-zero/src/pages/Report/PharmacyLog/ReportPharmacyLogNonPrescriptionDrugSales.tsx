import React, { useEffect } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row, Space, TableProps } from "antd";
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
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import DateCell from "@ord-components/table/cells/DateCell";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { PharmacyLogReportNonPrescriptionDrugSalesFlatDto } from "@ord-store/Report/PharmacyLogNonPrescriptionDrugSalesReportStore";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { useSelectProductType } from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

function ReportPharmacyLogNonPrescriptionDrugSales() {
  const { reportPharmacyLogNonPrescriptionDrugSalesStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const { t: tEnum } = useTranslation("enum");
  const [searchFormRef] = Form.useForm();
  const productTypeCombo = useSelectProductType();
  
  useEffect(() => {
    if (stored) {
      searchFormRef.setFields([
        {
          name: "rangeDate",
          value: DateUtil.getDateRange("thang_nay"),
        },
        {
          name: "type",
          value: 1,
        },
      ]);
      stored.setSearchFormRef(searchFormRef);
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

  const sharedOnCell = (
    _: PharmacyLogReportNonPrescriptionDrugSalesFlatDto,
    index?: number
  ) => {
    return { rowSpan: _.rowSpan };
  };
  const columns: TableProps<PharmacyLogReportNonPrescriptionDrugSalesFlatDto>["columns"] =
    [
      {
        title: t("order"),
        dataIndex: "order",
        key: "order",
        width: 50,
        onCell: sharedOnCell,
      },
      {
        title: t("invoiceCode"),
        dataIndex: "invoiceCode",
        width: 100,
        key: "invoiceCode",
        onCell: sharedOnCell,
      },
      {
        title: t("invoiceDate"),
        dataIndex: "invoiceDate",
        key: "invoiceDate",
        width: 120,
        onCell: sharedOnCell,
        render: (_) => <DateCell date={_} format="DD/MM/YYYY HH:mm"></DateCell>,
      },
      {
        title: t("productName"),
        width: 170,
        dataIndex: "productName",
        key: "productName",
        render: (text) => <TextLineClampDisplay content={text}/> 
      },
      {
        width: 80,
        title: t("activeIngredient"),
        dataIndex: "activeIngredient",
        key: "activeIngredient",
        align: "center",
      },
      {
        width: 80,
        title: t("strength"),
        dataIndex: "strength",
        key: "strength",
        align: "center",
      },
      {
        width: 100,
        title: t("qty"),
        dataIndex: "qty",
        key: "qty",
        align: "center",
        render: (_, __) => {
          return (
            <>
              {__.qty} {__.basicUnitName}
            </>
          );
        },
      },
      {
        width: 100,
        title: t("note"),
        dataIndex: "note",
        key: "note",
        align: "center",
      },
    ];

  const navigate = useNavigate();

  function onResetClick() {
    searchFormRef.resetFields();
    searchFormRef.setFields([
      {
        name: "rangeDate",
        value: DateUtil.getDateRange("thang_nay"),
      },
      {
        name: "type",
        value: 1,
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

  const sourceFilterBy = () => {
    return useSelectDataSource("filterPharmacyLog", async () => {
      return [
        {
          value: 1,
          label: t("filterPharmacyLog.sale"),
        },
        {
          value: 2,
          label: t("filterPharmacyLog.prescription"),
        },
      ];
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F3") {
        event.preventDefault();
        event.stopPropagation();

        const input = document.querySelector(
          'input[placeholder="' + t("placeholderFilter") + '"]'
        ) as HTMLInputElement;

        if (input) {
          input.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
        }, 250)}
      >
        <Row gutter={16}>
          <Col {...useResponsiveSpan(8)}>
            <FloatLabel label={t("rangeDate")}>
              <Form.Item name="rangeDate" className="flex-auto">
                <OrdDateRangeInput></OrdDateRangeInput>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(4)}>
            <FloatLabel label={t("type")}>
                <Form.Item name="productTypeId">
                    <OrdSelect allowClear datasource={productTypeCombo}/>
                </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(4)}>
            <FloatLabel label={t("filterProduct")}>
              <Form.Item name="filterProduct" className="flex-auto">
                <Input placeholder={t("placeholderFilterProduct")}></Input>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(8)}>
            <SearchFilterText onReset={onResetClick} span={24} placeHolder={t("placeholderFilter")} />
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

export default observer(ReportPharmacyLogNonPrescriptionDrugSales);

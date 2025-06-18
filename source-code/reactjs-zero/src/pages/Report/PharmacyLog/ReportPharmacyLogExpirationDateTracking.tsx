import React, { useEffect } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  TableColumnsType,
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
import { useSelectIsActived } from "@ord-components/forms/select/selectDataSource/useSelectIsActived";
import { useSelectStock } from "@ord-components/forms/select/selectDataSource/useSelectStock";
import Utils from "@ord-core/utils/utils";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import OrdYearInput from "@ord-components/forms/OrdYearInput";
import { PharmacyLogReportExpirationDateTrackingOutputDto } from "@api/index.defs";
import { useHotkeys } from "react-hotkeys-hook";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";

function ReportPharmacyLogExpirationDateTracking() {
  const { reportPharmacyLogExpirationDateTrackingStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const [searchFormRef] = Form.useForm();
  useEffect(() => {
    if (stored) {
      searchFormRef.setFields([
        {
          name: "year",
          value: DateUtil.getNow().getFullYear(),
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
        name: "year",
        value: DateUtil.getNow().getFullYear(),
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
        width: 90,
      },
      {
        title: "productName",
        dataIndex: "productName",
        width: 200,
        render: (text) => <TextLineClampDisplay content={text}/> 
      },
      {
        title: "lotNumber",
        dataIndex: "lotNumber",
        align: "center",
        width: 100,
      },

      {
        title: "qty",
        dataIndex: "qty",
        width: 90,
        align: "center",
      },
      {
        title: "basicUnitName",
        dataIndex: "basicUnitName",
        width: 70,
        align: "center",
      },
      {
        title: t("expiryInYear", {
          year: Form.useWatch("year", searchFormRef),
        }),
        align: "center",
        children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x) => {
          return {
            title: x,
            width: 40,
            align: "center",
            render: (_: PharmacyLogReportExpirationDateTrackingOutputDto) =>
              _.monthInYear == x ? "x" : "",
          };
        }),
      },
    ],
    {
      ns: stored.getNamespaceLocale(),
    }
  );

  const formatterNumber = Utils.formatterNumber;
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
              <Form.Item name={"year"} className="flex-auto">
                <OrdYearInput allowClear={false} />
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

export default observer(ReportPharmacyLogExpirationDateTracking);

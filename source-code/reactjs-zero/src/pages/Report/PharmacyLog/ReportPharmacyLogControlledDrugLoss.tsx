import React, { useEffect } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  TableColumnsType,
} from "antd";
import { PharmacyLogReportControlledDrugLossOutputDto } from "@api/index.defs";
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
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectIsActived } from "@ord-components/forms/select/selectDataSource/useSelectIsActived";
import { useSelectStock } from "@ord-components/forms/select/selectDataSource/useSelectStock";
import DateCell from "@ord-components/table/cells/DateCell";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

function ReportPharmacyLogControlledDrugLoss() {
  const { reportPharmacyLogControlledDrugLossStore: stored } = useStore();
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
        width: 180,
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
        width: 100,
        render: (_, __: PharmacyLogReportControlledDrugLossOutputDto) =>
          _ ? <DateCell format="DD/MM/YYYY" date={_} /> : "-",
      },
      {
        title: "basicUnitName",
        dataIndex: "basicUnitName",
        width: 70,
        align: "center",
      },
      {
        title: <div className="text-center">{t("errorLoss")}</div>,
        dataIndex: "errorLoss",
        width: 130,
        align: "right",
      },
      {
        title: "moveDate",
        dataIndex: "moveDate",
        align: "center",
        width: 120,
        render: (_, __: PharmacyLogReportControlledDrugLossOutputDto) =>
          _ ? <DateCell format="DD/MM/YYYY HH:mm" date={_} /> : "-",
      },
    ],
    {
      ns: stored.getNamespaceLocale(),
    }
  );

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
          <Col lg={10} md={12}>
            <FloatLabel label={t("rangeDate")}>
              <Form.Item name="rangeDate" className="flex-auto">
                <OrdDateRangeInput allowClear={false}></OrdDateRangeInput>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(14)}>
            <SearchFilterText onReset={onResetClick} span={24} placeHolder={t("filterPlaceholder")} />
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

export default observer(ReportPharmacyLogControlledDrugLoss);

import React, { useEffect } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row, Space, TableColumnsType } from "antd";
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
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import TopTableFilter, {
  ITopTableFilterData,
} from "@ord-components/table/TopTableFilter";
import Utils from "@ord-core/utils/utils";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

function ReportStockCommodityExpiry() {
  const { reportStockCommodityExpiryStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const [searchFormRef] = Form.useForm();
  useEffect(() => {
    stored.setStatus(-1);
    if (stored) {
      searchFormRef.setFields([
        {
          name: "expiryDay",
          value: DateUtil.getNow(),
        },
      ]);
      stored.setSearchFormRef(searchFormRef);
      // stored.setSummary();
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
        width: 200,
        render: (text) => <TextLineClampDisplay content={text} />,
      },
      {
        title: "lotNumber",
        dataIndex: "lotNumber",
        width: 70,
        align: "center",
      },
      {
        title: "basicUnitName",
        dataIndex: "basicUnitName",
        width: 70,
        align: "center",
      },

      {
        title: "qty",
        dataIndex: "qty",
        width: 70,
        align: "center",
      },
      {
        title: "expiryDate",
        dataIndex: "expiryDate",
        width: 70,
        align: "center",
        render: (value: any) => {
          return DateUtil.toFormat(value, "DD/MM/YYYY");
        },
      },
      {
        title: stored.status === 3 ? "outOfDate" : "daysRemaining",
        dataIndex: "daysRemaining",
        width: 100,
        align: "center",
        render: (value: number) => {
          if (value > 0) return value + " " + t("days");
          else
            return (
              <span className="text-red-500">{value + " " + t("days")}</span>
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
        name: "expiryDay",
        value: DateUtil.getNow(),
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
            if (stored.status === 3) {
              stored
                .exportReportForDashboard(
                  t("dsDaHetHan"),
                  t("fileExcel.daHetHan"),
                  3
                )
                .then((res) => {});
            } else if (stored.status === 2) {
              stored
                .exportReportForDashboard(
                  t("dsGanHetHan"),
                  t("fileExcel.sapHetHan"),
                  2
                )
                .then((res) => {});
            } else if (stored.status === 1) {
              stored
                .exportReportForDashboard(
                  t("dsSuDungTot"),
                  t("fileExcel.suDungTot"),
                  1
                )
                .then((res) => {});
            } else {
              stored.exportExcelPagedResult().then();
            }
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
          <Col lg={8} md={12}>
            <FloatLabel label={t("expiryDay")}>
              <Form.Item name="expiryDay" className="flex-auto">
                <OrdDateInput allowClear={false}></OrdDateInput>
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
          title={() => {
            return (
              <TopTableFilter
                selectedValue={stored.status}
                onClickItem={(data) => {
                  stored.setStatus(data);
                  stored.refreshGridData(true);
                }}
                data={stored.summaryData?.map(
                  (x) =>
                    ({
                      label: t(x.strStatus ?? ""),
                      key: x.status,
                      count: x?.count,
                    } as ITopTableFilterData)
                )}
              ></TopTableFilter>
            );
          }}
          getPageResult={(d) => {
            stored.setSummary(d.body);
            return stored.apiService().getPaged(
              {
                body: {
                  ...d.body,
                  status: stored.status == -1 ? undefined : stored.status,
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

export default observer(ReportStockCommodityExpiry);

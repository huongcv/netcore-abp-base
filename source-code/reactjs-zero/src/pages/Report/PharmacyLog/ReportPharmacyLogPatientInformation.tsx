import React, { useEffect, useRef } from "react";
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
import Utils from "@ord-core/utils/utils";
import DateCell from "@ord-components/table/cells/DateCell";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { PharmacyLogReportPatientInformationFlatDto } from "@ord-store/Report/PharmacyLogPatientInformationReportStore";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { useSelectProductType } from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

function ReportPharmacyLogPatientInformation() {
  const { reportPharmacyLogPatientInformationStore: stored } = useStore();
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
  const formatterNumber = Utils.formatterNumber;
  const sharedOnCell = (
    _: PharmacyLogReportPatientInformationFlatDto,
    index?: number
  ) => {
    return { rowSpan: _.rowSpan };
  };
  const columns: TableProps<PharmacyLogReportPatientInformationFlatDto>["columns"] =
    [
      {
        title: t("order"),
        dataIndex: "order",
        key: "order",
        width: 50,
        onCell: sharedOnCell,
      },
      {
        title: t("moveCode"),
        dataIndex: "moveCode",
        width: 100,
        key: "moveCode",
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
        title: t("prescriptionId"),
        width: 130,
        dataIndex: "prescriptionId",
        key: "prescriptionId",
        onCell: sharedOnCell,
      },
      {
        title: t("dateIssued"),
        width: 130,
        dataIndex: "dateIssued",
        key: "dateIssued",
        onCell: sharedOnCell,
        render: (_) => <DateCell date={_} format="DD/MM/YYYY"></DateCell>,
      },
      {
        title: t("name"),
        width: 200,
        dataIndex: "patientName",
        key: "patientName",
        onCell: sharedOnCell,
        render: (_, __) => {
          return (
            <>
              {__.patientName && (
                <div>
                  <strong>{t("patientName")}:</strong> {__.patientName}
                </div>
              )}
              {__.strAge && (
                <div>
                  <strong>{t("strAge")}:</strong> {__.strAge}
                </div>
              )}
              {__.genderStr && (
                <div>
                  <strong>{t("gender")}:</strong> {tEnum(__.genderStr)}{" "}
                </div>
              )}
              {__.address && (
                <div>
                  <strong>{t("address")}:</strong> {__.address}
                </div>
              )}
              {__.guardian && (
                <div>
                  <strong>{t("guardian")}:</strong> {__.guardian}
                </div>
              )}
            </>
          );
        },
      },
      {
        title: t("prescribingDoctorName"),
        width: 150,
        dataIndex: "prescribingDoctorName",
        key: "prescribingDoctorName",
        onCell: sharedOnCell,
      },

      {
        title: t("medicalFacility"),
        width: 180,
        dataIndex: "medicalFacility",
        key: "medicalFacility",
        onCell: sharedOnCell,
      },
      // {
      //     title: t('medicalFacility'),
      //     width: 130,
      //     dataIndex: 'medicalFacility',
      //     key: 'medicalFacility',
      //     onCell: sharedOnCell
      // },
      {
        title: t("diagnosis"),
        width: 130,
        dataIndex: "diagnosis",
        key: "diagnosis",
        onCell: sharedOnCell,
      },
      {
        title: t("productName"),
        width: 170,
        dataIndex: "productName",
        key: "productName",
      },
      {
        width: 200,
        title: t("productExtendInfo"),
        dataIndex: "productExtendInfo",
        key: "productExtendInfo",
        render: (info, __) =>
          info && Object.keys(info).length > 0 ? (
            <>
              {__.lotNumber && (
                <div>
                  <strong>{t("lotNumber")}:</strong> {__.lotNumber}
                </div>
              )}
              <ul>
                {Object.entries(info).map(([key, val]) => (
                  // @ts-ignore
                  <li key={key}>
                    <strong>{t(key)}:</strong> {val as string}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>{t("notInfo")}</>
          ),
      },
      {
        width: 120,
        title: t("basicUnitName"),
        dataIndex: "basicUnitName",
        key: "basicUnitName",
        align: "left",
      },
      {
        width: 100,
        title: t("qty"),
        dataIndex: "qty",
        key: "qty",
        align: "center",
      },
      {
        width: 100,
        title: t("note"),
        dataIndex: "note",
        key: "note",
        align: "left",
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
          <Col {...useResponsiveSpan(3)}>
            <FloatLabel label={t("filterBy")}>
              <Form.Item name="type" className="flex-auto">
                <OrdSelect datasource={sourceFilterBy()}></OrdSelect>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(3)}>
            <FloatLabel label={t("type")}>
                <Form.Item name="productTypeId">
                    <OrdSelect allowClear datasource={productTypeCombo}/>
                </Form.Item>
            </FloatLabel>
          </Col>
          <Col lg={6} md={10}>
            <FloatLabel label={t("rangeDate")}>
              <Form.Item name="rangeDate" className="flex-auto">
                <OrdDateRangeInput></OrdDateRangeInput>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(12)} style={{paddingLeft:0,paddingRight:0}}>
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

export default observer(ReportPharmacyLogPatientInformation);

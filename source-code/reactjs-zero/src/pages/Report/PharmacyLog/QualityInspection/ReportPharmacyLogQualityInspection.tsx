import React, { useEffect, useState } from "react";
import { useStore } from "@ord-store/index";
import { Trans, useTranslation } from "react-i18next";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  TableColumnsType,
} from "antd";
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
import TableUtil from "@ord-core/utils/table.util";
import { PharmacyLogReportQualityInspectionOutputDto } from "@api/index.defs";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import dayjs, { Dayjs } from "dayjs";
import OrdMonthInput from "@ord-components/forms/OrdMonthInput";
import UiUtils from "@ord-core/utils/ui.utils";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

export const sourceTimeType = () => {
  const { t: tEnum } = useTranslation("enum");
  return useSelectDataSource("timeType", async () => {
    return [
      {
        value: 1,
        label: tEnum("timeType.day"),
      },
      {
        value: 2,
        label: tEnum("timeType.month"),
      },
    ];
  });
};

function ReportPharmacyLogQualityInspection() {
  const { reportPharmacyLogQualityInspectionReportStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const [searchFormRef] = Form.useForm();
  const [formCreate] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
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


  const columns: TableColumnsType<PharmacyLogReportQualityInspectionOutputDto> =
    TableUtil.getColumns(
      [
        {
          title: "reportName",
          dataIndex: "reportName",
          width: 250,
          key: "reportName",
        },
        {
          title: "executionTime",
          dataIndex: "executionTime",
          key: "executionTime",
          width: 120,
          render: (_, record: PharmacyLogReportQualityInspectionOutputDto) => (
            <DateCell
              date={_}
              format={record.timeType == 1 ? "DD/MM/YYYY" : "MM/YYYY"}
            ></DateCell>
          ),
        },
        {
          width: 150,
          title: "reason",
          dataIndex: "reason",
          key: "reason",
        },
        {
          width: 150,
          title: "note",
          dataIndex: "note",
          key: "note",
        },
      ],
      {
        actions: [
          {
            title: "view",
            onClick: (d) => {
              if (d)
                navigate(
                  `view/${
                    (d as PharmacyLogReportQualityInspectionOutputDto).idHash
                  }/true`
                );
            },
          },
          {
            title: "edit",
            onClick: (d) => {
              // mainStore.openUpdateModal(d);
              if (d)
                navigate(
                  `update/${
                    (d as PharmacyLogReportQualityInspectionOutputDto).idHash
                  }`
                );
            },
          },
          {
            title: "exportExcel",
            icon: <ExportOutlined></ExportOutlined>,
            onClick: (d: PharmacyLogReportQualityInspectionOutputDto) => {
              if (d.idHash) stored.exportDataItem(d.idHash).then();
            },
          },
          {
            title: "remove",
            onClick: (d) => {
              console.log("d", d);
              stored.openRemoveByHashId(d);
            },
          },
        ],
        ns: stored.getNamespaceLocale(),
      }
    );

  // const columns: TableProps<PharmacyLogReportPrescriptionDrugSalesFlatDto>['columns'] = [
  //
  // ];

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
    // {
    //     content: <Button className={'btn-secondary'} type='primary' onClick={() => {
    //         stored.exportExcelPagedResult()
    //             .then(res => {
    //
    //             })
    //     }}>
    //         <Space>
    //             <ExportOutlined/>
    //         </Space>
    //         {t('actionBtn.exportExcel')}
    //     </Button>
    // },
    {
      title: "addNew",
      onClick: () => {
        formCreate.setFieldsValue({
          timeType: 1,
          executionTime: DateUtil.getNow(),
        });
        setIsModalOpen(true);
      },
    },
  ];
  useEffect(() => {
    if (!!stored.removeRecord) {
      const { removeRecord } = stored;
      UiUtils.showConfirm({
        title: t("confirmDelete"),
        icon: "remove",
        content: (
          <Trans
            ns={stored.getNamespaceLocale()}
            i18nKey="confirmRemove"
            values={removeRecord}
            components={{ italic: <i />, bold: <strong /> }}
          ></Trans>
        ),
        onOk: (d) => {
          stored.removeEntity().then(() => {
            stored.refreshGridData().then();
          });
        },
        onCancel: () => {
          stored.closeRemoveById();
        },
      });
    }
  }, [stored.removeRecord]);

  const handleOk = async () => {
    const data = await formCreate.validateFields();
    stored.checkDouble(data).then((res) => {
      if (res.isSuccessful) {
        setIsModalOpen(false);
        navigate(
          `create/${data.timeType}/${DateUtil.toFormat(
            data.executionTime,
            "DD-MM-YYYY"
          )}`
        );
      } else {
        UiUtils.showError(t(res.notification?.message ?? "error"));
      }
    });
  };
  const w_timeType = Form.useWatch("timeType", formCreate);
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
          <Col {...useResponsiveSpan(10)}>
            <FloatLabel label={t("rangeDate")}>
              <Form.Item name="rangeDate" className="flex-auto">
                <OrdDateRangeInput></OrdDateRangeInput>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(6)}>
            <FloatLabel label={t("filterProduct")}>
              <Form.Item name="filterProduct" className="flex-auto">
                <Input placeholder={t("placeholderFilterProduct")}></Input>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(8)}>
            <SearchFilterText onReset={onResetClick} span={24} placeHolder={t("placeholderFilter")}/>
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
      <Modal
        title={t("titleModalBeforeCreate")}
        width={700}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        open={isModalOpen}
        onOk={handleOk}
      >
        <Form
          form={formCreate}
          layout={"vertical"}
          onFinish={debounce((d) => {
            handleOk();
          }, 250)}
        >
          <Row gutter={16}>
            <Col {...useResponsiveSpan(12)}>
              <FloatLabel label={t("timeType")} required>
                <Form.Item name="timeType" rules={[ValidateUtils.required]}>
                  <OrdSelect datasource={sourceTimeType()}></OrdSelect>
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col {...useResponsiveSpan(12)}>
              <FloatLabel label={t("executionTime")} required>
                <Form.Item
                  name="executionTime"
                  rules={[ValidateUtils.required]}
                >
                  {w_timeType == 1 ? (
                    <OrdDateInput></OrdDateInput>
                  ) : (
                    <OrdMonthInput
                      format={{
                        format: "MM/YYYY",
                        type: "mask",
                      }}
                    ></OrdMonthInput>
                  )}
                </Form.Item>
              </FloatLabel>
            </Col>
          </Row>
          <p className={"text-red"}>{t("noteCreate")}</p>
        </Form>
      </Modal>
    </>
  );
}

export default observer(ReportPharmacyLogQualityInspection);

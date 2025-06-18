import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { observer } from "mobx-react-lite";
import { BusinessHouseHoldCashBookDetailDto } from "@api/index.defs";
import { Button, Col, Form, Row, Space, Table, TableColumnsType } from "antd";
import DateUtil from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";
import { useEffect } from "react";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, ExportOutlined } from "@ant-design/icons";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { debounce } from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { IconlyLight } from "@ord-components/icon/IconlyLight";

const ReportBusinessHouseHoldCashBook = () => {
  const { businessHouseHoldCashBookReportStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const navigate = useNavigate();
  const formatterNumber = Utils.formatterNumber;
  const [searchFormRef] = Form.useForm();

  const columns: TableColumnsType<BusinessHouseHoldCashBookDetailDto> = [
    {
      title: t("Ngày, tháng ghi sổ"),
      dataIndex: "accountMoveDate",
      width: 140,
      align: "center",
      render: (val) => DateUtil.toFormat(val, 'DD/MM/YYYY')
    },
    {
      title: t("Ngày, tháng chứng từ"),
      dataIndex: "accountMoveDate",
      width: 140,
      align: "center",
      render: (val, record) => DateUtil.toFormat(val, 'DD/MM/YYYY')
    },
    {
      title: t("Số hiệu chứng từ"),
      children: [
        {
          title: t("Thu"),
          dataIndex: "receiptCode",
          width: 120,
          align: "center",
          render: (_, record: any) =>
            record.totalPurchase > 0 ? record.accountMoveName : "",
        },
        {
          title: t("Chi"),
          dataIndex: "paymentCode",
          width: 120,
          align: "center",
          render: (_, record: any) =>
            record.totalPayment > 0 ? record.accountMoveName : "",
        },
      ],
    },
    {
      title: t("Diễn giải"),
      dataIndex: "descriptions",
      width: 250,
      align: "left",
    },
    {
      title: t("Số tiền"),
      children: [
        {
          title: t("Thu"),
          dataIndex: "totalPurchase",
          width: 130,
          align: "right",
          render: (val, record) => record.accountMoveType == 1 ? formatterNumber(val, 0) : "",
        },
        {
          title: t("Chi"),
          dataIndex: "totalPayment",
          width: 130,
          align: "right",
          render: (val, record) =>  record.accountMoveType == 2 ? formatterNumber(val, 0) : "",
        },
        {
          title: t("Tồn"),
          dataIndex: "duringTotalPayment",
          width: 130,
          align: "right",
          render: (val) => formatterNumber(val, 0),
        },
      ],
    },
    {
      title: t("Ghi chú"),
      dataIndex: "notes",
      width: 150,
      align: "left",
    },
    {
      title: t("Người nhận/Người nộp"),
      dataIndex: "partnerName",
      width: 180,
      align: "left",
    },
  ];

  useEffect(() => {
    if (stored) {
      stored.setSearchFormRef(searchFormRef);
      searchFormRef.setFields([
        {
          name: "rangeDate",
          value: DateUtil.getDateRange("thang_nay"),
        },
      ]);
    }
  }, []);

  function onResetClick() {
    searchFormRef.resetFields();
    searchFormRef.setFields([
      {
        name: "rangeDate",
        value: DateUtil.getDateRange('thang_nay')
      }
    ])
    stored.searchData({});
  }

  const topAction: IActionBtn[] = [
    {
      content: <>
        <Button onClick={() => navigate(-1)}>
          <Space>
            <ArrowLeftOutlined />
          </Space>
          {t('Quay lại')}
        </Button>
      </>
    },
    {
      content: <Button type='primary' onClick={() => {
        stored.exportExcelPagedResult()
          .then(res => {

          })
      }}>
        <Space>
          <ExportOutlined />
        </Space>
        {t('actionBtn.exportExcel')}
      </Button>
    },
  ]

  return (
    <>
      <PageTopTitleAndAction usingCustom={true} mainTitle={t('S6-HKD: Sổ quỹ tiền mặt')}
        items={[t('Báo cáo Hộ kinh doanh'),]}>
        <TopAction topActions={topAction} />
      </PageTopTitleAndAction>
      <Form className={'ord-container-box'} form={searchFormRef} layout={"vertical"}
        onFinish={debounce((d) => {
          stored.searchData(d);
        }, 250)}>
        <Row gutter={16}>
          <Col lg={12} md={12}>
            <FloatLabel label={t('Khoảng thời gian')}>
              <Form.Item>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name='rangeDate' className='flex-auto'>
                    <OrdDateRangeInput></OrdDateRangeInput>
                  </Form.Item>
                  <Button type='default' onClick={onResetClick} className={'btn-other'} icon={<IconlyLight width={22} type={'Reload.svg'} />} />
                </Space.Compact>

              </Form.Item>
            </FloatLabel>

          </Col>
          <Button type='primary' htmlType={'submit'} className={'search-btn'} icon={<IconlyLight width={22} type={'Search.svg'} />} />
        </Row>
      </Form>
      <div className="ord-container-box">
        <AntTableWithDataPaged
          columns={columns}
          searchForm={stored.searchFormRef}
          searchData={stored.searchDataState}
          refreshDatasource={stored.refreshDataState}
          getPageResult={async (d) => {
            const res = await stored.apiService().getPaged({ body: d.body });
            stored.summaryData = res.summaryData;
            return {
              items: res.items,
              totalCount: res.totalCount,
            };
          }}
          summary={(pageData) => (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5} className='font-bold  !pr-1.5'>
                  <strong>{t("Tổng cộng")}</strong>
                </Table.Summary.Cell>

                <Table.Summary.Cell index={1} align="right" className='font-bold  !pr-1.5'>
                  {formatterNumber(stored.summaryData?.totalPurchase, 0)}
                </Table.Summary.Cell>

                <Table.Summary.Cell index={2} align="right" className='font-bold  !pr-1.5'>
                  {formatterNumber(stored.summaryData?.totalPayment, 0)}
                </Table.Summary.Cell>

                <Table.Summary.Cell index={3} align="right" className='font-bold  !pr-1.5'>
                  {formatterNumber(stored.summaryData?.duringTotalPayment, 0)}
                </Table.Summary.Cell>

                <Table.Summary.Cell index={4} colSpan={2}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </>
  );
};

export default observer(ReportBusinessHouseHoldCashBook);

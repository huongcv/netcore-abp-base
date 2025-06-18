import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { observer } from "mobx-react-lite";
import { BusinessHouseHoldBankBookDetailDto, BusinessHouseHoldBankBookDto, BusinessHouseHoldCashBookDetailDto } from "@api/index.defs";
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

const ReportBusinessHouseHoldBankBook = () => {
  const { businessHouseHoldBankBookReportStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const navigate = useNavigate();
  const formatterNumber = Utils.formatterNumber;
  const [searchFormRef] = Form.useForm();

  const columns: TableColumnsType<BusinessHouseHoldBankBookDetailDto> = [
    {
      title: t("Tài khoản ngân hàng"),
      dataIndex: "bankAccountCode",
      width: 200,
      align: "left",
      render: (val) => val || "",
    },
    {
      title: t("Ngày, tháng ghi sổ"),
      dataIndex: "accountMoveDate",
      width: 140,
      align: "center",
      render: (val, record) => record.descriptions == "OPENING_PAYMENT_AMOUNT" ? "" : DateUtil.toFormat(val, 'DD/MM/YYYY')
    },
    {
      title: t("Chứng từ"),
      children: [
        {
          title: t("Số hiệu"),
          dataIndex: "accountMoveCode",
          width: 150,
          align: "center",
        },
        {
          title: t("Ngày, tháng"),
          dataIndex: "accountMoveDate",
          width: 140,
          align: "center",
          render: (val, record) => record.descriptions == "OPENING_PAYMENT_AMOUNT" ? "" : DateUtil.toFormat(val, 'DD/MM/YYYY')
        },
      ],
    },
    {
      title: t("Diễn giải"),
      dataIndex: "descriptions",
      width: 250,
      align: "left",
      render: (v) => {
        if (v == "OPENING_PAYMENT_AMOUNT") {
          return <span className={'font-bold'}>Số dư đầu kỳ</span>
        }

        return <span>{v}</span>
      }
    },
    {
      title: t("Số tiền"),
      children: [
        {
          title: t("Thu (Gửi vào)"),
          dataIndex: "totalPurchase",
          width: 150,
          align: "right",
          render: (val, record) => (record.descriptions == "OPENING_PAYMENT_AMOUNT" || record.accountMoveType == 2) ? '' : formatterNumber(val, 0)
        },
        {
          title: t("Chi (Rút ra)"),
          dataIndex: "totalPayment",
          width: 150,
          align: "right",
          render: (val, record) => (record.descriptions == "OPENING_PAYMENT_AMOUNT" || record.accountMoveType == 1) ? '' : formatterNumber(val, 0)
        },
        {
          title: t("Còn lại"),
          dataIndex: "duringTotalPayment",
          width: 150,
          align: "right",
          render: (val, record) => <span className={record.descriptions == "OPENING_PAYMENT_AMOUNT" ? 'font-bold' : ''}>{formatterNumber(val, 0)}</span>,
        },
      ],
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
      <PageTopTitleAndAction usingCustom={true} mainTitle={t('S7-HKD: Sổ tiền gửi ngân hàng')}
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
          searchForm={searchFormRef}
          searchData={stored.searchDataState}
          refreshDatasource={stored.refreshDataState}
          getPageResult={async (d) => {
            const res = await stored.apiService().getPaged({ body: d.body });
            stored.summaryData = res.summaryData;
            return {
              items: res.items,
              totalCount: res.totalCount
            };
          }}
          onChangePageResult={(pagedResult) => {
            const summary = stored.summaryData;
            const openingRow = {
              descriptions: "OPENING_PAYMENT_AMOUNT",
              duringTotalPayment: summary?.openingTotalPayment || 0
            };
            pagedResult.items = [openingRow, ...(pagedResult.items || [])];
          }}
          summary={() => {
            const s = stored.summaryData;
            return (
              <Table.Summary fixed="bottom">
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5} className='font-bold  !pr-1.5'>
                    <strong>{t("Tổng cộng")}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} align="right" className='font-bold  !pr-1.5'>
                    {formatterNumber(s?.totalPurchase, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6} align="right" className='font-bold  !pr-1.5'>
                    {formatterNumber(s?.totalPayment, 0)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={7} align="right" className='font-bold  !pr-1.5'>
                    {formatterNumber(s?.duringTotalPayment, 0)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </div>
    </>
  );
};

export default observer(ReportBusinessHouseHoldBankBook);

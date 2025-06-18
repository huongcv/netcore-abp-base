import FloatLabel from "@ord-components/forms/FloatLabel";
import { useStore } from "@ord-store/index";
import { Form, Row, Col, Input, TableColumnsType, Space } from "antd";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import DateUtil from "@ord-core/utils/date.util";
import { observer } from "mobx-react-lite";
import { CommonListStore } from "@ord-core/base/CommonListStore";
import { debounce } from "lodash";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { PartnerDoctorService } from "@api/PartnerDoctorService";
import DateCell from "@ord-components/table/cells/DateCell";
import { PrescriptionHistoryDto } from "@api/index.defs";
import Utils from "@ord-core/utils/utils";

export const FormDoctorPrescriptionHistory = observer(
  (prop: {
    partnerId: number;
    store: CommonListStore<any>;
    useHotKey?: boolean;
  }) => {
    const { partnerId, store, useHotKey } = prop;
    const form = Form.useFormInstance();
    const id_w = Form.useWatch("id", form);
    const [fromSeach] = Form.useForm();
    const { t } = useTranslation(["partner-doctor"]);
    const { partnerDoctorStore: mainStore } = useStore();

    const columns: TableColumnsType<PrescriptionHistoryDto> =
      TableUtil.getColumns([
        {
          title: t("invoiceCode"),
          dataIndex: "invoiceCode",
          align: "left",
          width: 150,
        },
        {
          title: t("dateIssued"),
          dataIndex: "dateIssued",
          align: "center",
          width: 150,
          render: (_) => (
            <DateCell date={_} format="DD/MM/YYYY HH:mm"></DateCell>
          ),
        },
        {
          title: t("customerName"),
          dataIndex: "customerName",
          align: "left",
          width: 100,
        },
        {
          title: t("patientName"),
          dataIndex: "patientName",
          align: "left",
          width: 150,
        },
        {
          title: t("medicalFacility"),
          dataIndex: "medicalFacility",
          align: "left",
          width: 300,
        },
        {
          title: t("totalAmount"),
          align: "right",
          render: (data: string, record) => {
            return (
              <span>{Utils.formatterNumber(record.totalAmount ?? 0, 0)}</span>
            );
          },
          width: 150,
        },
      ]);

    const onResetClick = () => {
      fromSeach.resetFields();
      store.refreshGridData(true).then();
    };

    return (
      <>
        <Form
          form={fromSeach}
          layout={"vertical"}
          onFinish={debounce((d) => {
            store.searchData(d);
          }, 250)}
        >
          <Row gutter={16}>
            <Col {...useResponsiveSpan(9)}>
              <FloatLabel label={t("rangeDate")}>
                <Space.Compact style={{ width: "100%" }}>
                  <Form.Item
                    name="rangeDate"
                    className="flex-auto"
                    initialValue={DateUtil.getDateRange("thang_nay")}
                  >
                    <OrdDateRangeInput
                      allowEq
                      notAllowFuture
                    ></OrdDateRangeInput>
                  </Form.Item>
                </Space.Compact>
              </FloatLabel>
            </Col>
            <SearchFilterText
              ignoreAutoFocus={true}
              onReset={onResetClick}
              span={15}
              placeHolder={t("textSearch")}
            ></SearchFilterText>
          </Row>
        </Form>
        <div style={{ minHeight: 250 }}>
          {partnerId != null && (
            <AntTableWithDataPaged
              searchForm={fromSeach}
              getPageResult={(d) => {
                return PartnerDoctorService.getPrescriptionHistory(
                  {
                    body: {
                      ...d.body,
                      doctorId: partnerId.toString(),
                    },
                  },
                  {}
                );
              }}
              columns={columns}
              searchData={store.searchDataState}
              refreshDatasource={store.refreshDataState}
            />
          )}
        </div>
      </>
    );
  }
);

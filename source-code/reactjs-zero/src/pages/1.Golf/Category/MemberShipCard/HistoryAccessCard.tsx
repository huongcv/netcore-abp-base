import { AccessCardService } from "@api/AccessCardService";
import { AccessCardHistoryDto } from "@api/index.defs";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { useStore } from "@ord-store/index";
import { Col, Form, Modal, Row, Space, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { debounce } from "lodash";
import DateUtil from "@ord-core/utils/date.util";
import { useEffect } from "react";
import OrdDateInput from "@ord-components/forms/OrdDateInput";

const HistoryAccessCard = () => {

  const { golfAccessCardStore: mainStore } = useStore();
    const { t } = useTranslation(mainStore.getNamespaceLocale());
  const [searchFormRef] = Form.useForm();

  function handleCancel(): void {
    mainStore.closeHistoryModal();
  }

  const columns: TableColumnsType<AccessCardHistoryDto> = TableUtil.getColumns(
    [
      {
        title: "code",
        dataIndex: "code",
        width: 140,
      },
      {
        title: "partnerName",
        dataIndex: "partnerName",
        width: 140,
      },
      {
        title: "partnerCode",
        dataIndex: "partnerCode",
        width: 200,
      },
      {
        title: "startDate",
        dataIndex: "startDate",
        width: 200,
        render: (_) =><>{_ ? DateUtil.toFormat(_, "DD/MM/YYYY HH:mm") : "-"}</>
      },
      {
        title: "endDate",
        dataIndex: "endDate",
        width: 200,
        render: (_) =><>{_ ? DateUtil.toFormat(_, "DD/MM/YYYY HH:mm") : "-"}</>
      },
    ],
    {
      ns: mainStore.getNamespaceLocale(),
    }
  );

  const onResetClick = () => {
      searchFormRef.resetFields();
      mainStore.refreshGridData(true).then();
    };

  useEffect(() => {
    if (mainStore.accessCardHistoryEntity) {
      mainStore.refreshDataState++;
      searchFormRef.resetFields();
    }
  }, [mainStore.accessCardHistoryEntity]);

  return (
    <>
      <Modal
        title={t(`accessCardHistory`)}
        open={mainStore.isShowHistoryModal}
        width={1200}
        maskClosable={false}
        onCancel={handleCancel}
        footer={<ModalCloseBtn onClick={handleCancel} />}
      >
        <Form
          form={searchFormRef}
          layout={"vertical"}
          onFinish={debounce((d) => {
            mainStore.searchData(d);
          }, 250)}
          
        >
          <Row gutter={16}>
            <Col {...useResponsiveSpan(9)}>
              <FloatLabel label={t("rangeDate")}>
                <Space.Compact style={{ width: "100%" }}>
                  <Form.Item
                    name="date"
                    className="flex-auto"
                  >
                    <OrdDateInput />
                  </Form.Item>
                </Space.Compact>
              </FloatLabel>
            </Col>
            <SearchFilterText
              ignoreAutoFocus={true}
              span={15}
            onReset={onResetClick}
            ></SearchFilterText>
          </Row>
        </Form>
        <AntTableWithDataPaged
          searchForm={searchFormRef}
          getPageResult={(d) => {
            return AccessCardService.getAccessCardHistoryPaged(
              {
                body: {
                  ...d.body,
                  accessCardId: mainStore.accessCardHistoryEntity.id.toString(),
                },
              },
              {}
            );
          }}
          columns={columns}
          searchData={mainStore.searchDataState}
          refreshDatasource={mainStore.refreshDataState}
        />
      </Modal>
    </>
  );
};
export default observer(HistoryAccessCard);

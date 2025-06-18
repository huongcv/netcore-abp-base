import { GolfBuggyService } from "@api/GolfBuggyService";
import { GolfBuggyOutPutDto, BuggyCurrentStatusEnum } from "@api/index.defs";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { useStore } from "@ord-store/index";
import { BuggyStatusCell } from "@pages/1.Golf/GolfCart/components/BuggyStatusCell";
import { Col, Form, Modal, Row, Space, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import { useState } from "react";
import { debounce } from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectGolfBuggyType } from "@ord-components/forms/select/selectDataSource/useSelectGolfBuggyType";

interface IBookingBuggyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBuggy: (buggy: GolfBuggyOutPutDto) => void;
}

const BookingBuggyModal = (props: IBookingBuggyModalProps) => {
  const { golfBookingStore: mainStore, golfBuggyStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  // const { t: tEnum } = useTranslation("comboEnum");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchRef] = Form.useForm();

  function handleCancel(): void {
    setSelectedRowKeys([]);
    props.onClose();
  }

  const handleOk = async () => {
    if (selectedRowKeys.length > 0) {
      const selectedId = Number(selectedRowKeys[0]);
      const selectedBuggy = await GolfBuggyService.getById({
        findId: selectedId,
      });

      if (selectedBuggy) {
        props.onSelectBuggy(selectedBuggy);
        handleCancel();
      }
    }
  };

  const onResetClick = () => {
    searchRef.resetFields();
    golfBuggyStore.refreshGridData(true).then();
  };

  const columns: TableColumnsType<GolfBuggyOutPutDto> = TableUtil.getColumns(
    [
      {
        title: "buggyName",
        dataIndex: "buggyName",
        align: "left",
        width: 200,
      },
      {
        title: "licensePlate",
        dataIndex: "licensePlate",
        align: "left",
        width: 200,
      },
      // {
      //   title: "buggyType",
      //   dataIndex: "buggyType",
      //   align: "left",
      //   width: 100,
      //   render(value) {
      //     return tEnum(`buggyType.${value}`);
      //   },
      // },
      {
        title: "maxSpeedKph",
        dataIndex: "maxSpeedKph",
        align: "left",
        width: 100,
        render: (value) => {
          return <>{value ? `${value} Kg` : "-"}</>;
        },
      },
      {
        title: "maxLoadKg",
        dataIndex: "maxLoadKg",
        align: "left",
        width: 100,
        render: (value) => {
          return <>{value ? `${value} Kg` : "-"}</>;
        },
      },
      {
        title: "currentStatus",
        dataIndex: "currentStatus",
        align: "center",
        width: 100,
        render: (value: BuggyCurrentStatusEnum) => (
          <BuggyStatusCell status={value} />
        ),
      },
    ],
    {
      ns: mainStore.getNamespaceLocale(),
    }
  );

  return (
    <>
      <Modal
        title={t("buggyListModal")}
        open={props.isOpen}
        width={1200}
        maskClosable={false}
        onCancel={handleCancel}
        onOk={handleOk}
        okText={t("buggyOkModal")}
        cancelText={t("buggyCancelModal")}
        okButtonProps={{
          disabled: selectedRowKeys.length === 0,
        }}
      >
        <Form
          form={searchRef}
          layout={"vertical"}
          onFinish={debounce((d) => {
            golfBuggyStore.searchData(d);
          }, 250)}
        >
          <Row gutter={16}>
            {/* <Col {...useResponsiveSpan(9)}>
              <FloatLabel label={t("buggyType")}>
                <Form.Item name="buggyType">
                  <OrdSelect datasource={useSelectGolfBuggyType()} />
                </Form.Item>
              </FloatLabel>
            </Col> */}
            <SearchFilterText
              span={15}
              onReset={onResetClick}
            ></SearchFilterText>
          </Row>
        </Form>

        <AntTableWithDataPaged
          searchForm={searchRef}
          getPageResult={(d) => {
            return GolfBuggyService.getPaged(
              {
                body: {
                  ...d.body,
                  currentStatus: 1,
                },
              },
              {}
            );
          }}
          columns={columns}
          searchData={golfBuggyStore.searchDataState}
          refreshDatasource={golfBuggyStore.refreshDataState}
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as string[]),
          }}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => {
              setSelectedRowKeys([record.id]);
            },
            style: { cursor: "pointer" },
          })}
        />
      </Modal>
    </>
  );
};

export default observer(BookingBuggyModal);

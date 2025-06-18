import {
  GolfLockerChangeHistoryDto,
  GolfLockerMaintenanceLogDto,
  GolfLockerPageDto,
} from "@api/index.defs";
import { useStore } from "@ord-store/index";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  TableColumnsType,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { debounce } from "lodash";
import DateUtil from "@ord-core/utils/date.util";
import { LockerProps } from ".";
import { observer } from "mobx-react-lite/src/observer";
import { GolfLockerMaintenanceLogService } from "@api/GolfLockerMaintenanceLogService";
import { IconlyLight } from "@ord-components/icon/IconlyLight";

const ModalLockerHistory = (props: LockerProps) => {
  const { isOpen, locker, mode } = props;
  const {
    id: lockerId,
    code: lockerCode,
    status,
  } = locker ?? ({} as GolfLockerPageDto);
  const { golfLockerHistoryStore: mainStore } = useStore();
  const { t } = useTranslation("golf-locker");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromSeach] = Form.useForm();

  useEffect(() => {
    if (isOpen && isOpen === true) {
      setIsModalOpen(isOpen);
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    if (lockerId != null && lockerCode != null) {
      fromSeach.setFieldsValue({
        lockerId: lockerId,
        lockerCode: lockerCode,
      });
      fromSeach.submit();
    }
  };

  const columns = () => {
    if (mode === "provide") {
      return [
        {
          title: t("partnerCode"),
          dataIndex: "partnerCode",
          align: "left",
          width: 80,
        },
        {
          title: t("partnerName"),
          dataIndex: "partnerName",
          align: "left",
          width: 100,
        },
        {
          title: t("rentStartDate"),
          dataIndex: "rentStartDate",
          align: "left",
          width: 100,
          render: (v) => (v ? DateUtil.toFormat(v) : ""),
        },
        {
          title: t("rentEndDate"),
          dataIndex: "rentEndDate",
          align: "left",
          width: 100,
          render: (v) => (v ? DateUtil.toFormat(v) : ""),
        },
      ] as TableColumnsType<GolfLockerChangeHistoryDto>;
    }
    return [
      {
        title: t("maintenanceDate"),
        dataIndex: "maintenanceDate",
        align: "left",
        width: 80,
        render: (v) => (v ? DateUtil.toFormat(v) : ""),
      },
      {
        title: t("conditionLocker"),
        dataIndex: "conditionLocker",
        align: "left",
        width: 100,
      },
      {
        title: t("performedById"),
        dataIndex: "performedById",
        align: "left",
        width: 100,
      },
      {
        title: t("notes"),
        dataIndex: "notes",
        align: "left",
        width: 100,
      },
    ] as TableColumnsType<GolfLockerMaintenanceLogDto>;
  };
  const SearchForm = () => {
    return (
      <Row gutter={16}>
        <Col span={12}>
          <FloatLabel label={t("lockerCode")}>
            <Form.Item hidden noStyle name="lockerId"></Form.Item>
            <Form.Item name="lockerCode">
              <Input disabled />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={20}>
              <FloatLabel label={t("date")}>
                <Form.Item name="date">
                  <OrdDateInput allowClear placeholder={t("dateUse")} />
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col className="ml-1" span={2}>
              <Button
                type="primary"
                className={"search-btn"}
                onClick={debounce(() => fromSeach.submit(), 250)}
                icon={
                  <>
                    <IconlyLight width={22} type={"Search.svg"} />
                  </>
                }
              ></Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };
  const handleCancel = () => {
    fromSeach.resetFields();
    setIsModalOpen(false);
    props.onClose?.();
  };
  return (
    <Modal
      title={t(`modalLockerHistory`)}
      open={isModalOpen}
      width={650}
      maskClosable={false}
      onCancel={handleCancel}
      footer={<ModalCloseBtn onClick={handleCancel} />}
    >
      <Form
        form={fromSeach}
        layout="vertical"
        onFinish={debounce((d) => {
          mainStore.searchData(d);
        }, 250)}
      >
        <SearchForm />
        <AntTableWithDataPaged
          getPageResult={(d) => {
            return mode === "provide"
              ? mainStore.apiService().getPaged(
                  {
                    body: {
                      ...d.body,
                    },
                  },
                  {}
                )
              : GolfLockerMaintenanceLogService.getPagedLockerHistory(
                  {
                    body: {
                      ...d.body,
                    },
                  },
                  {}
                );
          }}
          columns={columns()}
          searchForm={fromSeach}
          searchData={mainStore.searchDataState}
          refreshDatasource={mainStore.refreshDataState}
          bordered
        ></AntTableWithDataPaged>
      </Form>
    </Modal>
  );
};
export default observer(ModalLockerHistory);

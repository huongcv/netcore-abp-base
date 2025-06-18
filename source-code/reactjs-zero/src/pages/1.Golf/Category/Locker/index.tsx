import { GolfLockerPageDto, GolfLockerStatusEnum } from "@api/index.defs";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { useStore } from "@ord-store/index";
import {
  Button,
  Checkbox,
  Col,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Row,
  TableColumnsType,
} from "antd";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import {
  EyeOutlined,
  HistoryOutlined,
  KeyOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectGolfLockerStatus } from "@ord-components/forms/select/selectDataSource/useSelectGolfLockerStatus";
import ModalLockerForm from "./ModalLockerForm";
import { useCallback, useEffect, useState } from "react";
import DateUtil from "@ord-core/utils/date.util";
import ModalLockerHistory from "./ModalLockerHistory";
import UiUtils from "@ord-core/utils/ui.utils";
import React from "react";
import { GolfLockerBtnGroup } from "./GolfLockerBtnGroup";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { GolfLockerService } from "@api/GolfLockerService";
import { OrdSelectGolfLockerStatus } from "./OrdSelectGolfLockerStatus";
import { useSelectGolfLockerGroup } from "@ord-components/forms/select/selectDataSource/useSelectGolfLockerGroup";
import { useWatch } from "antd/es/form/Form";
import { observer } from "mobx-react-lite/src/observer";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
const { TextArea } = Input;

export interface LockerProps {
  locker: GolfLockerPageDto | undefined;
  mode: "addNew" | "view-update" | "repair" | "provide" | undefined;
  isOpen: boolean;
  onClose?: () => void;
}

const GolfLocker: React.FC = () => {
  const { golfLockerStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  // const [isOpenModalLog, setIsOpenModalLog] = useState<LockerProps>({
  //   locker: undefined,
  //   mode: undefined,
  //   isOpen: false,
  // });
  const [isOpenModalHistory, setIsOpenModalHistory] = useState<LockerProps>({
    locker: undefined,
    mode: undefined,
    isOpen: false,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const columns: TableColumnsType<GolfLockerPageDto> = TableUtil.getColumns(
    [
      // {
      //   title: t("checkOutList"),
      //   dataIndex: "id",
      //   width: 50,
      //   align: "center",
      //   render: (value, dto: GolfLockerPageDto) => {
      //     return dto.status === 1 ? (
      //       <Checkbox
      //         checked={selectedIds.includes(value)}
      //         onChange={(e) => {
      //           const checked = e.target.checked;
      //           setSelectedIds((prev) => {
      //             if (checked) {
      //               return prev.includes(value) ? prev : [...prev, value];
      //             } else {
      //               return prev.filter((id) => id !== value);
      //             }
      //           });
      //         }}
      //       />
      //     ) : (
      //       <></>
      //     );
      //   },
      // },
      {
        title: t("code"),
        dataIndex: "code",
        align: "left",
        width: 50,
      },
      {
        title: t("locationName"),
        dataIndex: "locationName",
        align: "left",
        width: 100,
      },
      {
        title: t("partnerCode"),
        dataIndex: "partnerCode",
        align: "left",
        width: 100,
      },
      {
        title: t("partnerName"),
        dataIndex: "partnerName",
        align: "left",
        width: 100,
      },
      {
        title: t("partnerPhone"),
        dataIndex: "partnerPhone",
        align: "left",
        width: 100,
      },
      {
        title: t("rentStartDate"),
        dataIndex: "rentStartDate",
        align: "left",
        width: 80,
        render: (v) => (v ? DateUtil.toFormat(v) : ""),
      },
      {
        title: t("rentEndDate"),
        dataIndex: "rentEndDate",
        align: "left",
        width: 80,
        render: (v) => (v ? DateUtil.toFormat(v) : ""),
      },
      {
        title: t("status"),
        width: 100,
        align: "center",
        dataIndex: "status",
        render: (v: GolfLockerStatusEnum) => {
          let text: string = "";
          switch (v) {
            case 1:
              text = "Đang dùng";
              break;
            case 2:
              text = "Đang trống";
              break;
            case 3:
              text = "Bảo trì";
              break;
            case 4:
              text = "Locked";
              break;
          }
          return <span>{text}</span>;
        },
      },
    ],
    {
      widthRowIndexCol: 10,
      actions: [
        {
          title: "history-maintenamce-log",
          icon: <UnorderedListOutlined />,
          onClick: (d) => {
            setIsOpenModalHistory({
              isOpen: true,
              locker: d,
              mode: "repair",
            });
          },
        },
        // {
        //   title: "complete-maintenance",
        //   icon: <PlusOutlined />,
        //   hiddenIf(record: GolfLockerPageDto) {
        //     return record.status != (3 as GolfLockerStatusEnum);
        //   },
        //   onClick: (d) => {
        //     const id = d.id;
        //     UiUtils.showConfirm({
        //       title: t("comfirmCheckOutLocker"),
        //       icon: "default",
        //       customIcon: (
        //         <div
        //           className="bg-red p-3 rounded-full flex justify-center items-center"
        //           style={{ width: "60px", height: "60px" }}
        //         >
        //           <KeyOutlined
        //             className="bg-white p-1 rounded-sm flex justify-center items-center"
        //             style={{ color: "red", fontSize: "20px" }}
        //           />
        //         </div>
        //       ),
        //       content: <>{t("completeMaintenanceLocker", { code: d.code })}</>,
        //       onOk: async () => {
        //         try {
        //           UiUtils.setBusy();
        //           const res = await mainStore.apiCompleteMaintenanceLocker(
        //             Number(id)
        //           );
        //           if (res?.isSuccessful) {
        //             UiUtils.showSuccess(
        //               "Cập nhật trạng thái hoàn thành bảo trì"
        //             );
        //           } else {
        //             UiUtils.showError("Lỗi cập nhật trạng thái tủ bảo trì");
        //           }
        //         } catch (error) {
        //           console.error(error);
        //         } finally {
        //           UiUtils.clearBusy();
        //           mainStore.refreshGridData(true).then();
        //         }
        //       },
        //       onCancel: () => {
        //         mainStore.closeRemoveById();
        //       },
        //     });
        //   },
        // },
        {
          title: "view-update",
          icon: <EyeOutlined />,
          // hiddenIf(record: GolfLockerPageDto) {
          //   return record.status != (1 as GolfLockerStatusEnum);
          // },
          onClick: (d) => {
            mainStore.openUpdateModal(d);
            // setIsOpenModalLog({
            //   locker: d,
            //   isOpen: true,
            //   mode: "view-update",
            // });
          },
        },
        // {
        //   title: "checked-out",
        //   icon: <PlusOutlined />,
        //   hiddenIf(record: GolfLockerPageDto) {
        //     return record.status != (1 as GolfLockerStatusEnum);
        //   },
        //   onClick: (d) => {
        //     const id = d.id;
        //     UiUtils.showConfirm({
        //       title: t("comfirmCheckOutLocker"),
        //       icon: "custome",
        //       customIcon: (
        //         <div
        //           className="bg-red p-3 rounded-full flex justify-center items-center"
        //           style={{ width: "60px", height: "60px" }}
        //         >
        //           <KeyOutlined
        //             className="bg-white p-1 rounded-sm flex justify-center items-center"
        //             style={{ color: "red", fontSize: "20px" }}
        //           />
        //         </div>
        //       ),
        //       content: <>{t("confirmCheckout", { code: d.code })}</>,
        //       onOk: async () => {
        //         try {
        //           UiUtils.setBusy();
        //           const res = await mainStore.apiCheckOutLocker(Number(id));
        //           if (res?.isSuccessful) {
        //             UiUtils.showSuccess("Checkout thành công");
        //           } else {
        //             UiUtils.showError("Lỗi checkout");
        //           }
        //         } catch (error) {
        //           console.error(error);
        //         } finally {
        //           UiUtils.clearBusy();
        //           mainStore.refreshGridData(true).then();
        //         }
        //       },
        //       onCancel: () => {
        //         mainStore.closeRemoveById();
        //       },
        //     });
        //   },
        // },
        // {
        //   title: "provide-locker",
        //   icon: <PlusOutlined />,
        //   hiddenIf(record: GolfLockerPageDto) {
        //     return record.status != (2 as GolfLockerStatusEnum);
        //   },
        //   onClick: (d) => {
        //     // setIsOpenModalLog({
        //     //   locker: d,
        //     //   isOpen: true,
        //     //   mode: "provide",
        //     // });
        //   },
        // },
        {
          title: "history-locker",
          icon: <HistoryOutlined />,
          // hiddenIf(record: GolfLockerPageDto) {
          //   return record.status != (2 as GolfLockerStatusEnum);
          // },
          onClick: (d) => {
            setIsOpenModalHistory({
              isOpen: true,
              locker: d,
              mode: "provide",
            });
          },
        },
        // {
        //   title: "repair",
        //   icon: <PlusOutlined />,
        //   hiddenIf(record: GolfLockerPageDto) {
        //     return record.status != (2 as GolfLockerStatusEnum);
        //   },
        //   onClick: (d) => {
        //     setIsOpenModalLog({
        //       isOpen: true,
        //       locker: d,
        //       mode: "repair",
        //     });
        //   },
        // },
        {
          title: "remove",
          hiddenIf(record: GolfLockerPageDto) {
            return record.status !== 3;
          },
          onClick: (d: GolfLockerPageDto) => {
            const removeByHash = {
              ...d,
              id: d.id,
            };
            mainStore.openRemoveById(removeByHash);
          },
        },
      ] as ITableAction<GolfLockerPageDto>[],
      ns: mainStore.getNamespaceLocale(),
      widthActionCol: 50,
    }
  );
  // const HandleCheckedOutList = async () => {
  //   if (selectedIds.length == 0) return;
  //   UiUtils.setBusy();
  //   await GolfLockerService.checkedOutListLocker({ body: selectedIds })
  //     .then((res) => {
  //       if (res.isSuccessful) {
  //         UiUtils.showSuccess("CheckOut hàng loạt thành công");
  //       }
  //     })
  //     .finally(() => {
  //       setSelectedIds([]);
  //       UiUtils.setBusy();
  //       mainStore.refreshGridData(true).then();
  //     });
  // };
  const topActions: IActionBtn[] = [
    // {
    //   content: (
    //     <Button
    //       disabled={selectedIds.length <= 0}
    //       onClick={HandleCheckedOutList}
    //     >
    //       {t("checkOutTool")}
    //     </Button>
    //   ),
    // },
    {
      title: "btnGolfLockerGroup",
      content: <GolfLockerBtnGroup />,
      // permission: "ProductPriceList.Create",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
    {
      title: "addNew",
      // permission: "ProductPriceList.Create",
      onClick: () => {
        mainStore.openCreateModal();
        // setIsOpenModalLog({
        //   isOpen: true,
        //   locker: undefined,
        //   mode: "addNew",
        // });
      },
    },
  ];

  const SearchForm = useCallback(() => {
    return (
      <>
        <ColSpanResponsive span={4}>
          <FloatLabel label={t("date")}>
            <Form.Item name="date">
              <OrdDateInput allowClear placeholder={t("dateUse")} />
            </Form.Item>
          </FloatLabel>
        </ColSpanResponsive>
        <ColSpanResponsive span={4}>
          <FloatLabel label={t("lockerStatus")}>
            <Form.Item name="lockerStatus">
              <OrdSelect
                datasource={useSelectGolfLockerStatus()}
                allowClear
                placeholder={t("lockerStatus")}
              />
            </Form.Item>
          </FloatLabel>
        </ColSpanResponsive>
        <ColSpanResponsive span={4}>
          <FloatLabel label={t("locationId")}>
            <Form.Item name="locationId">
              <OrdSelect
                datasource={[] as any}
                allowClear
                placeholder={t("locationId")}
              />
            </Form.Item>
          </FloatLabel>
        </ColSpanResponsive>
        <SearchFilterText span={8} placeHolder={t("filterText")} />
      </>
    );
  }, []);
  const EntityForm = () => {
    const form = Form.useFormInstance();
    const status_w = useWatch("status", form);

    useEffect(() => {
      const entity = mainStore.createOrUpdateModal.entityData;
      const mode = mainStore.createOrUpdateModal.mode;

      if (
        entity &&
        entity.status === (4 as GolfLockerStatusEnum) &&
        (mode === "update" || mode === "viewDetail")
      ) {
        const lockerId = form.getFieldValue("id");
        if (lockerId) {
          GetInfoLockerBlock(lockerId);
        }
      }
    }, [mainStore.createOrUpdateModal.entityData]);

    const GetInfoLockerBlock = async (lockerId: string | undefined) => {
      UiUtils.setBusy();
      try {
        const res = await GolfLockerService.getInfoLockerBlockCode({
          lockerId: Number(lockerId),
        });

        if (res.isSuccessful) {
          form.setFieldValue("blockDate", res.data?.blockDate);
          form.setFieldValue("reason", res.data?.reason);
        }
      } finally {
        UiUtils.clearBusy();
      }
    };
    return (
      <>
        <Row gutter={16}>
          <Col span={8}>
            <FloatLabel label={t("code")}>
              <Form.Item hidden noStyle name="id">
                <Input />
              </Form.Item>
              <Form.Item name="code">
                <Input />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col span={8}>
            <FloatLabel label={t("locationId")}>
              <Form.Item name="locationId">
                <OrdSelect
                  datasource={[] as any}
                  allowClear
                  placeholder={t("locationId")}
                />
              </Form.Item>
            </FloatLabel>
          </Col>

          <Col span={8}>
            <FloatLabel label={t("status")}>
              <Form.Item name="status" initialValue={2 as GolfLockerStatusEnum}>
                <OrdSelect
                  datasource={useSelectGolfLockerStatus()}
                  allowClear
                  placeholder={t("status")}
                />
              </Form.Item>
            </FloatLabel>
          </Col>
          {status_w === (4 as GolfLockerStatusEnum) ? (
            <>
              <Col span={8}>
                <FloatLabel label={t("blockDate")} required>
                  <Form.Item
                    name="blockDate"
                    initialValue={new Date()}
                    rules={[ValidateUtils.required]}
                  >
                    <OrdDateTimeInput />
                  </Form.Item>
                </FloatLabel>
              </Col>
              <Col span={16}>
                <FloatLabel label={t("reason")} required>
                  <Form.Item
                    name="reason"
                    rules={[
                      ValidateUtils.required,
                      ValidateUtils.maxLength(200),
                    ]}
                  >
                    <Input className="w-full" />
                  </Form.Item>
                </FloatLabel>
              </Col>
            </>
          ) : (
            <></>
          )}

          <Col span={24}>
            <FloatLabel label={t("groupId")} required>
              <Form.Item name="groupId" rules={[ValidateUtils.required]}>
                <OrdSelect
                  datasource={useSelectGolfLockerGroup()}
                  allowClear
                  placeholder={t("groupId")}
                />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col span={8}>
            <FloatLabel label={t("width")}>
              <Form.Item name="width">
                <InputNumber className="w-full" addonAfter="cm" />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col span={8}>
            <FloatLabel label={t("height")}>
              <Form.Item name="height">
                <InputNumber className="w-full" addonAfter="cm" />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col span={8}>
            <FloatLabel label={t("color")}>
              <Form.Item
                name="color"
                valuePropName="value"
                getValueFromEvent={(color) => color.toHexString()}
              >
                <ColorPicker
                  size="middle"
                  showText
                  allowClear
                  className="w-full !rounded-[3px]"
                  style={{
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    alignSelf: "end",
                  }}
                />
              </Form.Item>
            </FloatLabel>
          </Col>

          <Col span={24}>
            <FloatLabel label={t("notes")}>
              <Form.Item name="notes" rules={[ValidateUtils.maxLength(200)]}>
                <TextArea rows={2} />
              </Form.Item>
            </FloatLabel>
          </Col>
        </Row>
      </>
    );
  };

  // const handleCloseModalLog = useCallback(() => {
  //   setIsOpenModalLog({
  //     isOpen: false,
  //     locker: undefined,
  //     mode: undefined,
  //   });
  // }, []);
  const handleCloseModalHistory = useCallback(() => {
    setIsOpenModalHistory({
      isOpen: false,
      locker: undefined,
      mode: undefined,
    });
  }, []);
  return (
    <>
      <OrdCrudPage
        stored={mainStore}
        entityForm={() => <EntityForm />}
        columns={columns}
        searchForm={() => <SearchForm />}
        topActions={topActions}
      ></OrdCrudPage>
      {/* <ModalLockerForm
        isOpen={isOpenModalLog.isOpen}
        locker={isOpenModalLog.locker}
        mode={isOpenModalLog.mode}
        onClose={handleCloseModalLog}
      ></ModalLockerForm> */}
      <ModalLockerHistory
        isOpen={isOpenModalHistory.isOpen}
        locker={isOpenModalHistory.locker}
        mode={isOpenModalHistory.mode}
        onClose={handleCloseModalHistory}
      ></ModalLockerHistory>
    </>
  );
};
export default observer(GolfLocker);

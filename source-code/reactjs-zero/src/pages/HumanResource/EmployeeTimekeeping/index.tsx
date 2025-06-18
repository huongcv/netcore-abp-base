import {
  Alert,
  Checkbox,
  Col,
  Divider,
  Form,
  FormInstance,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  TableColumnsType,
} from "antd";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import React, { useEffect, useState } from "react";
import { useStore } from "@ord-store/index";
import TableUtil from "@ord-core/utils/table.util";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import OrdTimeInput from "@ord-components/forms/OrdTimeInput";
import { useSelectHrEmployee } from "@ord-components/forms/select/selectDataSource/useSelectHrEmployee";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import DateUtil from "@ord-core/utils/date.util";
import { useSelectTimekeepingStatus } from "@ord-components/forms/select/selectDataSource/useSelectTimekeepingStatus";
import { TimeKeepingSearch } from "@pages/HumanResource/EmployeeTimekeeping/timeKeepingSearch";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import { useForm, useWatch } from "antd/lib/form/Form";
import { EmployeeTimekeepingDto } from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import { EmployeeTimekeepingService } from "@api/EmployeeTimekeepingService";
import dayjs, { Dayjs } from "dayjs";
import EmployeeTimekeepingStore from "@ord-store/Payroll/employeeTimekeeping/employeeTimekeepingStore";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import dateUtil from "@ord-core/utils/date.util";
import { NamePath } from "antd/es/form/interface";
import { PERMISSION_APP } from "@ord-core/config/permissions";

export const CreateOrUpdateForm = (props: {
  form: FormInstance;
  disable?: boolean;
  store: EmployeeTimekeepingStore;
}) => {
  const { t } = useTranslation("employeeTimekeeping");
  const { t: tCommon } = useTranslation("common");
  const form = props.form;
  const [workCalendarName, setWorkCalendarName] = useState("");
  const [isHaveCalendar, setIsHaveCalendar] = useState(false);
  const [isLeaf, setIsLeaf] = useState(false);
  const employeeId_w = useWatch("employeeId", form);
  const authorizedLeave = useWatch("authorizedLeave", form);
  const unAuthorizedLeave = useWatch("unAuthorizedLeave", form);

  useEffect(() => {
    GetWorkCalendar(
      props.form.getFieldValue("employeeId"),
      props.form.getFieldValue("workDate")
    );

    if (props.form.getFieldValue("authorizedLeave") === true) {
      setIsLeaf(true);
    } else {
      setIsLeaf(false);
    }
  }, [props.form.getFieldValue("id")]);

  const GetWorkCalendar = (employeeId?: string, workDate?: Date) => {
    if (!!employeeId && !!workDate) {
      props.store
        .apiService()
        .getWorkCalendarByEmployeeId({
          body: { employeeId: employeeId, workDate: workDate },
        })
        .then((res) => {
          if (res.isSuccessful) {
            console.log(res.data, "res.data");
            props.form.setFieldValue("workCalendarFrom", res.data?.hourFrom);
            props.form.setFieldValue("workCalendarTo", res.data?.hourTo);
            props.form.setFieldValue("isNightShift", res.data?.isNightShift);
            setIsHaveCalendar(true);
            setWorkCalendarName(res.data?.workCalendarName ?? "");
          } else {
            props.form.setFieldValue("workCalendarFrom", null);
            props.form.setFieldValue("workCalendarTo", null);
            setIsHaveCalendar(false);
            setWorkCalendarName("");
          }
        });
    } else {
      props.form.setFieldValue("workCalendarFrom", null);
      props.form.setFieldValue("workCalendarTo", null);
      setIsHaveCalendar(false);
    }
  };

  const onChangeCheckIn = (value?: string) => {
    if (!!props.form.getFieldValue("workCalendarFrom") && !!value) {
      const _calendarForm = props.form
        .getFieldValue("workCalendarFrom")
        .split(":");
      const _value = value.split(":");
      const _late =
        (parseInt(_value[0]) - parseInt(_calendarForm[0])) * 60 +
        (parseInt(_value[1]) - parseInt(_calendarForm[1]));
      props.form.setFieldValue("lateInMinutes", _late > 0 ? _late : 0);
    } else {
      props.form.setFieldValue("lateInMinutes", 0);
    }
  };

  const onChangeCheckOut = (value?: string) => {
    if (!!props.form.getFieldValue("workCalendarTo") && !!value) {
      const _calendarTo = props.form.getFieldValue("workCalendarTo").split(":");
      const _value = value.split(":");
      const _early =
        (parseInt(_calendarTo[0]) - parseInt(_value[0])) * 60 +
        (parseInt(_calendarTo[1]) - parseInt(_value[1]));

      props.form.setFieldValue("earlyOutMinutes", _early > 0 ? _early : 0);
    } else {
      props.form.setFieldValue("earlyOutMinutes", 0);
    }
  };

  const lateInMinutes = Form.useWatch((values) => {
    return values.lateInMinutes ?? 0;
  }, props.form);

  const earlyOutMinutes = Form.useWatch((values) => {
    return values.earlyOutMinutes ?? 0;
  }, props.form);

  const changeLeave = (value?: any) => {
    props.form.setFieldValue("isHalfDayOff", false);
  };

  const timeIsAfterNow = (workDateField: NamePath) => {
    return (form: any) => ({
      validator(_: any, value: string) {
        if (!value) {
          return Promise.resolve();
        }

        const workDate = form.getFieldValue(workDateField);

        if (!workDate) {
          return Promise.resolve();
        }

        const now = dayjs(); // thời gian hiện tại

        // Nếu workDate là ngày trước hôm nay thì bỏ qua không validate
        if (dayjs(workDate).isBefore(now, 'day')) {
          return Promise.resolve();
        }
        const format = 'HH:mm';
        const selectedTime = dayjs(value, format);
        const currentTime = dayjs(now.format(format), format);

        if (currentTime.isSame(selectedTime) || currentTime.isAfter(selectedTime)) {
          return Promise.resolve();
        }

        return Promise.reject(
          new Error(
            t('gioRaKhongDuocLonHonHienTai') // bạn đổi text này theo ý
          )
        );
      },
    });
  };

  return (
    <>
      <Form form={props.form} disabled={props.disable}>
        <Row gutter={12}>
          <Col span={12}>
            <FloatLabel label={t("employeeId")} required>
              <Form.Item name="employeeId" rules={[ValidateUtils.required]}>
                <OrdSelect
                  disabled={props.form.getFieldValue("id") > 0}
                  onChange={(value) => {
                    GetWorkCalendar(
                      value,
                      props.form.getFieldValue("workDate")
                    );
                  }}
                  datasource={useSelectHrEmployee()}
                ></OrdSelect>
              </Form.Item>
            </FloatLabel>
          </Col>

          <Col span={12}>
            <FloatLabel label={t("workDate")} required>
              <Form.Item name="workDate">
                <OrdDateInput
                  disabled={props.form.getFieldValue("id") > 0}
                  disabledDate={(current) => dateUtil.disableAfter(current, dayjs(new Date()))}
                  onChange={(value) => {
                    GetWorkCalendar(
                      props.form.getFieldValue("employeeId"),
                      value ?? undefined
                    );
                  }}
                ></OrdDateInput>
              </Form.Item>
            </FloatLabel>
          </Col>
          {employeeId_w ? (
            <>
              <Divider style={{ borderColor: "rgb(202 203 199)" }}>
                {t("infoDescription")}: {workCalendarName}
              </Divider>
              {isHaveCalendar && (
                <Col span={12}>
                  <FloatLabel label={t("workCalendarFrom")}>
                    <Form.Item name="workCalendarFrom">
                      <OrdTimeInput disable={true}></OrdTimeInput>
                    </Form.Item>
                  </FloatLabel>
                </Col>
              )}
              {isHaveCalendar && (
                <Form.Item name="isNightShift" hidden>
                </Form.Item>
              )}
              {isHaveCalendar && (
                <Col span={12}>
                  <FloatLabel label={t("workCalendarTo")}>
                    <Form.Item name="workCalendarTo">
                      <OrdTimeInput disable={true}></OrdTimeInput>
                    </Form.Item>
                  </FloatLabel>
                </Col>
              )}

              {!isHaveCalendar && (
                <nav className={"w-full"}>
                  <Alert
                    message={t("descriptionMessage")}
                    description={t("noCalendarDescription")}
                    type="warning"
                    showIcon
                  />
                </nav>
              )}
            </>
          ) : (
            <></>
          )}

          <Divider style={{ borderColor: "rgb(202 203 199)" }}>
            {t("infoTimekeeping")}
          </Divider>

          <Col span={12}>
            <FloatLabel label={t("gioVao")} required={(!unAuthorizedLeave && !authorizedLeave)}>
              <Form.Item name="checkIn" rules={(unAuthorizedLeave || authorizedLeave) ? [] : [ValidateUtils.required]}>
                <OrdTimeInput disable={(unAuthorizedLeave || authorizedLeave)}
                  onChange={(value) => onChangeCheckIn(value ?? undefined)}
                ></OrdTimeInput>
              </Form.Item>
              {isHaveCalendar && (
                <span>
                  {t("late")}: {lateInMinutes} {t("minute")}
                </span>
              )}
            </FloatLabel>
          </Col>
          <Col span={12}>
            <FloatLabel label={t("gioRa")} required={(!unAuthorizedLeave && !authorizedLeave)}>
              <Form.Item name="checkOut" rules={(unAuthorizedLeave || authorizedLeave) ? [] : [ValidateUtils.required, timeIsAfterNow("workDate")]}>
                <OrdTimeInput disable={(unAuthorizedLeave || authorizedLeave)}
                  onChange={(value) => onChangeCheckOut(value ?? undefined)}
                ></OrdTimeInput>
              </Form.Item>
              {isHaveCalendar && (
                <span>
                  {t("early")}: {earlyOutMinutes} {t("minute")}
                </span>
              )}
            </FloatLabel>
          </Col>

          <Col span={12}>
            <Form.Item name="authorizedLeave" valuePropName="checked">
              <Checkbox
                onChange={(value) => {
                  props.form.setFieldValue("unAuthorizedLeave", false);
                  setIsLeaf(!!value?.target.checked);
                }}
              >
                {t("authorizedLeave")}
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="unAuthorizedLeave" valuePropName="checked">
              <Checkbox
                onChange={(value) => {
                  props.form.setFieldValue("authorizedLeave", false);
                  setIsLeaf(false);
                }}
              >
                {t("unAuthorizedLeave")}
              </Checkbox>
            </Form.Item>
          </Col>

          {isLeaf && (
            <Col span={12}>
              <Form.Item name="isHalfDayOff" valuePropName="checked">
                <Checkbox>{t("isHalfDayOff")}</Checkbox>
              </Form.Item>
            </Col>
          )}

          <Form.Item name="lateInMinutes" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item name="status" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item name="earlyOutMinutes" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item name="id" hidden={true}>
            <Input />
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};

const EmployeeTimekeeping: React.FC = () => {
  const { EmployeeTimekeepingStore: mainStore } = useStore();
  const { t } = useTranslation("employeeTimekeeping");
  const SelectTimekeepingStatus = useSelectTimekeepingStatus();

  //modal create
  const [visibleModal, setVisibleModal] = useState(false);
  const [initModal, setInitModal] = useState(1);
  const [modalTitle, setModalTitle] = useState("");
  const [modalAction, setModalAction] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [crudForm] = Form.useForm();

  const columns: TableColumnsType<any> = TableUtil.getColumns(
    [
      {
        title: t("employeeName"),
        dataIndex: "employeeName",
      },
      {
        dataIndex: "workDate",
        title: t("workDate"),
        render: (value) => {
          return <span>{DateUtil.toFormat(value, "DD/MM/YYYY")}</span>;
        },
        width: 250,
        align: "center",
      },
      {
        dataIndex: "checkIn",
        title: t("gioVao"),
        width: 150,
        render: (value, record) => {
          return (
            <span
              style={{
                color: `${record.lateInMinutes === 0 ? "green" : "red"}`,
              }}
            >
              {value && DateUtil.toFormat(value, "HH:mm")}
            </span>
          );
        },
        align: "center",
      },
      {
        dataIndex: "checkOut",
        title: t("gioRa"),
        width: 150,
        render: (value, record) => {
          return (
            <span
              style={{
                color: `${record.earlyOutMinutes === 0 ? "green" : "red"}`,
              }}
            >
              {value && DateUtil.toFormat(value, "HH:mm")}
            </span>
          );
        },
        align: "center",
      },
      {
        dataIndex: "status",
        title: t("status"),
        render: (value) => {
          return (
            <DisplayTextFormSelectDataSource
              datasource={SelectTimekeepingStatus}
              value={value}
            />
          );
        },
        width: 200,
        align: "center",
      },
    ],
    {
      actions: [
        {
          title: "remove",
          permission: PERMISSION_APP.human.employeeTimekeeping + '.Remove',
          onClick: (d) => {
            mainStore.openRemoveById(d);
          },
        },
      ],
      viewAction: (d: any) => {
        setModalAction("edit");
        setModalTitle(t("titleModalEdit"));
        initCrudForm(d);
        setVisibleModal(true);
      },
      viewActionPermission: PERMISSION_APP.human.employeeTimekeeping + '.Update',
      ns: mainStore.getNamespaceLocale(),
    }
  );
  const topActions: IActionBtn[] = [
    {
      title: "exportExcel",
      // permission: 'MasterData.Package',
      onClick: () => {
        mainStore.exportExcelPagedResult().then();
      },
    },
    {
      title: "addNew",
      permission: PERMISSION_APP.human.employeeTimekeeping + '.Create',
      onClick: () => {
        initCrudForm();

        setModalTitle(t("titleModalCreate"));
        setModalAction("create");
        setVisibleModal(true);
      },
    },
  ];

  const initCrudForm = (data?: EmployeeTimekeepingDto) => {
    if (!!data) {
      if (data.status === 2) {
        data.authorizedLeave = true;
      } else if (data.status === 3) {
        data.unAuthorizedLeave = true;
      }
      crudForm.setFieldsValue(data);
      if (data.checkIn) {
        crudForm.setFieldValue(
          "checkIn",
          DateUtil.toFormat(data.checkIn, "HH:mm")
        );
      }

      if (data.checkOut) {
        crudForm.setFieldValue(
          "checkOut",
          DateUtil.toFormat(data.checkOut, "HH:mm")
        );
      }

    } else {
      crudForm.setFieldValue("workDate", new Date());
      crudForm.setFieldValue("status", 1);
      crudForm.setFieldValue("isHalfDayOff", false);
    }
  };

  const ValidateGetWorkCalendar = (employeeId?: string, workDate?: Date) => {
    if (!!employeeId && !!workDate) {
      mainStore.apiService().getWorkCalendarByEmployeeId({
        body: { employeeId: employeeId, workDate: workDate },
      })
        .then((res) => {
          if (res.isSuccessful) {
            return true;
          } else {
            return false;
          }
        });
    } else {
      return false;
    }
  };

  const formSubmit = async () => {

    const data = await crudForm.validateFields();
    if (data.checkIn && data.checkOut) {
      const [inHour, inMin] = data.checkIn.split(":").map(Number);
      const [outHour, outMin] = data.checkOut.split(":").map(Number);

      const checkInTime = new Date(0, 0, 0, inHour, inMin);
      const checkOutTime = new Date(0, 0, 0, outHour, outMin);
      if (checkInTime >= checkOutTime && !data.isNightShift) {
        UiUtils.showError(t("checkInTimeMustBeLessThanCheckOutTime"));
        return;
      }
    }


    mainStore.apiService().getWorkCalendarByEmployeeId({
      body: { employeeId: data.employeeId, workDate: data.workDate },
    })
      .then((res) => {
        if (res.isSuccessful) {
          try {
            EmployeeTimekeepingService.createOrUpdate({ body: data })
              .then((res) => {
                if (res.isSuccessful) {
                  UiUtils.setBusy();
                  UiUtils.showSuccess(
                    modalAction === "create"
                      ? t("addNewSuccessfully")
                      : t("editSuccessfully")
                  );
                  crudForm.resetFields();
                  setVisibleModal(false);
                  setModalTitle("");
                  mainStore.refreshGridData();
                } else {
                  UiUtils.showError(res.notification?.message);
                }
              })
              .finally(() => UiUtils.clearBusy());
          } catch (e) { }
        } else {
          UiUtils.showError(t("hasNoCalendar"));
          return;
        }
      });

  };

  useHotkeys('F8', (event) => {
    formSubmit().then
    event.preventDefault();
  }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });


  useHotkeys('F10', (event) => {
    setVisibleModal(false);
    crudForm.resetFields();
    event.preventDefault();
  }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });

  return (
    <>
      <OrdCrudPage
        stored={mainStore}
        topActions={topActions}
        columns={columns}
        searchForm={(f) => <TimeKeepingSearch formSearch={f} />}

      // entityForm={form => <CreateOrUpdateForm store={mainStore} form={form}/>}
      ></OrdCrudPage>

      {visibleModal && (
        <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
          <Modal
            title={modalTitle}
            open={visibleModal}
            width={550}
            // maskClosable={false}
            style={{ top: "30px" }}
            onCancel={() => {
              setVisibleModal(false);
              crudForm.resetFields();
            }}
            destroyOnClose
            footer={
              <FooterCrudModal
                hasAddNewContinue={false}
                hiddenOk={modalAction === "view"}
                onOk={() => formSubmit().then}
                onCancel={() => {
                  setVisibleModal(false);
                  crudForm.resetFields();
                }}
              />
            }
          >
            <CreateOrUpdateForm
              store={mainStore}
              form={crudForm}
              disable={modalAction === "view"}
            ></CreateOrUpdateForm>
          </Modal>
        </HotkeysProvider>

      )}
    </>
  );
};
export default EmployeeTimekeeping;

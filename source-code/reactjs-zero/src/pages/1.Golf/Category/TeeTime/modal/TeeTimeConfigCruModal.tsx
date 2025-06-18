import { useStore } from "@ord-store/index";
import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Spin } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectTeeTimeType } from "@ord-components/forms/select/selectDataSource/useSelectTeeTimeTypeEnum";
import { useEffect, useState } from "react";
import { DAY_OF_WEEK, GolfTeeTimeConfigDetailDto, GolfTeeTimeConfigDto, TimeSpan } from "@api/index.defs";
import { TeeTimeConfigService } from "@api/TeeTimeConfigService";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import OrdTimeInput from "@ord-components/forms/OrdTimeInput";
import { useSelectApplyDayModeType } from "@ord-components/forms/select/selectDataSource/useSelectApplyDayModeEnum";
import validateUtils from "@ord-core/utils/validate.utils";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import Utils from "@ord-core/utils/utils";
import UiUtils from "@ord-core/utils/ui.utils";
import "@pages/1.Golf/Category/TeeTime/teeTime.scss";
import dayjs from 'dayjs';
import { useWatch } from "antd/es/form/Form";
import uiUtils from "@ord-core/utils/ui.utils";

const TeeTimeConfigModal = () => {
  const { t } = useTranslation("golf-teeTime");
  const { golfTeeTimeStore: mainStore } = useStore();
  const { createOrUpdateModal: modalData } = mainStore;
  const [form] = Form.useForm();
  const applyMode = useWatch("applyMode", form);
  let details: GolfTeeTimeConfigDetailDto[] = useWatch("details", form);
  const [golfCourseData, setGolfCourseData] = useState<SelectDataSource>()
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const { RangePicker } = DatePicker;

  const tdClassName = "py-2 px-2 border-b border-gray-200 text-gray-800 align-top";
  const thClassName = "py-2 px-1 border-b border-gray-200 text-left text-gray-600";
  const dayOfWeekOptions = [
    {
      value: 1,
      label: t('dayOfWeek.MONDAY'),
      fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.MONDAY'))
    }, {
      value: 2,
      label: t('dayOfWeek.TUESDAY'),
      fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.TUESDAY'))
    }, {
      value: 3,
      label: t('dayOfWeek.WEDNESDAY'),
      fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.WEDNESDAY'))
    }, {
      value: 4,
      label: t('dayOfWeek.THURSDAY'),
      fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.THURSDAY'))
    }, {
      value: 5,
      label: t('dayOfWeek.FRIDAY'),
      fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.FRIDAY'))
    }, {
      value: 6,
      label: t('dayOfWeek.SATURDAY'),
      fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.SATURDAY'))
    },
    {
      value: 7,
      label: t('dayOfWeek.SUNDAY'),
      fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.SUNDAY'))
    },
  ];

  useEffect(() => {
    if (applyMode == 1) {
      form.setFieldsValue({
        details: []
      });
    } else if (applyMode == 2) {
      form.setFieldsValue({
        startHour: null,
        endHour: null,
      });
    }
  }, [applyMode])

  const getTeeTimeConfigDetails = async () => {
    setIsSpinning(true);
    const result = await TeeTimeConfigService.getTeeTimeDetail({ teeTimeCofigId: mainStore.entityUpdateData.id }).finally(() => { setIsSpinning(false) });
    if (result.isSuccessful) {
      if (Utils.isNotNull(result.data)) {
        result.data?.map((item: GolfTeeTimeConfigDetailDto) =>
          item.name = dayOfWeekOptions.find(x => x.value == item.dayOfWeek)?.label
        );
        form.setFieldsValue({ details: result.data || [] })
      }
    }
  };

  useEffect(() => {
    if (mainStore.createOrUpdateModal.mode == "update") {
      if (mainStore.entityUpdateData.id) {

        form.setFieldsValue({
          ...mainStore.entityUpdateData,
          applyDateRange: [
            mainStore.entityUpdateData.applyFromDate ? dayjs(mainStore.entityUpdateData.applyFromDate) : null,
            mainStore.entityUpdateData.applyToDate ? dayjs(mainStore.entityUpdateData.applyToDate) : null,
          ],
          maSan: mainStore.entityUpdateData?.courseCode,
        });
        getTeeTimeConfigDetails();
      }
    }
  }, [mainStore.entityUpdateData])

  const toggleDay = (day: number) => {
    let details: GolfTeeTimeConfigDetailDto[] = form.getFieldValue("details") || [];
    const info = details?.find((detail: GolfTeeTimeConfigDetailDto) => {
      return detail.dayOfWeek === day;
    })
    if (Utils.isNotNull(info) && info != null) {
      form.setFieldsValue({ details: details.filter(d => d.dayOfWeek !== day) });
    } else {
      details?.push({
        name: dayOfWeekOptions.find(x => x.value == day)?.label,
        dayOfWeek: day,
        startHour: "08:00:00" as unknown as TimeSpan,
        endHour: "17:00:00" as unknown as TimeSpan,
      })
      form.setFieldsValue({ details: details });
    }


  };

  useEffect(() => {
    getGolfCourseData();
  }, []);

  const getGolfCourseData = async () => {
    const result = await TeeTimeConfigService.getGolfCourseComboOptions({});
    setGolfCourseData({ data: Utils.mapCommonSelectOption(result), isPending: false });
  };

  const convertTimeSpan = (time: any) => {
    return time
      ? (time
        ? dayjs(time.toString(), "HH:mm").format("HH:mm:ss") as unknown as TimeSpan
        : dayjs(time, "HH:mm:ss").format("HH:mm:ss") as unknown as TimeSpan)
      : undefined;
  };

  const onOkModal = async () => {
    try {
      const formValue = await form.validateFields();
      const input: GolfTeeTimeConfigDto = formValue;
      if (input.applyMode == 2) {
        if (input.details?.length == 0) {
          uiUtils.showError(t("vuiLongChonNgayApDungChiTiet"));
          return;
        }
      }
      if (formValue.applyDateRange) {
        const [start, end] = formValue.applyDateRange || [];
        input.applyFromDate = start?.toDate();
        input.applyToDate = end?.toDate();
      }
      // map về kiểu timeSpan
      input.details?.map((item: GolfTeeTimeConfigDetailDto) => {
        item.startHour = convertTimeSpan(item.startHour);
        item.endHour = convertTimeSpan(item.endHour);
      }
      );
      input.startHour = convertTimeSpan(formValue.startHour);

      input.endHour = convertTimeSpan(formValue.endHour)

      UiUtils.setBusy();

      const isCreate = modalData.mode === 'addNew';
      const apiFun = isCreate
        ? mainStore.createEntity({ ...input })
        : mainStore.updateEntity({ ...input });

      await apiFun.then(result => {
        if (result) {
          UiUtils.showSuccess(
            t(isCreate ? 'addNewSuccess' : 'updateSuccess', { ...input }) as any
          );
          form.resetFields();
          mainStore.closeModal(true);
        }
      })
    } catch (error) {
      // @ts-ignore
      if (error.name === 'ValidationError') {
        UiUtils.showCommonValidateForm();
      } else {
        console.error("Error during CRUD operation:", error);
      }
    } finally {
      UiUtils.clearBusy();
    }
  };


  return (
    <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
      <Modal
        title={modalData.mode === "addNew" ? t("title.addNew") : t("title.viewDetail")}
        open={modalData.visible}
        width={modalData.width || 550}
        maskClosable={false}
        style={{ top: "30px" }}
        onCancel={() => mainStore.closeModal()}
        destroyOnClose
        onOk={onOkModal}
        footer={
          <FooterCrudModal
            hiddenOk={modalData.mode === "viewDetail"}
            onOk={onOkModal}
            onCancel={() => mainStore.closeModal()}
          />
        }
      >
        <Form form={form}>
          <Row gutter={[16, 16]}>
            <Col span={8} hidden>
              <Form.Item name="id" >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <FloatLabel label={t("maSan")}>
                <Form.Item name="maSan" >
                  <Input disabled />
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={8}>
              <FloatLabel label={t("tenSan")} required>
                <Form.Item name="courseId" rules={[validateUtils.required]}>
                  <OrdSelect onChange={(value: any, option: any) => { form.setFieldsValue({ maSan: option?.data?.code }) }}
                    datasource={golfCourseData || { data: [], isPending: true }}
                    allowClear
                  />
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={8}>
              <FloatLabel label={t("teeTimeType")} required>
                <Form.Item name="teeTimeType" rules={[validateUtils.required]}>
                  <OrdSelect
                    datasource={useSelectTeeTimeType()}
                    allowClear
                  />
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={12}>
              <FloatLabel label={t("khoangCachTeeTime")} required>
                <Form.Item name="intervalMinutes" rules={[validateUtils.required]}>
                  <Input addonAfter={t("minute")} />
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={12}>
              <FloatLabel label={t("soFlight")} required>
                <Form.Item name="maxGroupPerFlight" rules={[validateUtils.required]}>
                  <Input />
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={6}>
              <FloatLabel label={t("gioBatDau")} required={applyMode == 1} >
                <Form.Item name="startHour" rules={applyMode == 1 ? [validateUtils.required] : []}>
                  <OrdTimeInput format="HH:mm" disable={applyMode == 2} />
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={6}>
              <FloatLabel label={t("gioKetThuc")} required={applyMode == 1}>
                <Form.Item name="endHour" rules={applyMode == 1 ? [validateUtils.required, ValidateUtils.timeIsAfterOrEqual('startHour')] : [ValidateUtils.timeIsAfterOrEqual('startHour')]} >
                  <OrdTimeInput format="HH:mm" disable={applyMode == 2} />
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={12}>
              <FloatLabel label={t("thoiGianApDung")} required>
                <Form.Item name="applyMode" rules={[validateUtils.required]}>
                  <OrdSelect
                    datasource={useSelectApplyDayModeType()}
                    allowClear
                  />
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={12}>
              <FloatLabel label={t('thoiGianHieuLuc')} required>
                <Form.Item name='applyDateRange' rules={[validateUtils.required]}>
                  <RangePicker style={{ width: "100%" }} />
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={12}>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {dayOfWeekOptions.map(day => (
                  <Button
                    key={day.value} disabled={applyMode != 2}
                    type={details?.some(x => x.dayOfWeek == day.value) ? 'primary' : 'default'}
                    onClick={() => toggleDay(day.value)}
                    className="valid-date-range-button"
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </Col>
            <Col span={24} hidden={applyMode != 2}>
              <Spin spinning={isSpinning}>
                <table className="min-w-full bg-white border border-gray-200 min-h-[100px]">
                  <thead className="product-table-h">
                    <tr>
                      <th className={thClassName + ' w-[90px] text-center'}>
                        {t('ngayApDung')}
                      </th>
                      <th className={thClassName + ' w-[120px] text-center'}>
                        {t('gioBatDau')}<span className={"text-red"}> (*)</span>
                      </th>
                      <th className={thClassName + ' w-[120px] text-center'}>
                        {t('gioKetThuc')}<span className={"text-red"}> (*)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <Form.List name="details" >
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <tr className="even:bg-gray-50 grid-form" key={key}>
                              <td className={tdClassName}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'name']}
                                  rules={[ValidateUtils.required]}
                                >
                                  <Input disabled />
                                </Form.Item>
                                <Form.Item hidden
                                  {...restField}
                                  name={[name, 'dayOfWeek']}
                                >
                                  <Input />
                                </Form.Item>
                              </td>
                              <td className={tdClassName}>
                                <Form.Item {...restField} name={[name, 'startHour']}
                                  rules={[ValidateUtils.required]}>
                                  <OrdTimeInput format="HH:mm" ></OrdTimeInput>
                                </Form.Item>
                              </td>
                              <td className={tdClassName}>
                                <Form.Item {...restField} name={[name, 'endHour']}
                                  rules={[ValidateUtils.required, ValidateUtils.timeIsAfterOrEqual(['details', name, 'startHour'])]}>
                                  <OrdTimeInput format="HH:mm" ></OrdTimeInput>
                                </Form.Item>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </Form.List>
                  </tbody>
                </table>
              </Spin>

            </Col>
          </Row>
          <Col span={8}>
            <Form.Item name='isActived' valuePropName="checked" initialValue={true}>
              <Checkbox>{t('isActive')}</Checkbox>
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </HotkeysProvider>

  );
};

export default observer(TeeTimeConfigModal);


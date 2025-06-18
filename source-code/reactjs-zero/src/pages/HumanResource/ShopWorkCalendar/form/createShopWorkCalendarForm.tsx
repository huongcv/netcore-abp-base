import './createShopWorkCalendarForm.scss';
import { Checkbox, Col, Form, FormInstance, GetProp, Input, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "@ord-store/index";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdTimeInput from "@ord-components/forms/OrdTimeInput";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import UiUtils from "@ord-core/utils/ui.utils";
import { useEffect } from 'react';
import { DAY_OF_WEEK, ShopWorkCalendarDetailDto, ShopWorkCalendarDto } from '@api/index.defs';
import uiUtils from '@ord-core/utils/ui.utils';
import { ShopWorkCalendarDetailService } from '@api/ShopWorkCalendarDetailService';
import { ShopWorkCalendarService } from '@api/ShopWorkCalendarService';
import Utils from "@ord-core/utils/utils";
import { l } from "@ord-core/language/lang.utils";
import dayjs from "dayjs";
import { NamePath } from "antd/es/form/interface";
import { HotkeysProvider, useHotkeys } from 'react-hotkeys-hook';
import { HotKeyScope } from '@ord-core/AppConst';
import validateUtils from '@ord-core/utils/validate.utils';

const { TextArea } = Input

const CreateShopWorkCalendarForm = () => {
    const tdClassName = "py-2 px-2 border-b border-gray-200 text-gray-800 align-top";
    const thClassName = "py-2 px-1 border-b border-gray-200 text-left text-gray-600";
    const { t } = useTranslation('shop-work-calendar');
    const { t: tEnum } = useTranslation('enum');
    const { shopWorkCalendarStore: store } = useStore()
    const [formCreate] = Form.useForm();
    const dayOfWeekOptions = [
        {
            value: 0 as DAY_OF_WEEK,
            label: tEnum('dayOfWeek.SUNDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(tEnum('dayOfWeek.SUNDAY'))
        }, {
            value: 1 as DAY_OF_WEEK,
            label: tEnum('dayOfWeek.MONDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(tEnum('dayOfWeek.MONDAY'))
        }, {
            value: 2 as DAY_OF_WEEK,
            label: tEnum('dayOfWeek.TUESDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(tEnum('dayOfWeek.TUESDAY'))
        }, {
            value: 3 as DAY_OF_WEEK,
            label: tEnum('dayOfWeek.WEDNESDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(tEnum('dayOfWeek.WEDNESDAY'))
        }, {
            value: 4 as DAY_OF_WEEK,
            label: tEnum('dayOfWeek.THURSDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(tEnum('dayOfWeek.THURSDAY'))
        }, {
            value: 5 as DAY_OF_WEEK,
            label: tEnum('dayOfWeek.FRIDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(tEnum('dayOfWeek.FRIDAY'))
        }, {
            value: 6 as DAY_OF_WEEK,
            label: tEnum('dayOfWeek.SATURDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(tEnum('dayOfWeek.SATURDAY'))
        },
    ];

    const fetchWorkCalendarDetails = async () => {
        try {
            uiUtils.setBusy();
            const id = formCreate.getFieldValue('id');
            if (id > 0) {
                const result = await ShopWorkCalendarDetailService.getPaged({
                    body: {
                        workCalendarId: id,
                        maxResultCount: 999,
                        skipCount: 0
                    }
                });
                if (Utils.isNotNull(result.items)) {
                    result.items?.map((item: ShopWorkCalendarDetailDto) =>
                        item.name = tEnum(item.name || "")
                    );
                    formCreate.setFieldsValue({ details: result.items });
                }
            }
        } catch (error) {
            console.error("Failed to fetch work calendar details:", error);
        } finally {
            uiUtils.clearBusy();
        }
    }

    useEffect(() => {
        if (store.createOrUpdateModal.mode == "update") {
            if (store.entityUpdateData.id) {
                formCreate.setFieldsValue({
                    ...store.entityUpdateData,
                    hourPerDay: Math.floor(store.entityUpdateData.hourPerDay),
                    listDayOfWeekList: store.entityUpdateData.listDayOfWeek?.split(",").map((x: string) => parseInt(x)),
                });
                fetchWorkCalendarDetails();
            }
        }
    }, [store.entityUpdateData])

    const save = async () => {
        try {
            const data = await formCreate.validateFields();
            UiUtils.setBusy();
            data.listDayOfWeek = data.listDayOfWeekList?.sort()?.toString();

            await ShopWorkCalendarService.createOrUpdate({ body: data }).then(x => {
                if (x.isSuccessful) {
                    UiUtils.showSuccess(t('addNewSuccess', {
                        ...data
                    }) as any);
                    formCreate.resetFields();
                    store.refreshGridData().then()
                    store.setIsShowCreateModal(false)
                } else {
                    UiUtils.showError(t(x.message ?? ""));
                }
            })

        } finally {
            UiUtils.clearBusy();
        }
    }

    const getMinutes = (timeStr: any) => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr?.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const calculateWorkingHours = (values: any, form: FormInstance) => {
        const { hourFrom, hourTo, hourBreakTimeFrom, hourBreakTimeTo } = values;
        const startMinutes = getMinutes(hourFrom);
        const endMinutes = getMinutes(hourTo);
        const breakStartMinutes = getMinutes(hourBreakTimeFrom);
        const breakEndMinutes = getMinutes(hourBreakTimeTo);

        let totalMinutes = endMinutes >= startMinutes ?
            (endMinutes - startMinutes) :
            (24 * 60 - startMinutes + endMinutes);

        let breakDuration = 0;
        if ((breakStartMinutes > breakEndMinutes)) {
            return;
        }

        if (hourBreakTimeFrom && hourBreakTimeTo) {
            breakDuration = breakEndMinutes >= breakStartMinutes ?
                (breakEndMinutes - breakStartMinutes) :
                (24 * 60 - breakStartMinutes + breakEndMinutes);
        }

        totalMinutes -= breakDuration;

        const hours = Math.round((totalMinutes / 60) * 100) / 100;
        formCreate.setFieldValue("hourPerDay", hours);
        return hours;
    }

    const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {

        const details: ShopWorkCalendarDetailDto[] = formCreate.getFieldValue("details");
        const listDetailEmpty: ShopWorkCalendarDetailDto[] = [];

        if (checkedValues?.length > 0) {
            // @ts-ignore
            checkedValues.forEach((item: DayOfWeekTypeEnum) => {
                const info = details?.find((detail: ShopWorkCalendarDetailDto) => {
                    return detail.dayOfWeek === item;
                })

                if (Utils.isNotNull(info) && info != null) {
                    listDetailEmpty.push(info);
                } else {
                    listDetailEmpty.push({
                        name: dayOfWeekOptions[item].label,
                        dayOfWeek: item,
                        hourFrom: formCreate.getFieldValue("hourFrom"),
                        hourTo: formCreate.getFieldValue("hourTo"),
                        hourBreakTimeFrom: formCreate.getFieldValue("hourBreakTimeFrom"),
                        hourBreakTimeTo: formCreate.getFieldValue("hourBreakTimeTo"),
                    })
                }
            })
        }

        formCreate.setFieldsValue({
            "details": listDetailEmpty
        })
    };

    const timeIsBetween = (
        startField: NamePath,
        endField: NamePath
    ) => {
        return (form: any) => ({
            validator(_: any, value: string) {
                const start = form.getFieldValue(startField);
                const end = form.getFieldValue(endField);

                if (!value || !start || !end) {
                    return Promise.resolve();
                }
                const format = 'HH:mm';
                const val = dayjs(value, format);
                const startTime = dayjs(start, format);
                const endTime = dayjs(end, format);
                // Nếu endTime trước startTime -> khoảng thời gian qua nửa đêm
                const isOvernight = endTime.isBefore(startTime);

                const inRange = isOvernight
                    ? (val.isSame(startTime) || val.isAfter(startTime)) || (val.isSame(endTime) || val.isBefore(endTime))
                    : (val.isSame(startTime) || val.isAfter(startTime)) && (val.isSame(endTime) || val.isBefore(endTime));

                if (inRange) {
                    return Promise.resolve();
                }

                return Promise.reject(
                    new Error(
                        t('thoiGianNghiKhongThuocPhamViLamViec')
                    )
                );
            },
        });
    };

    const FormElement = (props: {
        form: FormInstance
    }) => {

        return (<>
            <Form form={props.form} 
                onValuesChange={(_, allValues) => calculateWorkingHours(allValues, props.form)}>
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item name='id' hidden>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={t('code')} required >
                            <Form.Item name='code' rules={[ValidateUtils.required,validateUtils.maxLength(50)]}>
                                <Input />
                            </Form.Item>
                        </FloatLabel>

                    </Col>

                    <Col span={6}>
                        <Form.Item
                            noStyle
                            name="isActived"
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Checkbox>{t("isActived")}</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            noStyle
                            name="isNightShift"
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Checkbox>{t("isNightShift")}</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <FloatLabel label={t('name')} required >
                            <Form.Item name='name' rules={[ValidateUtils.required,validateUtils.maxLength(100)]}>
                                <Input />
                            </Form.Item>
                        </FloatLabel>

                    </Col>


                    <Col span={24}>
                        <Row gutter={16}>

                            <Col span={5}>
                                <FloatLabel label={t('thoiGianBatDau')} required >
                                    <Form.Item name='hourFrom' rules={[ValidateUtils.required]}>
                                        <OrdTimeInput ></OrdTimeInput>
                                    </Form.Item>
                                </FloatLabel>

                            </Col>
                            <Col span={5}>
                                <FloatLabel label={t('thoiGianKetThuc')} required >
                                    <Form.Item name='hourTo' rules={[ValidateUtils.required]}>
                                        <OrdTimeInput  ></OrdTimeInput>
                                    </Form.Item>
                                </FloatLabel>

                            </Col>
                            <Col span={5}>
                                <FloatLabel label={t('thoiGianNghi')} >
                                    <Form.Item name='hourBreakTimeFrom' rules={[timeIsBetween('hourFrom', 'hourTo')]}>
                                        <OrdTimeInput ></OrdTimeInput>
                                    </Form.Item>
                                </FloatLabel>

                            </Col>
                            <Col span={5}>
                                <FloatLabel label={t('thoiGianNghiKetThuc')}  >
                                    <Form.Item name='hourBreakTimeTo' rules={[ValidateUtils.timeIsAfterOrEqual('hourBreakTimeFrom'), timeIsBetween('hourFrom', 'hourTo')]}>
                                        <OrdTimeInput disabledTime={(current) => {
                                            const fromValue = formCreate.getFieldValue("hourBreakTimeFrom"); ///validate thời gian kết thúc không được trước thời gian bắt đầu
                                            if (!fromValue) return {};
                                            const [fromHour, fromMinute] = fromValue.split(':').map(Number);
                                            return {
                                                disabledHours: () => {
                                                    const hours = [];
                                                    for (let i = 0; i < fromHour; i++) {
                                                        hours.push(i);
                                                    }
                                                    return hours;
                                                },
                                                disabledMinutes: (selectedHour: number) => {
                                                    if (selectedHour === fromHour) {
                                                        const minutes = [];
                                                        for (let i = 0; i < fromMinute; i++) {
                                                            minutes.push(i);
                                                        }
                                                        return minutes;
                                                    }
                                                    return [];
                                                }
                                            };
                                        }}></OrdTimeInput>
                                    </Form.Item>
                                </FloatLabel>

                            </Col>

                            <Col span={4}>
                                <FloatLabel label={t('soGioLamViec')}  >
                                    <Form.Item name='hourPerDay' >
                                        <Input disabled />
                                    </Form.Item>
                                </FloatLabel>

                            </Col>
                        </Row>
                    </Col>

                    <Col span={24}>
                        <FloatLabel label={t('notes')} >
                            <Form.Item name='notes' rules={[validateUtils.maxLength(200)]}>
                                <TextArea rows={1} />
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={24} className='mb-3'>
                        <h3 className='ant-modal-title'>{t('shopWorkCalenderDetails')}</h3>
                    </Col>
                    <Col span={24}>
                        <Form.Item name='listDayOfWeekList' rules={[ValidateUtils.required]}>
                            <Checkbox.Group options={dayOfWeekOptions} onChange={onChange} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <table className="min-w-full bg-white border border-gray-200 min-h-[100px]">
                            <thead className="product-table-h">
                                <tr>
                                    <th className={thClassName + ' w-[90px] text-center'}>
                                        {t('dayOfWeek')}
                                    </th>
                                    <th className={thClassName + ' w-[120px] text-center'}>
                                        {t('hourFrom')}<span className={"text-red"}> (*)</span>
                                    </th>
                                    <th className={thClassName + ' w-[120px] text-center'}>
                                        {t('hourTo')}<span className={"text-red"}> (*)</span>
                                    </th>
                                    <th className={thClassName + ' w-[120px] text-center'}>
                                        {t('hourBreakTimeFrom')}
                                    </th>
                                    <th className={thClassName + ' w-[120px] text-center'}>
                                        {t('hourBreakTimeTo')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <Form.List name="details">
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
                                                        <Form.Item {...restField} name={[name, 'hourFrom']}
                                                            rules={[ValidateUtils.required]}>
                                                            <OrdTimeInput ></OrdTimeInput>
                                                        </Form.Item>
                                                    </td>
                                                    <td className={tdClassName}>
                                                        <Form.Item {...restField} name={[name, 'hourTo']}
                                                            rules={[ValidateUtils.required]}>
                                                            <OrdTimeInput ></OrdTimeInput>
                                                        </Form.Item>
                                                    </td>
                                                    <td className={tdClassName}>
                                                        <Form.Item {...restField} name={[name, 'hourBreakTimeFrom']} rules={[
                                                            timeIsBetween(['details', name, 'hourFrom'], ['details', name, 'hourTo'])(
                                                                formCreate
                                                            ),
                                                        ]}>
                                                            <OrdTimeInput ></OrdTimeInput>
                                                        </Form.Item>
                                                    </td>
                                                    <td className={tdClassName}>
                                                        <Form.Item {...restField} name={[name, 'hourBreakTimeTo']} rules={[
                                                            ValidateUtils.timeIsAfterOrEqual(['details', name, 'hourBreakTimeFrom']),
                                                        ]}>
                                                            <OrdTimeInput disabledTime={(current) => {
                                                                const fromValue = formCreate.getFieldValue(['details', name, 'hourBreakTimeFrom']); ///validate thời gian kết thúc không được trước thời gian bắt đầu
                                                                if (!fromValue) return {};
                                                                const [fromHour, fromMinute] = fromValue.split(':').map(Number);
                                                                return {
                                                                    disabledHours: () => {
                                                                        const hours = [];
                                                                        for (let i = 0; i < fromHour; i++) {
                                                                            hours.push(i);
                                                                        }
                                                                        return hours;
                                                                    },
                                                                    disabledMinutes: (selectedHour: number) => {
                                                                        if (selectedHour === fromHour) {
                                                                            const minutes = [];
                                                                            for (let i = 0; i < fromMinute; i++) {
                                                                                minutes.push(i);
                                                                            }
                                                                            return minutes;
                                                                        }
                                                                        return [];
                                                                    }
                                                                };
                                                            }}
                                                            ></OrdTimeInput>
                                                        </Form.Item>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Form>
        </>
        )
    }

    useHotkeys('F8', (event) => {
        formCreate.submit();
        event.preventDefault();
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });


    useHotkeys('F10', (event) => {
        store.setIsShowCreateModal(false)
        event.preventDefault();
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });


    return <>
        <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
            <Modal
                width={1000}
                title={store.createOrUpdateModal.mode == "addNew" ? t('titleAddNew') : t('titleUpdate')}
                open={store.isShowCreateModal}

                onCancel={() => store.setIsShowCreateModal(false)}
                footer={<FooterCrudModal
                    hasAddNewContinue={false}
                    isAddNewContinue={false}

                    onOk={save}
                    onCancel={() => store.setIsShowCreateModal(false)}
                />}
            >
                <FormElement form={formCreate}></FormElement>
            </Modal>
        </HotkeysProvider>


    </>
}

export default observer(CreateShopWorkCalendarForm);

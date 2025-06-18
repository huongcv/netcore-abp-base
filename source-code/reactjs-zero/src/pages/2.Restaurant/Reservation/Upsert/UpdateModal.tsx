import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import RegexUtil from "@ord-core/utils/regex.util";
import PartnerAutoComplete from "@pages/2.Restaurant/Reservation/Utils/PartnerAutoComplete";
import TableTreeSelect from "@pages/2.Restaurant/Reservation/Utils/TableTreeSelect";
import { Col, Form, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import './Upsert.scss';
import GuestSelector, { GuestSelectorValue } from "../Utils/GuestSelector";
import { useEffect } from "react";
import { useStore } from "@ord-store/index";
import { ReservationService } from "@api/ReservationService";
import uiUtils from "@ord-core/utils/ui.utils";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import validateUtils from "@ord-core/utils/validate.utils";
import PartnerInput from "@pages/AccountantManagement/Shared/forms/PartnerInput";

const UpdateModal = () => {
    const { t } = useTranslation('resvervation');
    const today = new Date();
    const form = Form.useFormInstance();
    const { reservationStore } = useStore();


    const onChangeGuest = (value: GuestSelectorValue) => {
        form.setFieldValue('numberOfAdult', value.adults);
        form.setFieldValue('numberOfChildren', value.children);
        form.setFieldValue('numberOfCustomer', value.adults + value.children);
    }

    useEffect(() => {
        if (reservationStore.createOrUpdateModal.entityData) {
            uiUtils.setBusy();
            const dto = reservationStore.createOrUpdateModal.entityData;
            ReservationService.getById({
                idHash: dto.idHash
            }).then(res => {
                uiUtils.clearBusy();
                if (res.isSuccessful) {
                    form.setFieldsValue(res.data);
                    form.setFieldsValue({ guestInfo: { adults: res.data?.numberOfAdult, children: res.data?.numberOfChildren } })
                }
            }).finally(() => {
                uiUtils.clearBusy();
            })
        }
    }, [reservationStore.createOrUpdateModal.entityData])

    return (
        <>
            <Row gutter={12}>
                <Col span={24}>
                    <FloatLabel label={t('Mã đặt bàn')}>
                        <Form.Item name='reservationCode' rules={[validateUtils.required]}>
                            <OrdInputRegexText
                                maxLength={50}
                                regex={RegexUtil.CodeRegex}
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t('Tên người đặt bàn')} required>
                        <Form.Item name='partnerId'>
                            <PartnerInput partner_type={1} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t('Số điện thoại')}>
                        <Form.Item name='partnerPhone' rules={[validateUtils.phoneNumberVietNam]}>
                            <Input />
                        </Form.Item>
                    </FloatLabel>
                </Col>
               
                <Col span={24}>
                    <h2 className='mb-4'>{t('Thông tin đặt bàn')}</h2>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t('Thời gian')} required>
                        <Form.Item name='reservationDate'>
                            <OrdDateTimeInput
                                rootClassName='date-reservation'
                                format={{
                                    format: 'DD/MM/YYYY HH:mm',
                                    type: 'mask',
                                }}
                                disabledDate={(current) => {
                                    return current && current.isBefore(dayjs(), 'day');
                                }}
                                disabledTime={(current) => {
                                    if (!current) return {};

                                    const now = dayjs();
                                    if (current.isSame(now, 'day')) {
                                        return {
                                            disabledHours: () => {
                                                const hours = [];
                                                for (let i = 0; i < now.hour(); i++) {
                                                    hours.push(i);
                                                }
                                                return hours;
                                            },
                                            disabledMinutes: (selectedHour) => {
                                                if (selectedHour === now.hour()) {
                                                    const minutes = [];
                                                    for (let i = 0; i < now.minute(); i++) {
                                                        minutes.push(i);
                                                    }
                                                    return minutes;
                                                }
                                                return [];
                                            },
                                            disabledSeconds: (selectedHour, selectedMinute) => {
                                                if (selectedHour === now.hour() && selectedMinute === now.minute()) {
                                                    const seconds = [];
                                                    for (let i = 0; i < now.second(); i++) {
                                                        seconds.push(i);
                                                    }
                                                    return seconds;
                                                }
                                                return [];
                                            },
                                        };
                                    }
                                    return {
                                        disabledHours: () => [],
                                        disabledMinutes: () => [],
                                        disabledSeconds: () => [],
                                    };
                                }}
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t('Bàn')}>
                        <Form.Item name='tableId'>
                            <TableTreeSelect />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={24}>
                    <FloatLabel label={t('Số lượng')}>
                        <Form.Item name='guestInfo' initialValue={{ adults: 1, children: 0 }}>
                            <GuestSelector onChange={(val: GuestSelectorValue) => onChangeGuest(val)} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={24}>
                    <FloatLabel label={t('Ghi chú')}>
                        <Form.Item name='notes'>
                            <TextArea rows={2} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
            <div hidden>
                <Form.Item name='numberOfAdult' />
                <Form.Item name='numberOfChildren' />
                <Form.Item name='numberOfCustomer' />
                <Form.Item name="id" />
                <Form.Item name="idHash"/>
            </div>
        </>
    );
};

export default UpdateModal;
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
import validateUtils from "@ord-core/utils/validate.utils";
import PartnerInput from "@pages/AccountantManagement/Shared/forms/PartnerInput";

const CreateModal = () => {
    const { t } = useTranslation('resvervation');
    const today = new Date();
    const form = Form.useFormInstance();

    const onChangeGuest = (value: GuestSelectorValue) => {
        form.setFieldValue('numberOfAdult', value.adults);
        form.setFieldValue('numberOfChildren', value.children);
        form.setFieldValue('numberOfCustomer', value.adults + value.children);
    }

    const roundToNextHalfHour = (date = dayjs()) => {
        const minute = date.minute();
        const roundedMinute = minute < 30 ? 30 : 0;
        const roundedHour = minute < 30 ? date.hour() : date.add(1, 'hour').hour();
        return date.set('hour', roundedHour).set('minute', roundedMinute).set('second', 0);
    };

    useEffect(() => {
        form.setFieldsValue({
            numberOfAdult: 1,
            numberOfChildren: 0,
            numberOfCustomer: 1,
        })
    }, [])

    return (
        <>
            <Row gutter={12}>
                <Col span={24}>
                    <FloatLabel label={t('Mã đặt bàn')}>
                        <Form.Item name='reservationCode'>
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
                            <PartnerInput partner_type={1}/>
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


                <Col span={12}>
                    <FloatLabel label={t('Thời gian')} required>
                        <Form.Item
                            name='reservationDate'
                            initialValue={roundToNextHalfHour().toDate()}
                        >
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
                        <Form.Item name='guestSelector'>
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
            </div>
        </>
    );
};

export default CreateModal;
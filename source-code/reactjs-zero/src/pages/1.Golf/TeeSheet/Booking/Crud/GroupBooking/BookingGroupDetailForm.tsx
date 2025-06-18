import React from "react";
import {Card, Checkbox, Col, Flex, Form, Input, InputNumber, Row, Select, Switch, TimePicker} from "antd";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useGameType} from "@ord-components/forms/select/selectDataSource/golf/useGameType";
import SelectCaddy from "@pages/1.Golf/Category/GolfCaddy/shared/SelectCaddy";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {
    useSelectGolfBookingSourceEnum
} from "@ord-components/forms/select/selectDataSource/golf/useSelectGolfBookingSourceEnum";
import {BookingSourceEnum} from "@pages/1.Golf/TeeSheet/Booking/enum/paymentModeEnum";

const {TextArea} = Input;

const BookingGroupDetailForm = (props: {
    dataSourceTeeTime: SelectDataSource,
    sourceGameTypeAllow: SelectDataSource,
}) => {
    const {
        golfBookingStore: mainStore,
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    return (
        <Card title={<strong>{t('bookingInfo')}</strong>}
              styles={
                  {
                      header: {
                          borderBottom: "none",
                          marginTop: "10px"
                      },
                  }
              }
              extra={<div className='flex'>
                  <Form.Item layout='horizontal' name="isSharedFlight" valuePropName="checked" initialValue={true}>
                      <Switch checkedChildren="On" unCheckedChildren="Off"/>
                  </Form.Item>
                  <strong className="mt-1 ml-1">{t('isSharedFlight')}</strong>
              </div>}>
            <Row gutter={[16, 8]}>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('gameType')} required>
                        <Form.Item name="gameType" rules={[ValidateUtils.required]}>
                            <OrdSelect datasource={props.sourceGameTypeAllow}></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)} >
                    <FloatLabel label={t('playDate')} required>
                        <Form.Item name="playDate" rules={[ValidateUtils.required]}>
                            <OrdDateInput></OrdDateInput>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('teeTime')} required>
                        <Form.Item name="teeTime" rules={[ValidateUtils.required]}>
                            <OrdSelect datasource={props.dataSourceTeeTime}></OrdSelect>
                            {/*<Select options={[{label: 'n/a', value: 'n/a'}]}/>*/}
                        </Form.Item>
                    </FloatLabel>
                </Col>

                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('totalPlayers')} required>
                        <Form.Item name="totalPlayers" initialValue={1} rules={[ValidateUtils.required]}>
                            <InputNumber autoFocus min={1} max={50} step={1} className='w-full'></InputNumber>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('source')}>
                        <Form.Item name="bookingSource" initialValue={BookingSourceEnum.Walkin}>
                            <OrdSelect datasource={useSelectGolfBookingSourceEnum()}></OrdSelect>
                        </Form.Item>
                    </FloatLabel>

                </Col>

                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('salesPerson')}>
                        <Form.Item name="salesPerson">
                            <Select allowClear options={[{label: 'n/a', value: 1}]}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>

                <Col {...useResponsiveSpan(24)}>
                    <FloatLabel label={t('note')}>
                        <Form.Item name="note">
                            <TextArea rows={1}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
        </Card>
    );
};

export default BookingGroupDetailForm;

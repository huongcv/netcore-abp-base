import React from "react";
import {Card, Checkbox, Col, Form, Input, InputNumber, Row, Select, Switch, TimePicker} from "antd";
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

const BookingDetailForm = (props: {
    dataSourceTeeTime: SelectDataSource,
    sourceGameTypeAllow: SelectDataSource,
    srcGroupBooking: SelectDataSource,

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
                  <Form.Item layout='horizontal' name="isSharedFlight" valuePropName="checked">
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
                <Col {...useResponsiveSpan(8)}>
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
                    <FloatLabel label={t('group')}>
                        <Form.Item name="bookingGroupId">
                            <OrdSelect datasource={props.srcGroupBooking}></OrdSelect>
                            {/*<Select allowClear options={[{label: 'n/a', value: 1}]}/>*/}
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('source')}>
                        <Form.Item name="bookingSource"  initialValue={BookingSourceEnum.Walkin}>
                            <OrdSelect datasource={useSelectGolfBookingSourceEnum()}></OrdSelect>
                        </Form.Item>
                    </FloatLabel>

                </Col>
                {/*<Col {...useResponsiveSpan(8)}>*/}
                {/*    <FloatLabel label="marketSegment">*/}
                {/*        <Form.Item name="marketSegment">*/}
                {/*            <Select options={[{label: 'n/a', value: 'n/a'}]}/>*/}
                {/*        </Form.Item>*/}
                {/*    </FloatLabel>*/}

                {/*</Col>*/}
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('salesPerson')}>
                        <Form.Item name="salesPerson">
                            <Select allowClear options={[{label: 'n/a', value: 1}]}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('requestedBy')}>
                        <Form.Item name="requestedBy">
                            <Input/>
                        </Form.Item>
                    </FloatLabel>

                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('contactNo')}>
                        <Form.Item name="contactNo">
                            <Input/>
                        </Form.Item>
                    </FloatLabel>

                </Col>
                {/*<Col {...useResponsiveSpan(8)}>*/}
                {/*    <FloatLabel label={t('referenceNo')}>*/}
                {/*        <Form.Item name="referenceNo">*/}
                {/*            <Input/>*/}
                {/*        </Form.Item>*/}
                {/*    </FloatLabel>*/}
                {/*</Col>*/}

                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('bagTagNo')}>
                        <Form.Item name="bagTagNo">
                            <Input/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('noOfGallery')}>
                        <Form.Item name="noOfGallery">
                            <InputNumber min={0} style={{width: '100%'}}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('noOfBuggy')}>
                        <Form.Item name="noOfBuggy">
                            <InputNumber min={0} style={{width: '100%'}}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('noOfCaddy')}>
                        <Form.Item name="noOfCaddy">
                            <InputNumber min={0} style={{width: '100%'}}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>

                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('preferredCaddy')}>
                        <Form.Item name="preferredCaddyId">
                            <SelectCaddy />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('caddyAssigned')}>
                        <Form.Item name="caddyAssignedId">
                        <SelectCaddy />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel>
                        <Form.Item name="sharedCaddy" valuePropName="checked">
                            <Checkbox>{t('sharedCaddy')}</Checkbox>
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

export default BookingDetailForm;

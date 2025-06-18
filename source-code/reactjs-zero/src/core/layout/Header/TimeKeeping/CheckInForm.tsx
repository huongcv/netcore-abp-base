
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import { EmployeeTimekeepingDto } from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import "./CheckInForm.scss"
import { GetFileUrl } from "@ord-core/service-proxies/axios.base";
import ImgCrop from "antd-img-crop";
import { Button, Col, Row, Upload } from "antd";
import UiUtils from "@ord-core/utils/ui.utils";

const CheckInForm = (prop: { isRefresh?: number }) => {
    const { EmployeeTimekeepingStore: store } = useStore();
    const [t] = useTranslation(['employeeTimekeeping']);
    const [summaryData, setData]
        = useState<EmployeeTimekeepingDto>();


    const ShowDayOfWeekToday = () => {

        const today = new Date();
        let dayString = ""
        switch (today.getDay()) {
            case 0: {
                dayString = t('dayOfWeek.SUNDAY');
                break;
            }
            case 1: {
                dayString = t('dayOfWeek.MONDAY');
                break;
            }
            case 2: {
                dayString = t('dayOfWeek.TUESDAY');
                break;
            }
            case 3: {
                dayString = t('dayOfWeek.WEDNESDAY');
                break;
            }
            case 4: {
                dayString = t('dayOfWeek.THURSDAY');
                break;
            }
            case 5: {
                dayString = t('dayOfWeek.FRIDAY');
                break;
            }
            case 6: {
                dayString = t('dayOfWeek.SATURDAY');
                break;
            }

        }
        return <span >
            {dayString}
            &nbsp;
            {DateUtil.toFormat(today, 'DD/MM/YYYY')}
        </span>
    }
    useEffect(() => {
        UiUtils.setBusy();
        refreshData()
    }, [prop.isRefresh]);

    const refreshData = () => {
        store.apiService().getTimekeepingToday().then(x => {
            setData(x.data);

        }).finally(() => { UiUtils.clearBusy() })
    }

    const onCheckIn = () => {
        UiUtils.setBusy();
        store.apiService().checkIn().then(x => {
            if (x.isSuccessful) {
                refreshData()
            } else {
                UiUtils.showError(x.notification?.message)
            }
        }).finally(() => { UiUtils.clearBusy() })
    }

    const onCheckOut = () => {
        UiUtils.setBusy();
        store.apiService().checkOut().then(x => {
            if (x.isSuccessful) {
                refreshData()
            }
            else {
                UiUtils.showError(t('CoLoiXayRa'))
                UiUtils.clearBusy()
            }
        })
    }
    const ShowAvatar = () => {
        // const signatureId = summaryData?.signatureId ? GetFileUrl(summaryData?.signatureId) : "./public/images/user-avatar.png";

        return <ImgCrop rotationSlider>
            <Upload
                name="signature"
                listType="picture-card"
                className="signature-image-upload border-none"
                showUploadList={false}
                disabled={true}
                style={{
                    width: 350,
                    height: 350
                }}
            >
                <img src= "/images/user-avatar.png" alt="No image" style={{ width: '100%' }} />

            </Upload>
        </ImgCrop>
    }
    return (
        <>

            <div className={'w-full align-center text-center justify-center'}>
                <ShowAvatar></ShowAvatar>
                <h1 className={"employeeNameTitle"}>{summaryData?.employeeName}</h1>
                <span> <ShowDayOfWeekToday></ShowDayOfWeekToday></span>
            </div>
            <div className={'w-full align-center text-center justify-center'}>
                <span style={{fontSize:18,fontWeight:500}}>{summaryData?.workCalendarName}</span>
            </div>
            <div className={'w-full info-checkIn mb-[30px] mt-[20px]'}>
                <Row gutter={8}>
                    <Col span={12} className='grid align-center text-center  justify-center'>
                        <span className={'check-title'}>{t('gioVao')}</span>
                        {summaryData?.checkIn &&
                            <span style={{ "color": `${summaryData.lateInMinutes === 0 ? "green" : "red"}` }}
                                className={'checkIn-time-inTime'}>{DateUtil.toFormat(summaryData?.checkIn, "HH:mm")}
                            </span>
                        }
                        {!summaryData?.checkIn &&
                            <span className={'checkIn-time-inTime'}>-- --</span>
                        }
                        <Button onClick={() => onCheckIn()} disabled={summaryData?.checkIn !== null || summaryData == null}
                            type={"primary"}
                            className={'mt-2 w-[150px]'}>{t('checkIn')}</Button>
                    </Col>

                    <Col span={12} className='grid align-center text-center justify-center'>
                        <span className={'check-title'}>{t('gioRa')}</span>
                        {summaryData?.checkOut &&
                            <span style={{ "color": `${summaryData?.earlyOutMinutes === 0 ? "green" : "red"}` }}
                                className={'checkOut-time-inTime'}>{DateUtil.toFormat(summaryData?.checkOut, "HH:mm")}</span>
                        }
                        {!summaryData?.checkOut &&
                            <span className={'checkIn-time-inTime'}>-- --</span>
                        }

                        <Button onClick={() => onCheckOut()} disabled={summaryData?.checkIn === null || summaryData == null || summaryData?.checkOut !== null }
                            type={"primary"}
                            className={'mt-2 w-[150px]'}>{t('checkOut')}</Button>
                    </Col>
                </Row>

            </div>

        </>

    )
}
export default CheckInForm;

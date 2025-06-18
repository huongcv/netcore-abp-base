import {DateRangeDto} from "@api/index.defs";
import React, {useEffect, useState} from "react";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import {Button, Col, Dropdown, MenuProps, Row, Space} from "antd";
import {ArrowRightOutlined, FilterOutlined} from "@ant-design/icons";
import DateUtil from "@ord-core/utils/date.util";
import {l} from "@ord-core/language/lang.utils";
import {ICommonInputProp} from "@ord-components/forms/model/ICommonInputProp";
import {useTranslation} from "react-i18next";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {Filter3Icon} from "@ord-components/icon/Filter3Icon";
import dayjs, {Dayjs} from 'dayjs';

interface Prop extends ICommonInputProp<DateRangeDto> {
    allowEq?: boolean;
    labelMode?: 'icon' | 'fromToLabel',
    notAllowFuture?: boolean, 
    onlyThreeMonths?: boolean, 
}

export const OrdDateRangeInput = (props: Prop) => {
    const {id, labelMode, value = {}, onChange} = props;
    const [startDate, setStartDate] = useState<any>();
    const [endDate, setEndDate] = useState<any>();
    const [dateRangeItems, setDateRangeItems] = useState<MenuProps | null>(null);
    const [t] = useTranslation();
    const triggerChange = (changedValue: DateRangeDto) => {
        onChange?.({startDate, endDate, ...value, ...changedValue});
    };

    useEffect(() => {
        setStartDate(props?.value?.startDate || null);
    }, [value?.startDate]);
    useEffect(() => {
        setEndDate(props?.value?.endDate || null);
    }, [value?.endDate]);
    const disabledStartDate = (curr: Dayjs) => {
        if (props.notAllowFuture){
            return DateUtil.disableAfterAndAfterNow(curr, endDate);
        }

        if (props.allowEq) {
            return DateUtil.disableAfter(curr, endDate);
        }

        if (props.onlyThreeMonths && endDate) {
           const startMoment = dayjs(endDate)
           const beforeThreeMonths = startMoment.subtract(3, 'months').startOf('day')
           const afterThreeMonths =  startMoment.add(3, 'months').startOf('day');
           return curr.isAfter(afterThreeMonths) || curr.isBefore(beforeThreeMonths) || curr.isAfter(endDate);
        }
        return DateUtil.disableAfterOrSame(curr, endDate);
    }
    const disabledEndDate = (curr: Dayjs) => {
        if (props.notAllowFuture){
            return DateUtil.disableBeforeAndAfterNow(curr, startDate);
        }
        
        if (props.allowEq) {
            return DateUtil.disableBefore(curr, startDate);
        }

        if (props.onlyThreeMonths && startDate) {
            const endMoment = dayjs(startDate)
            const beforeThreeMonths = endMoment.subtract(3, 'months').startOf('day')
            const afterThreeMonths =  endMoment.add(3, 'months').startOf('day');
            return curr.isAfter(afterThreeMonths) || curr.isBefore(beforeThreeMonths) || curr.isBefore(startDate);
         }
        return DateUtil.disableBeforeOrSame(curr, startDate);
    }

    const changeStartDate = (v: any) => {
        setStartDate(v);
        triggerChange({startDate: v});
    }
    const changeEndDate = (v: any) => {
        setEndDate(v);
        triggerChange({endDate: v});
    }
    useEffect(() => {
        const baseOptions = ['hom_nay', 'hom_qua', '7_ngay_truoc', '30_ngay_truoc', 'thang_nay', 'thang_truoc'];
    
        const extraOptions = props.onlyThreeMonths 
            ? [] 
            : ['nam_nay', 'nam_truoc', ...[1, 2, 3, 4].flatMap(it => [`quy_${it}_nam_nay`, `quy_${it}_nam_truoc`])];
    
        const items: MenuProps['items'] = [...baseOptions, ...extraOptions].map(opt => ({
            label: t('dateRangeOption.' + opt),
            key: opt,
            onClick: () => setDateRange(opt)
        }));
    
        setDateRangeItems({ items });
    }, [props.onlyThreeMonths]); 
    
    const setDateRange = (opt: string) => {
        const {startDate, endDate} = DateUtil.getDateRange(opt);
        changeStartDate(startDate);
        changeEndDate(endDate);
        triggerChange({
            startDate: startDate,
            endDate: endDate
        } as any);
    }
    const fromDate = <OrdDateInput {...props} value={startDate}
                                   onChange={changeStartDate}

                                   disabledDate={disabledStartDate}></OrdDateInput>;
    const toDate = <OrdDateInput {...props} value={endDate}

                                 onChange={changeEndDate}
                                 disabledDate={disabledEndDate}></OrdDateInput>;
    const dropDownOptionDateRangeQuickly = <>
        {dateRangeItems &&
            <Dropdown menu={dateRangeItems}>
                <Button className={'btn-other'} icon={<Filter3Icon/>}></Button>
            </Dropdown>
        }
    </>;
    const contentFromToDateLabel = (<>
        <Row gutter={9}>
            <Col span={11}>
                <FloatLabel label={t('fromDate')}>
                    {fromDate}
                </FloatLabel>

            </Col>
            <Col span={13}>
                <FloatLabel label={t('toDate')}>
                    <Space.Compact className='w-full' id={id}>
                        {toDate}
                        {dropDownOptionDateRangeQuickly}
                    </Space.Compact>
                </FloatLabel>

            </Col>
        </Row>

    </>);
    const contentIcon = (<>
        <Space.Compact className='w-full' id={id}>
            {fromDate}
            {/* <ArrowRightOutlined className='mx-1'/> */}
            <div className='mx-2'></div>
            {toDate}
            {dropDownOptionDateRangeQuickly}
        </Space.Compact>
    </>);
    return (<>
        {
            labelMode == 'fromToLabel' ? contentFromToDateLabel :
                contentIcon
        }

    </>);
}
export default OrdDateRangeInput;

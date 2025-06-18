import React, {useEffect, useState} from "react";
import {
    CaretDownOutlined, CloseOutlined,
    DownOutlined,
    LeftOutlined,
    RightOutlined,
    SearchOutlined,
    TagOutlined,
    UsergroupAddOutlined,
    UserOutlined
} from "@ant-design/icons";
import dayjs, {Dayjs} from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';
import {Button, DatePicker, Form, Tooltip} from "antd";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectGolfCourse} from "@ord-components/forms/select/selectDataSource/useSelectGolfCourse";
import {ReloadIcon} from "@ord-components/icon/ReloadIcon";
import {debounce} from "lodash";
import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import SearchInput from "@pages/1.Golf/TeeSheet/Booking/components/SearchInput";
import { useWatch } from "antd/es/form/Form";
// import SearchInput from "@pages/1.Golf/Booking/components/SearchInput";

dayjs.extend(isoWeek);

type WeekSelectorProps = {
    value?: string | Date | null | Dayjs;
    onChange?: (value: string | Date | Dayjs) => void;
    children?: React.ReactNode;
    onReload?: () => void;
    boardId: number;
};

const WeekSelector = (props: WeekSelectorProps) => {
    // const [selectedDate, setSelectedDate] = useState("10/05");
    // const weekDates = ["07/05", "08/05", "09/05", "10/05", "11/05", "12/05", "13/05"];
    const {
        golfBookingStore: mainStore,
    } = useStore();
    const [weekDates, setWeekDates] = useState<Dayjs[]>([]);
    const [valueDayjs, setValueDayjs] = useState<Dayjs | null>();
    const [weekOptions, setWeekOptions] = useState<number[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<number>(dayjs().isoWeek());
    const form = Form.useFormInstance();
    const w_playDate = Form.useWatch('playDate', form);
    const w_courseId = Form.useWatch('courseId', form);
    useEffect(() => {
        initWeekOptions(); // khởi tạo danh sách tuần 1-52/53
        if (!!props.value) {
            const val = dayjs(props.value);
            setValueDayjs(val);
            setSelectedWeek(val.isoWeek()); // tự động chọn tuần
            const lst = getWeekDays(val);
            setWeekDates(lst);
        } else {
            const now = dayjs();
            setValueDayjs(null);
            setSelectedWeek(now.isoWeek());
            const lst = getWeekDays(now);
            setWeekDates(lst);
        }
    }, [props.value]);
    const initWeekOptions = () => {
        const year = valueDayjs ? valueDayjs.year() : dayjs().year();
        const totalWeeks = dayjs(`${year}-12-28`).isoWeek(); // ✅ chuẩn xác
        const options: number[] = [];
        for (let i = 1; i <= totalWeeks; i++) {
            options.push(i);
        }
        setWeekOptions(options);
    };


    function getWeekDays(inputDate: Dayjs | string): Dayjs[] {
        const date = typeof inputDate === 'string' ? dayjs(inputDate) : inputDate;
        const startOfWeek = date.startOf('isoWeek'); // Bắt đầu từ thứ 2
        const days: Dayjs[] = [];

        for (let i = 0; i < 7; i++) {
            days.push(startOfWeek.add(i, 'day'));
        }

        return days;
    }

    const handleSelect = (date: Dayjs) => {
        if(date){
            let p_date = date.toDate();
            props.onChange?.(p_date);

            if (date.isoWeek() !== selectedWeek) {
                setSelectedWeek(date.isoWeek());
                setWeekDates(getWeekDays(date));
            }
        }
    };

    const handleWeekChange = (week: number) => {
        const year = valueDayjs ? valueDayjs.year() : dayjs().year();
        const startOfWeek = dayjs().year(year).isoWeek(week).startOf("isoWeek");

        setSelectedWeek(week);
        setWeekDates(getWeekDays(startOfWeek));
        props.onChange?.(startOfWeek.toDate());
    };
    const nextWeek = () => {
        const week = selectedWeek + 1;
        const year = valueDayjs ? valueDayjs.year() : dayjs().year();
        const startOfWeek = dayjs().year(year).isoWeek(week).startOf("isoWeek");

        setSelectedWeek(week);
        setWeekDates(getWeekDays(startOfWeek));
        props.onChange?.(startOfWeek.toDate());
    }
    const prevWeek = () => {
        const week = selectedWeek - 1;
        const year = valueDayjs ? valueDayjs.year() : dayjs().year();
        const startOfWeek = dayjs().year(year).isoWeek(week).endOf("isoWeek");

        setSelectedWeek(week);
        setWeekDates(getWeekDays(startOfWeek));
        props.onChange?.(startOfWeek.toDate());
    }
    const getVietnameseWeekday = (day: number) => {
        const weekdays = [
            "CN", // 0
            "T2",    // 1
            "T3",    // 2
            "T4",    // 3
            "T5",    // 4
            "T6",    // 5
            "T7",    // 6
        ];
        return weekdays[day];
    };
    const CloseButton = observer(() => {
        const show = Object.keys(mainStore.teeTimeMap).length > 1;
        if (show) {
            return <Tooltip title="Đóng">
                <Button type='link' size='large' onClick={()=>{
                    mainStore.closeBoard(props.boardId)
                }}>
                    <CloseOutlined></CloseOutlined>
                </Button>
            </Tooltip>
        } else {
            return <></>
        }

    });
    const handleChange = (value: any) => {
        handleSelect(value)
    };
    return (
        <>
            <div className="w-full">

                {/* Top Bar */}
                <div className="flex flex-wrap justify-between items-center px-4 py-1 text-sm text-black relative">
                    {/* Left: Weather and Icons */}
                    <div className="flex items-center gap-2 w-80 hidden md:block">
                        <SearchInput boardId={props.boardId}></SearchInput>
                        <Tooltip title="Tải lại">
                            <Button type='link' size='large' onClick={debounce((d) => {
                                props.onReload?.();
                            }, 250)}>
                                <ReloadIcon/>
                            </Button>
                        </Tooltip>
                    </div>

                    {/* Center: Date */}
                    <div className="text-left">
                        <div className='flex'>
                            <div className="flex items-center cursor-pointer select-none relative">
                                <div className='mr-1'>
                                    <span className="text-4xl font-semibold">{valueDayjs?.format("DD")}</span>
                                </div>
                                <div className='mr-1'>
                                    <div>{valueDayjs?.format('dddd')}
                                    </div>
                                    <div
                                        className="text-sm text-gray-600">Tháng {(valueDayjs?.month() ?? 0) + 1}/{valueDayjs?.year()}</div>
                                </div>
                                <div>
                                    <DownOutlined className="ml-2 text-xs text-gray-500"/>
                                </div>
                                <div className='absolute w-10 h-10 z-1'>

                                </div>
                                <DatePicker
                                    className={'absolute bottom-0 w-full h-full z-2 opacity-0'}
                                    // className="absolute bottom-0 w-0 h-0 z-2 opacity-0"
                                    // open={open}
                                    value={valueDayjs}
                                    onChange={handleChange}
                                    placeholder="Select date & time"
                                />
                            </div>
                            <div>
                                <Form.Item noStyle={true} name="courseId">
                                    <OrdSelect variant='borderless'
                                               showSearch={false}
                                               labelRender={(props) => <div className="font-bold">
                                                   {props.label} <CaretDownOutlined/>
                                               </div>}
                                               suffixIcon={false}
                                               allowClear={false} datasource={useSelectGolfCourse()}></OrdSelect>
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    {/* Right: (Optional content, empty for now) */
                    }
                    <div className="w-52 flex justify-end">
                        {/* <Tooltip title={'Đặt lịch'}>
                            <Button type='link' size='large' onClick={() => {
                                mainStore.openCreateModal({
                                    courseId: form.getFieldValue('courseId'),
                                    playDate: props.value,
                                    // startTime: dayjs(props.value).startOf('day').toDate(),
                                })
                            }}>
                                <UserOutlined/>
                            </Button>
                        </Tooltip>
                        <Tooltip title={'Đặt lịch theo nhóm'}>
                            <Button type='link' size='large' onClick={() => {
                                if (props.value)
                                    mainStore.openGroupBookingModal({
                                        boardId: props.boardId,
                                        playDate: valueDayjs?.toDate(),
                                        courseId: form.getFieldValue('courseId'),
                                        playerNo: 1,
                                        startTime: undefined,
                                        // startTime: dayjs(props.value).startOf('day').toDate(),
                                    })
                            }}>
                                <UsergroupAddOutlined/>
                            </Button>
                        </Tooltip> */}
                        <Tooltip title="Ghi chú">
                            <Button type='link' size='large'>
                                <TagOutlined/>
                            </Button>
                        </Tooltip>
                        <CloseButton></CloseButton>


                    </div>
                    {/* Spacer */
                    }
                </div>

            </div>
            <div className="text-sm">
                <div className="border-b border-t border-gray-200 min-h-2 p-1 flex">
                    <div className="flex items-center gap-2 shrink-0">
                        <Button size='small' type='link' onClick={() => {
                            prevWeek()
                        }}>
                            <LeftOutlined/>
                        </Button>
                        {/*<Select*/}
                        {/*    value={selectedWeek}*/}
                        {/*    onChange={handleWeekChange}*/}
                        {/*    variant="borderless"*/}
                        {/*    options={weekOptions.map(week => ({*/}
                        {/*        label: `Tuần ${week}`,*/}
                        {/*        value: week*/}
                        {/*    }))}*/}
                        {/*    className="min-w-[100px]"*/}
                        {/*/>*/}
                    </div>
                    <div className="flex justify-around flex-1 flex-wrap gap-2">
                        {weekDates.map((date, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(date)}
                                className={`flex items-center justify-center cursor-pointer min-w-[80px] px-2 border rounded
                                ${
                                    date.isSame(props.value, "day")
                                        ? "text-green-700 font-bold text-lg border-green-500"
                                        : "text-gray-400 border-transparent"
                                }`}
                            >
                                {date.isSame(dayjs(), "day") ? <span>Hôm nay</span> : <>
                                    {getVietnameseWeekday(date.day())} - {date.format("DD")}
                                </>}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button size='small' type='link' onClick={() => nextWeek()}>
                            <RightOutlined/>
                        </Button>
                        {/*<Select*/}
                        {/*    value={selectedWeek}*/}
                        {/*    onChange={handleWeekChange}*/}
                        {/*    variant="borderless"*/}
                        {/*    options={weekOptions.map(week => ({*/}
                        {/*        label: `Tuần ${week}`,*/}
                        {/*        value: week*/}
                        {/*    }))}*/}
                        {/*    className="min-w-[100px]"*/}
                        {/*/>*/}
                    </div>
                </div>
            </div>
        </>
    )
        ;
};

export default observer(WeekSelector);

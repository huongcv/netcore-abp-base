// TeeTimeGroup.tsx
import React, {useEffect, useState} from 'react';
import {rectSortingStrategy, SortableContext} from '@dnd-kit/sortable';
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Checkbox, Col, Form, Row} from "antd";
import dayjs, {Dayjs} from "dayjs";
import {debounce} from "lodash";
import FormItem from "antd/es/form/FormItem";
import WeekSelector from "@pages/1.Golf/TeeSheet/Booking/components/WeekSelector";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useDndContext} from "@dnd-kit/core";
import {formatTime, selectedRowName} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {observer} from "mobx-react-lite";
import {GolfFlightOutputDto} from "@api/index.defs";
import './TeeTimeGroup.scss'
import GolfPlayerSlotItem from "@pages/1.Golf/TeeSheet/Valet/Scheduler/GolfPlayerSlotItem";

const TeeTimeGroup = (props: {
    boardIdx: number;
    lstCourse: SelectDataSource;
    onSlotClick?: (boardIdx: number, rowIdx: number, slotIndex: number) => void;
}) => {
    const {
        golfBookingStore: mainStore,
    } = useStore();
    const {active} = useDndContext();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const dataSource = mainStore.teeTimeMap[props.boardIdx];
    // const maxSelectedRow = mainStore.teeTimeMapRowAllowSelectMax[props.boardIdx];

    const [maxPlayer, setMaxPlayer] = useState<number>(4);

    const [searchFormRef] = Form.useForm();

    function getListData(callBack?: (pr: GolfFlightOutputDto[]) => void) {
        mainStore.clearSelectedCells(props.boardIdx)
        mainStore.setSelectSlotMode(false);
        mainStore.getListData(props.boardIdx, {
            courseId: w_courseId,
            playDate: w_playDate
        }, (data) => {
            // Nếu refresh trong trường hợp modal bottom đang mở thì cập nhật lại data cho nó
            if (mainStore.viewTeeTimeBottomModal.visible) {
                const currDataView = mainStore.viewTeeTimeBottomModal.entityData;
                if (currDataView && currDataView.rowIdx) {
                    mainStore.openViewTeeTimeBottomModal(currDataView.boardIdx, currDataView.rowIdx, data[currDataView.rowIdx])
                }
            }
        });

    }

    useEffect(() => {
        if (dataSource[0])
            setMaxPlayer(dataSource[0].maxGroupPerFlight ?? 4);
    }, [dataSource]);
    useEffect(() => {
        console.log("obsRefresh" + props.boardIdx)
        getListData((data) => {

        });

    }, [props.boardIdx, mainStore.refreshTeeTimeMap[props.boardIdx]]);

    const w_playDate = Form.useWatch('playDate', searchFormRef);
    const w_courseId = Form.useWatch('courseId', searchFormRef);
    useEffect(() => {
        const timeout = setTimeout(() => {
            getListData();
        }, 300); // 300ms debounce
        return () => clearTimeout(timeout);
    }, [w_playDate, w_courseId]);
    useEffect(() => {
        if (props.lstCourse?.data[0]) {
            searchFormRef.setFieldValue("courseId", props.lstCourse.data[0]?.value);
        }
    }, [props.lstCourse.data]);


    function onResetClick() {
        // searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "filter",
                value: ""
            },
            {
                name: "playDate",
                value: dayjs().toDate()
            },
        ]);
        // stored.searchData({});
        // stored.loadSummary();
    }

    function selectedRowNameLocal(rowIndex: number) {
        return selectedRowName(props.boardIdx, rowIndex);
    }

    // const [selectedCells, setSelectedCells] = useState<Record<string, number[]>>({});


    function flattenedAllSlotsForCourse(): string[] {
        return dataSource.flatMap((teeTime, rowIndex) =>
            (teeTime.listSlot ?? []).map((_, slotIndex) =>
                `slot-${props.boardIdx}-${rowIndex}-${slotIndex}`
            )
        );
        // return dataSource.flatMap((teeTime, rowIndex) =>
        //     (teeTime.listSlot ?? []).map((_, slotIndex) => `slot-${props.boardIdx}-${rowIndex}-${slotIndex}`)
        // );
    }

    const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

    const isNewHourBlock = (current: Dayjs, prev?: Dayjs): boolean => {
        if (!prev) return true; // Dòng đầu tiên luôn true
        return current.hour() !== prev.hour();
    };

    return (
        <div ref={setContainer} className='relative'>
            <div className="ord-container-box !pt-2">

                <Form
                    form={searchFormRef}
                    layout={"vertical"}
                    initialValues={{
                        playDate: dayjs().toDate(),
                    }}
                    onFinish={debounce((d) => {
                        getListData()
                    }, 250)}
                >
                    <FormItem name='playDate'>
                        <WeekSelector
                            boardId={props.boardIdx}
                            onReload={getListData}></WeekSelector>
                    </FormItem>

                </Form>


                {maxPlayer && <div>
                    <div
                        style={{gridTemplateColumns: `100px repeat(${maxPlayer}, minmax(100px, 1fr))`}}
                        className={`grid  text-sm font-medium sticky top-0 z-10 bg-white`}>
                        <div className="py-2 px-3 text-center font-medium bg-gray-100">TeeTime</div>
                        {Array.from({length: maxPlayer}, (_, i) => i + 1)
                            .map(idx => {
                                return <div key={idx} className="ml-1 bg-gray-100 py-2 px-3 text-center">
                                    {t('Player' + idx)}
                                </div>
                            })}
                    </div>
                    <div className="text-sm overflow-y-auto ">
                        <SortableContext
                            items={flattenedAllSlotsForCourse()}
                            strategy={rectSortingStrategy}
                        >
                            {dataSource.map((flight, rowIdx) => {
                                const currentFormatted = formatTime(flight.startTime);
                                const rowKey = selectedRowNameLocal(rowIdx);
                                const CheckboxRow = observer(() => {
                                    if (mainStore.selectSlotMode) {
                                        const rowLength = mainStore.selectedCells[rowKey]?.data?.listSlot?.length ?? 0;
                                        return <Checkbox
                                            className={`
                                                                  absolute right-0 top-1/2 -translate-y-1/2
                                                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                                                  ${((rowLength ?? 0) > 0) ? 'opacity-100' : ''}
                                                            `}
                                            indeterminate={
                                                rowLength > 0 &&
                                                rowLength < maxPlayer
                                            }
                                            checked={rowLength === maxPlayer}
                                            onChange={() => mainStore.handleSelectRow(props.boardIdx, rowIdx, flight)}
                                        />
                                    } else {
                                        return <></>
                                    }

                                });
                                const currentTime = dayjs(flight.startTime as string, "HH:mm:ss");
                                const prevTime = rowIdx > 0 ? dayjs(dataSource[rowIdx - 1].startTime as string, "HH:mm:ss") : undefined;

                                return (
                                    <React.Fragment key={rowIdx}>
                                        {/* Nếu là phần tử đầu và giờ chẵn, thì thêm divider trước */}
                                        {isNewHourBlock(currentTime, prevTime) && (
                                            <div className="flex items-center text-xs text-gray-500  my-1">
                                                <div
                                                    className="ml-2 flex-shrink-0">{currentTime.startOf("hour").format("HH:mm")}</div>
                                                <div
                                                    className="flex-1 border-t border-dashed border-gray-300 ml-2"></div>
                                            </div>
                                        )}

                                        {/* Dòng slot chính */}
                                        <div
                                            style={{gridTemplateColumns: `100px repeat(${maxPlayer}, minmax(100px, 1fr))`}}
                                            className="row-tee grid border-b border-t border-gray-200 mt-1 min-h-8 group"
                                        >
                                            <div className="py-1 px-3 flex items-center justify-around group-hover:bg-green-100 transition
                                            border border-gray-100 bg-gray-50
                                            ">
                                                <div className="relative">
                                                    <CheckboxRow></CheckboxRow>
                                                </div>
                                                <span>{currentFormatted}</span>
                                            </div>
                                            {flight.listSlot && flight.listSlot.map((flightSlot, colIdx) =>
                                                <GolfPlayerSlotItem slot={flightSlot} rowIndex={rowIdx}
                                                                colIndex={colIdx}
                                                                flight={flight} key={colIdx}
                                                                boardIdx={props.boardIdx}
                                                                onSlotClick={props.onSlotClick}></GolfPlayerSlotItem>
                                                    
                                                // renderSlot(idx, slot, s, index)
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </SortableContext>

                        <div style={{
                            width: '100%',
                        }}>

                        </div>
                    </div>
                    <Row className='pt-1 pb-1 row-tee'>
                        <Col span={24}>
                            <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                                <div className="flex items-center gap-1"><span
                                    className="w-4 h-4 rounded slot-pending"></span>Chờ xác
                                    nhận
                                </div>
                                <div className="flex items-center gap-1"><span
                                    className="w-4 h-4 rounded slot-confirmed"></span>Đã xác
                                    nhận
                                </div>
                                <div className="flex items-center gap-1"><span
                                    className="w-4 h-4 rounded slot-checkin"></span>Đã checkin
                                </div>
                                <div className="flex items-center gap-1"><span
                                    className="w-4 h-4 rounded slot-checkout"></span>Đã
                                    checkout
                                </div>
                            </div>
                        </Col>
                    </Row>

                </div>}
            </div>
            {/*selectedCellsCount: {selectedCellsCount}*/}

        </div>

    );
};

export default observer(TeeTimeGroup); // xem xet có cần observer ko

import {action, makeObservable, observable, runInAction} from "mobx";
import {GolfBookingService} from "@api/GolfBookingService";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {
    CreateGroupBookingDto,
    CruPrivateBookingDto,
    FlightSlot,
    GetServiceInitDefaultByFilterQuerry,
    GolfFlightOutputDto,
    GolfProductSimpleDto,
    IssueRfidDto,
    TeeTimeBookingInputDto
} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import uiUtils from "@ord-core/utils/ui.utils";
import {IViewTeeTimeBottomProps} from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/ViewTeeTimeBottom";
import {selectedRowName} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {cloneDeep, flatten, uniq} from "lodash";
import {ICreateGroupBookingProps} from "@pages/1.Golf/TeeSheet/Booking/Crud/GroupBooking/CreateGroupBooking";
import {l} from "@ord-core/language/lang.utils";
import {IAddProductTemp} from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/AddProductCard";
import {GolfTeeSheetService} from "@api/GolfTeeSheetService";
import {IViewDetailPlayerProps} from "@pages/1.Golf/TeeSheet/Booking/ViewDetailPlayer/ViewDetailPlayer";

interface ICellSelectedData {
    rowIndex: number;
    boardIdx: number;

    data: GolfFlightOutputDto
}

class GolfBookingStore extends CommonListStore<unknown> {
    isShowSelectProductModal = false;
    teeTimeMap: Record<number, GolfFlightOutputDto[]> = {
        1: []
    };

    teeTimeMapRowAllowSelectMax: Record<number, Record<number, number>> = {
        1: {}
    };
    refreshTeeTimeMap: Record<number, number> = {
        1: 1
    };


    groupBookingModal: ICreateOrUpdateModal<ICreateGroupBookingProps> = {
        visible: false,
        width: 1200
    }
    checkInModal: ICreateOrUpdateModal = {
        visible: false,
        width: 1200
    }
    viewTeeTimeBottomModal: ICreateOrUpdateModal<IViewTeeTimeBottomProps> = {
        visible: false,
        width: 999
    }
    viewDetailPlayerModal: ICreateOrUpdateModal<IViewDetailPlayerProps> = {
        visible: false,
        width: 999
    }
    userBlockModal: ICreateOrUpdateModal = {
        visible: false,
        width: 550
    }
    //#region Selection Cell
    selectedCells: Record<string, ICellSelectedData> = {};


    constructor() {
        super();
        makeObservable(this, {
            teeTimeMap: observable,
            isShowSelectProductModal: observable,
            teeTimeMapRowAllowSelectMax: observable,
            refreshTeeTimeMap: observable,
            groupBookingModal: observable,
            selectSlotMode: observable,
            viewTeeTimeBottomModal: observable,
            viewDetailPlayerModal: observable,
            openViewDetailPlayerModal: action,
            closeViewDetailPlayerModal: action,
            selectedCells: observable,
            userBlockModal: observable,
            checkInModal: observable,
            updateSlotItem: action,
            refreshTeeTimeData: action,
            clearSelectedCells: action,
            setSelectSlotMode: action,
            openViewTeeTimeBottomModal: action,
        });
    }



    clearSelectedCells(boardIdx?: number) {
        const prefix = `$board${boardIdx ?? ""}`;
        Object.keys(this.selectedCells).forEach((key) => {
            if (key.startsWith(prefix)) {
                console.log("clearSelectedCells", key);
                delete this.selectedCells[key];
            }
        });
    }

    handleCellClick = (boardIdx: number, rowIndex: number,
                       rowItem: GolfFlightOutputDto, colItem: FlightSlot
    ) => {
        const prev = this.selectedCells;
        const rowKey = selectedRowName(boardIdx, rowIndex);
        if (!prev[rowKey]) {
            prev[rowKey] = {
                boardIdx: boardIdx,
                rowIndex: rowIndex,
                data: {
                    ...rowItem,
                    listSlot: []
                }
            }
        }
        const currRowData = prev[rowKey];

        const currentCols = currRowData.data.listSlot || [];

        const alreadySelected = currentCols.map(x => x.playerNo).includes(colItem.playerNo);
        const newCols = alreadySelected
            ? currentCols.filter(i => i.playerNo !== colItem.playerNo)
            : [...currentCols, colItem];

        // Nếu không còn cột nào được chọn → xoá key khỏi object
        if (newCols.length === 0) {
            delete prev[rowKey];
        } else {
            prev[rowKey].data.listSlot = newCols;
        }
        // this.selectedCells = updated;
        // console.log("updated", updated);
    }
    handleSelectRow = (boardIdx: number, rowIndex: number, rowItem: GolfFlightOutputDto) => {
        const maxPlayer = this.teeTimeMap[boardIdx][0]?.maxGroupPerFlight ?? 4;
        const key = selectedRowName(boardIdx, rowIndex);
        const prev = this.selectedCells;
        if (!prev[key]) {
            // Nếu chưa có key thì thêm mới
            prev[key] = {
                boardIdx: boardIdx,
                rowIndex: rowIndex,
                data: cloneDeep(rowItem)
            }
            this.selectedCells = prev;
            return;
        }

        const current = prev[key].data?.listSlot?.map(f => f.playerNo) ?? [];
        const allCols = Array.from({length: maxPlayer}, (_, i) => i + 1);
        const isAllSelected = current.length === maxPlayer
            && allCols.every(i => current.includes(i));

        console.log("debugTest")
        if (isAllSelected) {
            delete prev[key]; // Bỏ chọn toàn bộ thì xoá key luôn
        } else {
            prev[key] = {
                rowIndex: rowIndex,
                boardIdx: boardIdx,
                data: rowItem
            };
        }

        // Nếu sau khi cập nhật mà key có mảng rỗng thì xoá
        if ((prev[key]?.data?.listSlot ?? 0) === 0) {
            delete prev[key];
        }
        this.selectedCells = prev;

    };
    //#endregion

    // isAdjustMode = false;
    //
    // setAdjustMode() {
    //     this.isAdjustMode = !this.isAdjustMode;
    // }

    selectSlotMode = false;

    setSelectSlotMode(check: boolean) {
        this.selectSlotMode = check;
    }

    refreshTeeTimeData(boardId: number) {
        this.refreshTeeTimeMap[boardId] = (this.refreshTeeTimeMap[boardId] ?? 0) + 1;
    }

    refreshTeeTimeAll() {
        Object.entries(this.refreshTeeTimeMap).forEach(([key, value]) => {
            this.refreshTeeTimeMap[parseInt(key)] = (this.refreshTeeTimeMap[parseInt(key)] ?? 0) + 1;
        })

    }


    getNamespaceLocale(): string {
        return "golf_booking";
    }


    openCheckInModal() {
        this.checkInModal = {
            visible: true,
            mode: "addNew",
            entityData: {},
            width: 550,
        }
    }


    closeCheckInModal(mustRefreshGridData: boolean = false) {
        this.checkInModal.visible = false;
        this.checkInModal.entityData = null;
        if (mustRefreshGridData) {
            // this.refreshTeeTimeData();
        }
    }

    openGroupBookingModal(input: ICreateGroupBookingProps) {
        this.groupBookingModal = {
            visible: true,
            mode: "addNew",
            entityData: input,
            width: 1200,
        }
    }

    closeGroupBookingModal(mustRefreshGridData: boolean = false, boardIdx?: number) {
        this.groupBookingModal.visible = false;
        this.groupBookingModal.entityData = null;
        if (mustRefreshGridData && boardIdx) {
            this.refreshTeeTimeData(boardIdx);
        }
    }

    openViewTeeTimeBottomModal(boardIdx: number, rowIdx: number, flight: GolfFlightOutputDto) {
        this.viewTeeTimeBottomModal = {
            visible: true,
            entityData: {
                boardIdx: boardIdx,
                rowIdx: rowIdx,
                flight: flight
            },
            width: 999,
        }
    }

    closeViewTeeTimeBottomModal(mustRefreshGridData: boolean = false, boardIdx?: number) {
        this.viewDetailPlayerModal.visible = false;
        this.viewDetailPlayerModal.entityData = null;
        if (mustRefreshGridData && boardIdx) {
            this.refreshTeeTimeData(boardIdx);
        }
    }

    openViewDetailPlayerModal(input: IViewDetailPlayerProps) {
        this.viewDetailPlayerModal = {
            visible: true,
            entityData: input,
            width: 999,
        }
    }

    closeViewDetailPlayerModal(mustRefreshGridData: boolean = false, boardIdx?: number) {
        this.viewDetailPlayerModal.visible = false;
        this.viewDetailPlayerModal.entityData = null;
        if (mustRefreshGridData && boardIdx) {
            this.refreshTeeTimeData(boardIdx);
        }
    }

    openUserBlockModal() {
        this.userBlockModal = {
            visible: true,
            mode: "addNew",
            entityData: {},
            width: 550,
        }
    }

    closeUserBlockModal(mustRefreshGridData: boolean = false, boardIdx?: number) {
        this.userBlockModal.visible = false;
        this.userBlockModal.entityData = null;
        if (mustRefreshGridData && boardIdx) {
            this.refreshTeeTimeData(boardIdx);
        }
    }

    unBlockSelected() {
        const lstBoard: number[] = [];
        const lst1 = Object.entries(this.selectedCells)
            .map(([key, value]) => {
                lstBoard.push(value.boardIdx);
                return value?.data?.listSlot?.filter(f => f.bookingTeeTimeId).map(f => f.bookingTeeTimeId as string) ?? []
            })
        const lst = flatten(lst1);
        GolfBookingService.unBlockTeeTime({
            body: {
                teeTimeBookingIds: lst
            }
        }).then(res => {
            if (res.isSuccessful) {
                uniq(lstBoard).forEach(boardId => {
                    this.refreshTeeTimeData(boardId);
                })
                this.clearSelectedCells();
                this.setSelectSlotMode(false);
                UiUtils.showSuccess("Unblock success");
            } else {
                UiUtils.showError(res.message);
            }
        })
    }


    newBoard() {
        const max = Math.max(...Object.keys(this.teeTimeMap).map(Number));
        const newBoardIdx = max + 1;
        this.teeTimeMap[newBoardIdx] = [];
    }

    closeBoard(boardId: number) {
        delete this.teeTimeMap[boardId];
    }

    updateSlotItem(boardIdx: number, rowIndex: number, newItem: FlightSlot) {
        const teeTimes = this.teeTimeMap[boardIdx];
        if (!teeTimes || !teeTimes[rowIndex]) return;

        const listSlot = [...teeTimes[rowIndex].listSlot ?? []];
        const idx = listSlot.findIndex(f => f.playerNo == newItem.playerNo);
        listSlot[idx] = newItem;

        teeTimes[rowIndex] = {
            ...teeTimes[rowIndex],
            listSlot: listSlot
        };
    }


    apiService() {
        return {
            // getPaged: GolfCourseService.getPaged,
            // remove: GolfCourseService.remove,
            // createOrUpdate: GolfCourseService.createOrUpdate,
        } as any;
    }

    createOrUpdate(prams: CruPrivateBookingDto) {
        return GolfBookingService.cruPrivateBooking({
            body: prams
        })
    }

    getInitModal(): ICreateOrUpdateModal<any> {
        return {
            width: 1200
        };
    }

    showSelectProductModal(open: boolean) {
        this.isShowSelectProductModal = open;
    }

    getListColumnNameExcel(): string[] {
        return [];
    }

    getListData(boardIdx: number, param: TeeTimeBookingInputDto, callBack?: (pr: GolfFlightOutputDto[]) => void) {
        UiUtils.setBusy();
        GolfBookingService.getTeeTimeBooking({
            body: param
        }).then(res => {
            runInAction(() => {
                this.teeTimeMap[boardIdx] = res;
                this.teeTimeMapRowAllowSelectMax[boardIdx] = res.reduce((acc, item, index) => {
                    acc[index] = item.listSlot?.filter(x => x.status != 10).length ?? (item.maxGroupPerFlight ?? 4);
                    return acc;
                }, {} as Record<number, number>);
            });
            UiUtils.clearBusy();
            if (callBack) {
                callBack(res);
            }
        })
    }

    getFlightInfoByFilter(courseId: string | undefined, playDate: Date, isGetServiceDefault: boolean
    ) {
        return GolfBookingService.getFlightInfoByFilter({
            body: {
                playDate,
                courseId,
                isGetServiceDefault: isGetServiceDefault
            }
        })
    }

    getServiceInitDefaultByFilter(input: GetServiceInitDefaultByFilterQuerry
    ) {
        return GolfBookingService.getServiceInitDefaultByFilter({
            body: input
        })
    }

    getPrivateBooking(bookingTeeTimeId: number) {
        return GolfBookingService.getPrivateBooking({
            bookingTeeTimeId: bookingTeeTimeId
        })
    }

    updateListSlotWithCourse(courseId: number, rowIndex: number, newList: FlightSlot[]) {
        const teeTimes = this.teeTimeMap[courseId];
        if (!teeTimes || !teeTimes[rowIndex]) return;

        teeTimes[rowIndex] = {
            ...teeTimes[rowIndex],
            listSlot: newList
        };
    }


    setNoShow(bookingPlayerId: number) {
        return GolfBookingService.setNoShow({
            bookingPlayerId: bookingPlayerId
        })
    }

    cancelSetNoShow(bookingPlayerId: number) {
        return GolfBookingService.cancelSetNoShow({
            bookingPlayerId: bookingPlayerId
        })
    }

    comfirmBooking(bookingId: number) {
        return GolfBookingService.comfirmBooking({
            bookingId: bookingId
        })
    }

    cancelComfirmBooking(bookingId: number) {
        return GolfBookingService.cancelComfirmBooking({
            bookingId: bookingId
        })
    }

    getInfoPrivateBooking(bookingTeeId: number) {
        return GolfBookingService.getInfoPrivateBooking({
            bookingTeeTimeId: bookingTeeId
        })
    }

    getBookingInvoiceTemp(bookingPlayerId: number) {
        return GolfBookingService.getBookingInvoiceTemp({
            bookingPlayerId: bookingPlayerId
        })
    }

    issueRfid(params: IssueRfidDto) {
        return GolfBookingService.issueRfid({
            body: params
        })
    }

    createGroupBooking(input: CreateGroupBookingDto) {
        return GolfBookingService.cruGroupBooking({
            body: input
        })
    }

    deleteBooking(boardId: number, bookingId: number) {
        uiUtils.showConfirm({
            title: l.trans(this.getNamespaceLocale() + ".ComfirmDelete"),
            icon: "remove",
            content: l.trans(this.getNamespaceLocale() + ".ComfirmDeleteBooking"),
            isDanger: true,
            onOk: async () => {
                GolfBookingService.deleteBooking({
                    bookingId: bookingId
                }).then(res => {
                    if (res.isSuccessful) {
                        UiUtils.showSuccess(l.trans(this.getNamespaceLocale() + ".ComfirmDeleteBookingSuccess"));
                        this.refreshTeeTimeData(boardId);
                        this.closeViewTeeTimeBottomModal();
                    } else {
                        UiUtils.showError(res.message);
                    }
                })
            }
        });

    }
}

export default GolfBookingStore;

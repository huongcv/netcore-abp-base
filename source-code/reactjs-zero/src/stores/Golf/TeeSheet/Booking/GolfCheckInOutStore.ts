import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {
    GetInfoBeforeCheckoutQuerry,
    GolfCheckoutOutputDto,
    GolfInfoBeforeCheckoutOutputDto, MemberInfoByCardInputDto, MemberInfoByCardOutputDto,
    SaleInvoiceDto
} from "@api/index.defs";
import {GolfTeeSheetService} from "@api/GolfTeeSheetService";
import UiUtils from "@ord-core/utils/ui.utils";
import uiUtils from "@ord-core/utils/ui.utils";
import {l} from "@ord-core/language/lang.utils";
import {GolfBookingService} from "@api/GolfBookingService";
import {InvoiceHelperService} from "@api/InvoiceHelperService";
import {makeObservable, observable} from "mobx";

export interface IGolfCheckoutInputProps extends GetInfoBeforeCheckoutQuerry {
    onReturnSuccess: () => void;
}

export interface IGolfQuickAccessModalProps {
    canCheckIn: boolean,
    canCheckOut: boolean,
    findCardStatus: 0 | 1 | 2, // 0 : Chưa bắt đầu tìm; 1: Tìm thấy ; 2 không tìm thấy
    memberCardInfo: MemberInfoByCardOutputDto
}

class GolfCheckInOutStore extends CommonListStore<GolfInfoBeforeCheckoutOutputDto, IGolfCheckoutInputProps> {
    pdfUrl: string | undefined;
    quickAccessModal: ICreateOrUpdateModal<IGolfQuickAccessModalProps> = {
        visible: false,
        width: 350
    }

    constructor() {
        super();
        makeObservable(this, {
            pdfUrl: observable,
            quickAccessModal: observable,
        });
    }

    getNamespaceLocale(): string {
        return 'golf_booking'
    }

    apiService() {
        return {} as any;
    }

    getInitModal(): ICreateOrUpdateModal<IGolfCheckoutInputProps> {
        return {
            width: 600
        }
    }

    getListColumnNameExcel(): string[] {
        throw new Error("Method not implemented.");
    }

    closeQuickAccessModal(mustRefreshGridData: boolean = false, boardIdx?: number) {
        this.quickAccessModal.visible = false;
        this.quickAccessModal.entityData = null;
    }

    openQuickAccessModal(props: IGolfQuickAccessModalProps) {
        this.quickAccessModal = {
            visible: true,
            mode: "addNew",
            entityData: props,
            width: 550,
        }
    }

    checkNeeReturnItem(bookingId: string, bookingPlayerId: string, bookingGroupId: string | undefined,
                       callBack: (neeReturn: boolean) => void) {
        GolfTeeSheetService.checkNeedReturnItem({
            body: {
                bookingPlayerId: bookingPlayerId,
                bookingGroupId: bookingGroupId,
                bookingId: bookingId
            }
        }).then(res => {
            if (res.isSuccessful && res.data != undefined) {
                callBack(res.data);
            } else {
                UiUtils.showError(res.message);
            }
        }, (e) => {
            UiUtils.showCatchError(e);
        })
    }

    onAfterCheckOut(prams: {
                        bookingId: string, bookingPlayerId: string, bookingGroupId: string | undefined,
                        callbackCanPay: () => void
                    }
    ) {
        const {bookingPlayerId, bookingGroupId, bookingId, callbackCanPay} = prams;
        if (bookingPlayerId) {
            UiUtils.setBusy();
            GolfTeeSheetService.checkNeedReturnItem({
                body: {
                    bookingPlayerId: bookingPlayerId,
                    bookingGroupId: bookingGroupId,
                    bookingId: bookingId,
                }
            }).then(res => {
                if (res.isSuccessful) {
                    const data = res.data;
                    if (res.data) {
                        // needRturn
                        UiUtils.showInfo(l.trans(this.getNamespaceLocale() + ".yourNeeReturnMscItemBeforeCheckout"))
                        this.openCreateModal({
                            bookingPlayerId: bookingPlayerId,
                            bookingGroupId: bookingGroupId,
                            bookingId: bookingId,
                            onReturnSuccess: () => {
                                callbackCanPay()
                            }
                        } as IGolfCheckoutInputProps)
                    } else {
                        callbackCanPay()
                    }

                } else {
                    UiUtils.showError(res.message);
                }
                uiUtils.clearBusy();
            })

        } else {
            UiUtils.showError(l.trans(this.getNamespaceLocale() + ".cantCheckout"));
        }
    }

    paymentAndCheckout(param: {
        invoice: SaleInvoiceDto,
        bookingId: string | undefined;
        bookingPlayerId: string | undefined;
        bookingGroupId: string | undefined;
        callback: (date: GolfCheckoutOutputDto) => void;
    }) {
        const {invoice, bookingId, bookingPlayerId, bookingGroupId, callback} = param;
        GolfTeeSheetService.paymentAndCheckout({
            body: {
                invoice: invoice,
                bookingPlayerId: bookingPlayerId,
                bookingGroupId: bookingGroupId,
                bookingId: bookingId,
            }
        }).then(res => {
            if (res.isSuccessful && res.data) {
                callback(res.data);
            } else {
                UiUtils.showError(res.message);
            }
            uiUtils.clearBusy();
        }, (e) => {
            UiUtils.showCatchError(e);
            uiUtils.clearBusy();
        })
    }

    t(value: string, params?: any) {
        return l.trans(this.getNamespaceLocale() + "." + value, params)
    }

    cancelCheckIn(bookingPlayerId: number) {
        return GolfBookingService.cancelCheckIn({
            bookingPlayerId: bookingPlayerId
        })
    }

    playerCheckIn(bookingPlayerId: number) {
        return GolfBookingService.checkIn({
            bookingPlayerId: bookingPlayerId
        })
    }


    async printPdf(invoiceId: string, firebaseToken?: string) {
        UiUtils.setBusy();
        try {
            const resultBlob = await InvoiceHelperService.printInvoiceV2({
                body: {
                    id: invoiceId,
                    deviceTokenId: firebaseToken,
                }
            }, {responseType: 'blob'});
            this.pdfUrl = URL.createObjectURL(resultBlob);

        } catch (error) {
            UiUtils.showCatchError(error)
            console.error('API call failed:', error);
        } finally {
            UiUtils.clearBusy();
        }
    };

}

export default GolfCheckInOutStore

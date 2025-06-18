import {GolfProductSimpleDto} from "@api/index.defs";
import {IAddProductTemp} from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/AddProductCard";
import {GolfTeeSheetService} from "@api/GolfTeeSheetService";
import {action, makeObservable, observable} from "mobx";

class GolfSelectProductStore {
    constructor() {
        makeObservable(this, {
            productAddTempData: observable,
            resetSelectProduct: action,
            saveProductTemplate: action,
            afterSaveProductTemplate: action,
            addProductToTemp: action,
            setTempInvoice: action,
        });
    }

    getNamespaceLocale(): string {
        return "golf_booking";
    }

    setTempInvoice(tempInvoiceId: string | undefined) {
        this.productAddTempData.tempInvoiceId = tempInvoiceId;
    }

    productAddTempData: {
        refreshDataCount: number,
        tempInvoiceId?: string,
        totalAmount: number,
        listProduct: IAddProductTemp[]
    } = {
        totalAmount: 0,
        listProduct: [],
        refreshDataCount: 0
    };

    resetSelectProduct() {
        this.productAddTempData = {
            totalAmount: 0,
            listProduct: [],
            refreshDataCount: 0
        };
    }


    saveProductTemplate(input: {
        bookingId: string,
        bookingPlayerId: string,
    }) {
        return GolfTeeSheetService.addProductForPlayer({
            body: [
                {
                    ...this.productAddTempData,
                    bookingId: input.bookingId,
                    invoiceId: this.productAddTempData.tempInvoiceId,
                    bookingPlayerId: input.bookingPlayerId,
                }
            ]
        })
    }

    afterSaveProductTemplate() {
        this.productAddTempData.refreshDataCount += 1;
        setTimeout(() => {
            this.resetSelectProduct();
        }, 500)
    }

    addProductToTemp(pr: GolfProductSimpleDto) {
        const idx = this.productAddTempData.listProduct.findIndex(f => f.id === pr.id);
        this.productAddTempData.totalAmount += pr.productPrice ?? 0;
        if (idx === -1) {
            this.productAddTempData.listProduct.push({
                ...pr,
                qty: 1
            });
        } else {
            this.productAddTempData.listProduct[idx].qty = (this.productAddTempData.listProduct[idx].qty ?? 0) + 1;
        }
    }
}

export default GolfSelectProductStore

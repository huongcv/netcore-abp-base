import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {
    AccessCardDto,
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

interface IGolfValetAccessCardModalProps {
    memberCardInfo: MemberInfoByCardOutputDto,
    // accesCardInfor: AccessCardDto,
    // bagTagNo: string
}

class GolfValetStore   {
    pdfUrl: string | undefined;
    checkAccessCardModal: ICreateOrUpdateModal<IGolfValetAccessCardModalProps> = { // Check kiểu dữ liều điền vào đây cho phù hợp
        visible: false,
        width: 350
    }

    constructor() {
        makeObservable(this, {
            checkAccessCardModal: observable,
        });
    }

    getNamespaceLocale(): string {
        return 'golf_valet'
    }

    t(value: string, params?: any) {
        return l.trans(this.getNamespaceLocale() + "." + value, params)
    }

    closeCheckAccessCardModal() {
            this.checkAccessCardModal.visible = false;
            this.checkAccessCardModal.entityData = null;
        }
    
    opencloseCheckAccessCardModal(props: IGolfValetAccessCardModalProps) {
        this.checkAccessCardModal = {
            visible: true,
            mode: "addNew",
            entityData: props,
            width: 550,
        }
    }

}

export default GolfValetStore

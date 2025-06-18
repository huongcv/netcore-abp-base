import {Bounce, toast, ToastOptions} from "react-toastify";
import {l} from "@ord-core/language/lang.utils";
import {createConfirmation} from "react-confirm";
import OrdConfirm, {OrdConfirmProps} from "@ord-components/confirm/OrdConfirm";
import {ToastContent} from "react-toastify/dist/types";
import axios from "axios";

declare var ord: any;

class UiUtils {

    private BASE_TOAST: ToastOptions<any> = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
    }
    showSuccess = (content?: string) => {
        toast.success(content, this.BASE_TOAST);
    };
    showSuccessWithLCommon = (content?: string) => {
        toast.success(l.transCommon(content || ''), this.BASE_TOAST);
    };
    showError = (content?: string) => {
        toast.error(content?l.transCommon(content):"Error", this.BASE_TOAST);
    };
    showInfo = (content?: ToastContent) => {
        toast.info(content, this.BASE_TOAST);
    };
    showWarning = (content?: ToastContent) => {
        toast.warning(content, this.BASE_TOAST);
    };

    showCatchError(error: any) {
        if (axios.isAxiosError(error)) {
            const mess = error.response?.data?.error?.message;
            if (mess) {
                toast.error(mess);
            } else {
                console.error("Lỗi khác:",  error.response);
            }
        } else {
            console.error("Lỗi không xác định:", error);
        }
    }

    showCommonValidateForm() {
        this.showError(l.transCommon('formInvalid.common'));
    }

    setBusy() {
        ord.ui.setBusy();
    }

    clearBusy() {
        ord.ui.clearBusy();
    }

    showConfirm(input: OrdConfirmProps) {
        const confirm = createConfirmation(OrdConfirm);
        confirm({
            ...input
        }).then();
    }

    showPrintWindow(blobData: Blob) {
        ord.event.trigger('print_pdf', blobData);
    }
}

export default new UiUtils();

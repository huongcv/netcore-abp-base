import UiUtils from "@ord-core/utils/ui.utils";
import {ICommonResultDtoApi} from "@ord-components/paged-table/types";
import {l} from "@ord-core/language/lang.utils";

export interface ApiActionOptions<T = any> {
    successMessage?: string;
    successMessagePrm?: any;
    afterSuccess?: (dataSuccess?: T) => void;
    afterError?: (res: ICommonResultDtoApi<T>) => void;
    isMustBusyUi?: boolean;
}

export class ApiActionHandler {
    static async execute<T>(
        apiCall: () => Promise<ICommonResultDtoApi<T>>,
        options: ApiActionOptions<T> = {}
    ): Promise<boolean> {
        const {
            successMessage,
            successMessagePrm,
            afterSuccess,
            afterError,
            isMustBusyUi = true
        } = options;

        if (isMustBusyUi) {
            UiUtils.setBusy();
        }

        try {
            const result = await apiCall();
            if (result?.isSuccessful === true) {
                if (successMessage) {
                    UiUtils.showSuccess(
                        l.trans(successMessage, {
                            ...result?.data,
                            ...successMessagePrm
                        })
                    );
                }
                afterSuccess?.(result.data);
            } else {
                UiUtils.showError(result?.message || 'Thao tác thất bại');
                afterError?.(result);
            }
            return result?.isSuccessful === true;
        } catch (err) {
            UiUtils.showError('Đã có lỗi xảy ra');
            return false;
        } finally {
            UiUtils.clearBusy();
        }
    }
}

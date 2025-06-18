import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {GENDER} from "@api/index.defs";
import {useTranslation} from "react-i18next";

export const useSelectInvoiceProvider = (): SelectDataSource => {
    const key = 'invoiceProvider';
    const {t} = useTranslation('enum');

    return useSelectDataSource(key, async () => {
        return [{
            value: "1",
            label: "VNPT",
        }, {
            value: "2",
            label: "Viettel",
        }, {
            value: "3",
            label: "MISA",
        }, {
            value: "4",
            label: "BKAV",
        }, {
            value: "5",
            label: "MInvoice",
        }, {
            value: "6",
            label: "CyberBill",
        },{
            value: "7",
            label: "WInvoice",
        }
        ];
    });
};

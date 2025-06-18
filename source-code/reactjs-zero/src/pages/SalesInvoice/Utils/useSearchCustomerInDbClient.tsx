import {useEffect, useState} from "react";
import {useFilterPartnerCustomerByText} from "@ord-core/db/queries/partners/useFilterPartnerCustomerByText";
import {CustomerSelectOptionRender} from "@pages/SalesInvoice/Utils/useSearchCustomer";


export const useSearchCustomerInDbClient = (searchValue: string, focusReady: boolean, loadMore: number,
                                 status: number) => {
    const [data, setData] = useState<any[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [isSearchOnClient] = useState(false);
    const items = useFilterPartnerCustomerByText(searchValue);
    useEffect(() => {
        let customers = items || [];
        const optionSelectItems = customers.map(it => CustomerSelectOptionRender(it));
        setData(optionSelectItems || []);
        setIsPending(false);
    }, [items]);
    return {data, isPending, isSearchOnClient};
}

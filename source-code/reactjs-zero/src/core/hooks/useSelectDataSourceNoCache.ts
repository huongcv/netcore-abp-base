import {useEffect, useState} from "react";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";

export const useSelectDataSourceNoCache = (
    fetchOptions: () => Promise<IOrdSelectOption[]>
): SelectDataSource => {
    const [data, setData] = useState<IOrdSelectOption[]>([]);
    const [isPending, setIsPending] = useState(false);

    const fetchData = async () => {
        setIsPending(true);
        try {
            const result = await fetchOptions();
            setData(result);
        } catch (error) {
            console.error("Failed to fetch options:", error);
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Chỉ chạy 1 lần khi mount

    return {data, isPending};
};

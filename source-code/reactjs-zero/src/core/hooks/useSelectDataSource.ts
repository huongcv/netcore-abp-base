import {useEffect, useState} from "react";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useStore} from "@ord-store/index";
import {computed, reaction} from "mobx";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";

export const useSelectDataSource = (
    key: string,
    fetchOptions: () => Promise<IOrdSelectOption[]>
): SelectDataSource => {
    const [data, setData] = useState<IOrdSelectOption[]>([]);
    const [isPending, setIsPending] = useState(false);
    const {selectDataSourceStore} = useStore();
    const fetchData = async () => {
        setIsPending(true);
        try {
            const {dataOptions} = selectDataSourceStore;
            if (dataOptions[key] && dataOptions[key]?.length > 0) {
                setData(dataOptions[key]);
                return;
            } else {
                await selectDataSourceStore.getOptions(key, () => fetchOptions());
            }

        } catch (error) {
        } finally {
            setIsPending(false);
        }
    };
    useEffect(() => {
        fetchData();
        const dispose = reaction(
            () => computed(() => selectDataSourceStore.dataOptions[key]).get(),
            (newData) => {
                setData(newData);
            }
        );
        return () => {
            dispose();
        };
    }, [key]);

    return {data, isPending};
};

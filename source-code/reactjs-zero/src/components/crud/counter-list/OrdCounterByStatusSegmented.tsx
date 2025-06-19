import {Badge, Segmented, Space} from "antd";
import {useCallback, useState} from "react";
import {CounterByStatusItemDto, StaticCounterByStatusApiFetcher} from "@ord-components/paged-table/types";
import {useDebounce} from "@ord-core/hooks/useDebounce";

export const OrdCounterByStatusSegmented = (props: {
    statusFieldName: string,
    fetcher: StaticCounterByStatusApiFetcher,
    tableStore: ReturnType<typeof import('@ord-components/paged-table/useTableStoreFactory').createTableStore>
}) => {
    const {fetcher, tableStore, statusFieldName} = props;
    const {searchParams, setSearchParams} = tableStore();
    const [statusOptions, setStatusOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | number | null>(null);

    const fetchCounterData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await fetcher({
                body: {
                    ...searchParams,
                    skipCount: 0,
                    maxResultCount: 100
                }
            });

            const items: CounterByStatusItemDto[] = result.data || [];
            const options = items.map(item => ({
                label: (
                    <Space wrap>
                        <span>{item.statusDescription}</span>
                        <Badge
                            count={item.totalCount}
                            showZero
                            overflowCount={Number.MAX_VALUE}
                        />
                    </Space>
                ),
                value: item.statusValue
            }));

            setStatusOptions(options);
        } catch (error) {
            console.error('Error fetching counter data:', error);
            setStatusOptions([]);
        } finally {
            setLoading(false);
        }
    }, [fetcher, searchParams]);

    const handleStatusChange = useCallback((value: string | number) => {
        setStatus(value);
    }, []);

    // Debounce fetch counter data when searchParams change
    useDebounce(fetchCounterData, 300, [searchParams]);

    // Debounce update searchParams when status changes
    useDebounce(() => {
        setSearchParams({
            [statusFieldName]: status
        });
    }, 300, [status, statusFieldName]);

    return (
        <div className="w-full mb-3 rounded-md mt-[-10px] ord-status-counter">
            <Segmented<any>
                value={status}
                style={{color: "#000", backgroundColor: "#EEEEEE"}}
                options={statusOptions}
                disabled={loading}
                onChange={handleStatusChange}
            />
        </div>
    );
}
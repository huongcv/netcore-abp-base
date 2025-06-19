import {Badge, Form, Segmented, Space} from "antd";
import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {CounterByStatusItemDto, StaticCounterByStatusApiFetcher} from "@ord-components/paged-table/types";

export const OrdStatusSegmented = (props: {
    name: string,
    ns?: string,
    fetcher: StaticCounterByStatusApiFetcher,
    tableStore: ReturnType<typeof import('@ord-components/paged-table/useTableStoreFactory').createTableStore>
}) => {
    const {fetcher, tableStore, name} = props;
    const {searchForm, searchParams} = tableStore();
    const form = searchForm;
    const onSearchBeginning_w = Form.useWatch('onSearchBeginning', form);
    const [moveStatusChange, setMoveStatusChange] = useState(0);
    const [debouncedMoveStatus] = useDebounce(moveStatusChange, 500);
    const [statusOptions, setStatusOptions] = useState<any>();
    const getCount = async () => {
        try {
            const result = await fetcher({
                body: {
                    ...searchForm?.getFieldsValue()
                }
            });
            const items: CounterByStatusItemDto[] = result.data || [];
            const options = items.map(it => {
                return {
                    label: <Space wrap>
                        <span>{it.statusDescription}</span>
                        <Badge count={it.totalCount} showZero overflowCount={Number.MAX_VALUE}></Badge>
                    </Space>,
                    value: it.statusValue
                };
            });
            setStatusOptions(options as any);
        } catch {

        } finally {

        }
    }
    useEffect(() => {
        if (onSearchBeginning_w > 0) {
            getCount();
        }
    }, [onSearchBeginning_w]);
    const handlerChange = () => {
        setMoveStatusChange(Number(new Date()));
    }
    useEffect(() => {
        if (debouncedMoveStatus > 0) {
            form?.submit();
        }
    }, [debouncedMoveStatus]);
    return (<div className="w-full mb-3 rounded-md mt-[-10px] ord-status-counter ">
        <Form.Item name={name} initialValue={null}>
            <Segmented
                style={{color: "#000", backgroundColor: "#EEEEEE"}}
                options={statusOptions}
                onChange={handlerChange}
            />
        </Form.Item>
    </div>);
}

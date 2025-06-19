import {Badge, Form, FormInstance, Segmented, Space} from "antd";
import {useEffect, useMemo, useState} from "react";
import {useDebounce} from "use-debounce";
import {CounterByStatusItemDto, StaticCounterByStatusApiFetcher} from "@ord-components/paged-table/types";
import {debounce} from "lodash";

export const OrdStatusSegmented = (props: {
    name: string,
    ns?: string,
    fetcher: StaticCounterByStatusApiFetcher,
    tableStore: ReturnType<typeof import('@ord-components/paged-table/useTableStoreFactory').createTableStore>
}) => {
    const {fetcher, tableStore, name} = props;
    const {searchParams} = tableStore();
    const [moveStatusChange, setMoveStatusChange] = useState(0);
    const [debouncedMoveStatus] = useDebounce(moveStatusChange, 200);
    const [statusOptions, setStatusOptions] = useState<any>();
    const form = Form.useFormInstance();
    const getCount = async () => {
        try {
            const result = await fetcher({
                body: {
                    ...form.getFieldsValue(),
                    skipCount: 0,
                    maxResultCount: 100
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
    const debouncedLoadData = useMemo(
        () =>
            debounce(async () => {
                await getCount();
            }, 20),
        [] // chỉ tạo một lần
    );
    useEffect(() => {
        debouncedLoadData();
        return () => {
            debouncedLoadData.cancel(); // cleanup nếu component unmount
        };
    }, [searchParams]);
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

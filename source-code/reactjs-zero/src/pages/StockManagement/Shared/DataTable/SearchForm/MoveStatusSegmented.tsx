import {Badge, Form, Segmented, Space} from "antd";
import React, {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {useTranslation} from "react-i18next";
import {StockMovePagedCountDto, StockMovePagedRequestDto} from "@api/index.defs";

export const MoveStatusSegmented = (props: {
    ns?: string,
    getCountApi(
        params: {
            body?: StockMovePagedRequestDto;
        }
    ): Promise<StockMovePagedCountDto[]>
}) => {
    const {getCountApi} = props;
    const form = Form.useFormInstance();
    const [t] = useTranslation(props.ns ?? 'stock');
    const onSearchBeginning_w = Form.useWatch('onSearchBeginning', form);
    const [moveStatusChange, setMoveStatusChange] = useState(0);
    const [debouncedMoveStatus] = useDebounce(moveStatusChange, 500);
    const [statusOptions, setStatusOptions] = useState<any>();
    const getCount = async () => {
        try {
            const items = await getCountApi({
                body: {
                    ...form.getFieldsValue()
                }
            });
            const options = items.map(it => {
                if (it.moveStatus === null) {
                    return {
                        label: <Space wrap>
                            <span>{t('move_status_all')}</span>
                            <Badge count={it.totalCount} showZero overflowCount={Number.MAX_VALUE}></Badge>
                        </Space>,
                        value: -1
                    };
                }
                return {
                    label: <>
                        <Space wrap>
                            <span>{
                                t('move_status.' + it.moveStatus)
                            }</span>
                            <Badge count={it.totalCount} showZero overflowCount={Number.MAX_VALUE}></Badge>
                        </Space>
                    </>,

                    value: it.moveStatus
                }
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
            form.submit();
        }
    }, [debouncedMoveStatus]);
    return (<div className="w-full mb-3 rounded-md mt-[-10px] ord-status-counter ">
        <Form.Item name='moveStatus' initialValue={-1}>
            <Segmented
                style={{color: "#000", backgroundColor: "#EEEEEE"}}
                options={statusOptions}
                onChange={handlerChange}
            />
        </Form.Item>
    </div>);
}

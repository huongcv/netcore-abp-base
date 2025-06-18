import { FnbReservationPagedCountDto, FnbReservationPagedInputDto } from "@api/index.defs";
import { Badge, Form, Segmented, Space } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";

export const ReservationStatusSegmented = (props: {
    getCountApi(
        params: {
            body?: FnbReservationPagedInputDto;
        }
    ): Promise<FnbReservationPagedCountDto[]>
}) => {
    const { getCountApi } = props;
    const form = Form.useFormInstance();
    const { t: tEnum } = useTranslation('enum');
    const onSearchBeginning_w = Form.useWatch('onSearchBeginning', form);
    const [statusChange, setStatusChange] = useState(0);
    const [debouncedMoveStatus] = useDebounce(statusChange, 500);
    const [statusOptions, setStatusOptions] = useState<any>();
    const getCount = async () => {
        try {
            const items = await getCountApi({
                body: {
                    ...form.getFieldsValue()
                }
            });
            const options = items.map(it => {
                if (it.reservationStatus === null) {
                    return {
                        label: <Space wrap>
                            <span>{tEnum('ReservationStatus.All')}</span>
                            <Badge count={it.totalCount} showZero overflowCount={Number.MAX_VALUE}></Badge>
                        </Space>,
                        value: -1
                    };
                }
                return {
                    label: <>
                        <Space wrap>
                            <span>{
                                tEnum('ReservationStatus.' + it.reservationStatus)
                            }</span>
                            <Badge count={it.totalCount} showZero overflowCount={Number.MAX_VALUE}></Badge>
                        </Space>
                    </>,

                    value: it.reservationStatus
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
        setStatusChange(Number(new Date()));
    }
    useEffect(() => {
        if (debouncedMoveStatus > 0) {
            form.submit();
        }
    }, [debouncedMoveStatus]);
    useEffect(() => {
        form.setFieldValue('reservationStatus', -1);
    }, []);
    return (<div className="w-full mb-3 rounded-md mt-[-10px] ord-status-counter ">
        <Form.Item name='reservationStatus' initialValue={-1}>
            <Segmented
                style={{ color: "#000", backgroundColor: "#EEEEEE" }}
                options={statusOptions}
                onChange={handlerChange}
            />
        </Form.Item>
    </div>);
}

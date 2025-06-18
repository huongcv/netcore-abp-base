import { NationalPharmacyIntegrationCountDto, NationalPharmacyIntegrationPaging } from "@api/index.defs";
import { Badge, Form, Segmented, Space } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";

export const NationDrugSegmented = (props: {
    getCountApi(
        params: {
            body?: NationalPharmacyIntegrationPaging;
        }
    ): Promise<NationalPharmacyIntegrationCountDto[]>
}) => {
    const {getCountApi} = props;
    const form = Form.useFormInstance();
    const {t: tEnum} = useTranslation('enum');
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
                return {
                    label: <>
                        <Space wrap>
                            <span>{
                                tEnum('IntegrateStatusTypeEnum.' + it.nationalPharmacyStatus)
                            }</span>
                            <Badge count={it.totalCount} showZero overflowCount={Number.MAX_VALUE}></Badge>
                        </Space>
                    </>,

                    value: it.nationalPharmacyStatus
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
        form.setFieldValue('nationalPharmacyStatus', 0);
    }, []);

    return (<div className="rounded-md ord-status-counter ">
        <Form.Item name='nationalPharmacyStatus' initialValue={0}>
            <Segmented
                options={statusOptions}
                onChange={handlerChange}
            />
        </Form.Item>
    </div>);
}

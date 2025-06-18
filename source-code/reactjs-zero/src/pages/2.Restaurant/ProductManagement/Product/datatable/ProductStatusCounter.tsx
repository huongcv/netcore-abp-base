import {Badge, Form, Segmented, Space} from "antd";
import React, {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";

export const ProductStatusCounter = () => {
    const form = Form.useFormInstance();
    const {
        productStore: mainStore,
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const onSearchBeginning_w = Form.useWatch('onSearchBeginning', form);
    const [moveStatusChange, setMoveStatusChange] = useState(0);
    const [debouncedMoveStatus] = useDebounce(moveStatusChange, 500);
    const [statusOptions, setStatusOptions] = useState<any>();
    const getCount = async () => {
        try {
            const ret = await mainStore.getCountApi();
            const options = [
                {
                    label: <Space wrap>
                        <span>{t('counter.all')}</span>
                        <Badge count={ret.total} showZero overflowCount={Number.MAX_VALUE}></Badge>
                    </Space>,
                    value: null
                }, {
                    label: <Space wrap>
                        <span>{t('counter.true')}</span>
                        <Badge count={ret.totalTrue} showZero overflowCount={Number.MAX_VALUE}></Badge>
                    </Space>,
                    value: 1
                }, {
                    label: <Space wrap>
                        <span>{t('counter.false')}</span>
                        <Badge count={ret.totalFalse} showZero overflowCount={Number.MAX_VALUE}></Badge>
                    </Space>,
                    value: 0
                },
                {
                    label: <Space wrap>
                        <span>{t('counter.totalNotInBusiness')}</span>
                        <Badge count={ret.totalNotInBusiness} showZero overflowCount={Number.MAX_VALUE}></Badge>
                    </Space>,
                    value: -1
                }
            ]
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
    const handlerChange = (val: any) => {
        if (val == -1) {
            form.setFieldValue('isActived', null);
        } else if (val != null) {
            form.setFieldValue('isActived', val == 1);
        } else {
            form.setFieldValue('isActived', null);
        }

        setMoveStatusChange(Number(new Date()));
    }
    useEffect(() => {
        if (debouncedMoveStatus > 0) {
            form.submit();
        }
    }, [debouncedMoveStatus]);
    return (<div className="w-full mb-3 rounded-md mt-[-10px] ord-status-counter ">
        <Form.Item noStyle hidden name='isActived' initialValue={null}/>
        <Form.Item name='type' initialValue={null}>
            <Segmented
                style={{color: "#000", backgroundColor: "#EEEEEE"}}
                options={statusOptions}
                onChange={handlerChange}
            />
        </Form.Item>
    </div>);
}

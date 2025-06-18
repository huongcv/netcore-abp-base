import React, {useEffect, useMemo, useState} from 'react';
import {Input, Spin} from "antd";
import {InputProps} from "antd/es/input/Input";
import {debounce} from "lodash";
import {DeserializeCardService} from "@api/DeserializeCardService";
import {QrcodeOutlined} from "@ant-design/icons";
import {CitizenIdentityCardDto} from "@api/index.defs";
import {QrSimpleIcon} from "@ord-components/icon/QrSimplecon";
import RegexUtil from "@ord-core/utils/regex.util";

export interface ICitizenIdentityInputProps extends InputProps {
    onFetchCitizenDone?: (data: CitizenIdentityCardDto) => void;
}

const CitizenIdentityInput: React.FC<ICitizenIdentityInputProps> = (props) => {
    const { onFetchCitizenDone, onChange, ...restProps } = props;

    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<string>();

    useEffect(() => {
        setValue(props.value as string);
    }, [props.value]);

    const fetchCitizenInfo = async (cccd: string) => {
        if(!cccd) {
            return;
        }
        if (!RegexUtil.QrCCCD.test(cccd)) {
            onChange?.({ target: { value: cccd } } as any);
            return;
        }

        try {
            setLoading(true);
            const res = await DeserializeCardService.deserializeCitizenIdentity({ input: cccd });
            setValue(res?.fullName);
            onChange?.({ target: { value: res.fullName } } as any);
            onFetchCitizenDone?.(res);
        } catch (err) {
            onChange?.({ target: { value: cccd } } as any);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useMemo(() => debounce(fetchCitizenInfo, 600), []);
    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
        };
    }, [debouncedFetch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);
        debouncedFetch(val);
    };



    return (
        <Spin spinning={loading}>
            <Input
                {...restProps}
                value={value}
                suffix={<QrSimpleIcon />}
                // prefix={<QrSimpleIcon />}
                onChange={handleChange}
            />
        </Spin>
    );
};

export default CitizenIdentityInput;

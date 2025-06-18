import React, {useEffect, useMemo, useState} from 'react';
import OrdSelect, {IOrdSelectProp} from "@ord-components/forms/select/OrdSelect";
import UiUtils from "@ord-core/utils/ui.utils";
import {debounce} from "lodash";
import './InputAccessCard.scss'
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {AccessCardService} from "@api/AccessCardService";
import {useTranslation} from "react-i18next";

export interface IInputAccessCardProps extends IOrdSelectProp {
    usingQrSearch?: boolean,
    onOtherCardCheck?: (value: string) => void;
}

function InputAccessCard(props: IInputAccessCardProps) {
    const {usingQrSearch = true} = props;
    const [t] = useTranslation('golf_access_card');
    const [value, setValue] = useState<any>(props.value);

    const [isOpenSelect, setIsOpenSelect] = useState(false);


    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    useEffect(() => {
        setIsOpenSelect(props.open ?? false);
    }, [props.open]);

    const onChange = (value: any, option: any) => {
        props.onChange?.(value, option);
    }

    const onDropdownVisibleChange = (open: boolean) => {
        setIsOpenSelect(open);
        if (props.onDropdownVisibleChange) {
            props.onDropdownVisibleChange(open);
        }
    }



    const fetchCardInfo = async (source: SelectDataSource, searchVal: string) => {
        try {
            UiUtils.setBusy();
            const data = await AccessCardService.checkCardByCodeCheck({
                code: searchVal
            })
            if (data && data.isSuccessful) {
                const find = source.data.find(f => f.value == data.data?.id);
                console.log("dataSource.data", [...source.data])
                if (find) {
                    if (props.onChange) {
                        setValue(find.value);
                        onChange(find.value as any, find);
                        onDropdownVisibleChange(false);
                    }
                } else {
                    UiUtils.showInfo(t('notFoundAccessCard'));
                }
            } else {
                UiUtils.showError(data.message);
            }
            UiUtils.clearBusy();
        } catch (err) {
            UiUtils.clearBusy();
            UiUtils.showError("getIdentityError");
        } finally {
            UiUtils.clearBusy();
            // setLoading(false);
        }
    };
    const debouncedFetchCard = useMemo(() => debounce(fetchCardInfo, 600), []);
    useEffect(() => {
        return () => {
            debouncedFetchCard.cancel();
        };
    }, [debouncedFetchCard]);

    return (
        <OrdSelect {...props}
                   className={props.className + (usingQrSearch ? ' access-card-qr-search' : '')}
                   value={value}
                   onChange={onChange}
                   open={isOpenSelect}
                   onDropdownVisibleChange={onDropdownVisibleChange}
                   onInputKeyDown={($event) => {
                       if($event.key == "Enter" && usingQrSearch) {
                           // case  máy quet sau khi quét xong tự nhấn enter sẽ chặn
                           $event.preventDefault();
                           $event.stopPropagation();
                       }
                   }}
                   onSearch={(val) => {
                       if (usingQrSearch && val && val.length > 0) {
                           debouncedFetchCard(props.datasource, val)
                       }
                       if (props.onSearch) {
                           props.onSearch(val);
                       }
                   }}
        />
    );
}

export default InputAccessCard;

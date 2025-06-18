import React, {useEffect, useMemo, useState} from "react";
import {CustomerSelectSearchApi, CustomerSelectSearchApiProps} from "@pages/SalesInvoice/Form/customerSelectSearchApi";
import UiUtils from "@ord-core/utils/ui.utils";
import {useTranslation} from "react-i18next";
import {DeserializeCardService} from "@api/DeserializeCardService";
import {AccessCardStatusEnum} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {useStore} from "@ord-store/index";
import {CitizenIdentityCardDto} from "@api/index.defs";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {getPartnerCustomerById} from "@ord-core/db/queries/partners/getPartnerCustomerById";
import RegexUtil from "../../../core/utils/regex.util";
import {QrSimpleIcon} from "@ord-components/icon/QrSimplecon";
import {debounce} from "lodash";

interface ICustomerSelectSearchGolfApi extends CustomerSelectSearchApiProps {
    callBackCheckCard?: (val: CitizenIdentityCardDto) => void;
    usingQrSearch?: boolean
}

export const CustomerSelectSearchGolfApi = (props: ICustomerSelectSearchGolfApi) => {
    const [value, setValue] = useState<any>(props.value);
    const [t] = useTranslation('customer');
    const {
        golfAccessCardStore
    } = useStore();
    const [searchVal, setSearchVal] = useState('');

    const onChange = (value: any, option: any) => {
        props.onChange?.(value, option);
    }

    const searchByCodePhone = async (searchVal: string) => {
        if (searchVal) {
            const find = await getPartnerCustomerById({
                codeOrPhone: searchVal
            });
            console.log("FInd", find)
            if (find) {
                return find;
            } else {
                // UiUtils.showInfo(t("notFoundPartner"));
                return null;
            }
        }

    };
    const debouncedFetch = useMemo(() => debounce(checkCardByFilterText, 300), []);
    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
        };
    }, [debouncedFetch]);

    async function checkCardByFilterText(val: string, isOpenDropDown?: boolean) {

        if (isOpenDropDown == false) {
            // alert("Notopen")
            const find = await searchByCodePhone(val);
            if (find) {
                setValue(find.id);
                onChange(find.id as any, {
                    value: find.id,
                    data: find,
                    label: find.name //
                } as IOrdSelectOption);
                setSearchVal('')
                return;
            }
        }
        if (!props.usingQrSearch) {
            return;
        }
        if (RegexUtil.QrCCCD.test(val)) {
            // Nếu là định dạng CCCD thì tìm kiếm
            const arr = val.split("|");
            const valFind = arr[0];
            // Tím kiếm lấy Mã code đối chiếu với mã CMND ; -> Nếu sửa tìm kiếm theo Mã CMND thì sửa hàm này
            const find = await getPartnerCustomerById({
                partnerId: undefined,
                code: valFind,
            });
            if (find) {
                if (props.onChange) {
                    setValue(find.id);
                    onChange(find.id as any, {
                        value: find.id,
                        data: find,
                        label: find.name //
                    } as IOrdSelectOption);
                    setSearchVal('')
                }
            } else {
                fetchCitizenInfo(val);
            }
        } else {
            // Nếu có các loại thẻ khác thêm hàm check tiếp ở đây
            const isCard = () => {
                return val && val.length > 7 && !/\s/.test(val);
            }
            if (isCard()) {
                const res = await golfAccessCardStore.checkAccessCardAvairable(val);
                if (res.isSuccessful && res.data) {
                    if (res.data.accessStatus == AccessCardStatusEnum.Lost) {
                        UiUtils.showError(t('warningAccessCardLost'))
                    }
                    const find = await getPartnerCustomerById({
                        partnerId: res.data?.partnerId
                    });
                    if (find) {
                        if (props.onChange) {
                            setSearchVal('')
                            setValue(find.id);
                            onChange(find.id as any,  {
                                value: find.id,
                                data: find,
                                label: find.name //
                            } as IOrdSelectOption);
                        }
                    } else {
                        UiUtils.showError(t('notFoundAccessCardForPlayer'));
                        console.log("notFoundAccessCardForPlayer")
                    }
                } else {
                    if(res.message){
                        UiUtils.showError(res.message);
                    }
                    console.log("notFoundAccessCardForPlayer")
                }

            }
        }
    }

    const fetchCitizenInfo = async (cccd: string) => {
        if (props.callBackCheckCard) {
            try {
                UiUtils.showInfo(t("confirmUpdatePartnerCustomer"));
                UiUtils.setBusy();
                const data = await DeserializeCardService.deserializeCitizenIdentity({input: cccd});
                props.callBackCheckCard(data);
                UiUtils.clearBusy();
            } catch (err) {
                UiUtils.clearBusy();
                UiUtils.showError("getIdentityError");
            } finally {
                UiUtils.clearBusy();
            }
        }

    };
    return (
        <>
            <CustomerSelectSearchApi
                {...props}
                suffixIcon={<QrSimpleIcon></QrSimpleIcon>}
                onChange={onChange}
                searchValue={searchVal}
                open={props.open ? undefined : false}
                onSearch={(val) => {
                    setSearchVal(val);
                    if (props.usingQrSearch) {
                        debouncedFetch(val, props.open)
                    }
                    if (props.onSearch) {
                        props.onSearch(val);
                    }
                }}
                onBlur={($event) => {
                    setSearchVal('');
                    if (props.onBlur) {
                        props.onBlur($event)
                    }
                }}

            ></CustomerSelectSearchApi>
        </>
    )
}
CustomerSelectSearchGolfApi.defaultProps = {
    usingQrSearch: true,
}

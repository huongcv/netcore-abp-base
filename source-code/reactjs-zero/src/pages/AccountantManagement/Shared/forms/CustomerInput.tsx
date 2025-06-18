import {useTranslation} from "react-i18next";
import {Checkbox, Col, Form, Input} from "antd";
import React from "react";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TextArea from "antd/lib/input/TextArea";
import UiUtils from "@ord-core/utils/ui.utils";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import {PartnerDto} from "@api/index.defs";
import {CommonResultDto} from "@ord-core/service-proxies/dto";
import {OrdSelectAndAddNew} from "@ord-components/forms/select/OrdSelectAndAddNew";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {
    PartnerCustomerLabel,
    PartnerCustomerRenderSelectItem,
    useSelectPartnerCustomer
} from "@ord-components/forms/select/selectDataSource/useSelectPartnerCustomer";
import {AddNewFormPartnerSupplier} from "@pages/Partner/CustomerSupplier/Forms/AddNewFormPartnerSupplier";
import { SupplierService } from "@api/SupplierService";

interface ICustomerInputProp {
    onChange?: (value: any, option: IOrdSelectOption | IOrdSelectOption[]) => void;
}

const CustomerInput = (props: ICustomerInputProp) => {
    const {onChange} = props;
    const [t] = useTranslation('customer');
    const select_Ds = useSelectPartnerCustomer();
    const apiSave = async (formValue: any) => {
        UiUtils.setBusy()
        try {
            const result = await SupplierService.createOrUpdate({
                body: {
                    ...formValue
                }
            });
            if (result.isSuccessful) {
                UiUtils.showSuccess(t('addNewPartnerSuccess', {
                    ...result.data
                }) as any);
            } else {
                ServiceProxyUtils.notifyErrorResultApi(result, "customer", {...formValue});
            }
            return result;
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
        return {
            isSuccessful: false
        } as CommonResultDto<any>;
    }
    const handlerDoneAdd = (value: PartnerDto) => {
        if (value) {
            // onChange(value.id, value);
        }
    }
    return (
        <>
            <OrdSelectAndAddNew
                {...props}
                formContent={(<AddNewFormPartnerSupplier/>)}
                apiAddNew={apiSave}
                nameDataSource='PartnerSupplier'
                renderSelectOptions={PartnerCustomerRenderSelectItem}
                optionRender={(option: any) => (<PartnerCustomerLabel dto={option.data?.data}/>)}
                datasource={select_Ds}
                modalSetting={{
                    width: 800,
                    style: {
                        top: 30
                    }
                }}
                onAddDone={handlerDoneAdd}
            />

        </>

    );
}
export default CustomerInput;


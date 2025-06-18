import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectPartnerCustomer} from "@ord-components/forms/select/selectDataSource/useSelectPartnerCustomer";
import {useSelectPartnerSupplier} from "@ord-components/forms/select/selectDataSource/useSelectPartnerSupplier";
import React from "react";

export const DisplayPartner = (props: {
    partnerType?: number;
    partnerId?: string;
}) => {
    const {partnerType, partnerId} = props;
    return (
        <>
            {
                partnerType == 1 &&
                <DisplayTextFormSelectDataSource value={partnerId}
                                                 datasource={useSelectPartnerCustomer()}/>
            }
            {
                partnerType == 2 &&
                <DisplayTextFormSelectDataSource value={partnerId}
                                                 datasource={useSelectPartnerSupplier()}/>
            }
        </>
    );
}

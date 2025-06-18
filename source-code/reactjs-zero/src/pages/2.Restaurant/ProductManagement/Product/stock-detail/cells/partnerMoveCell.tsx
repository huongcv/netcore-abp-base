import {ProductInventoryMoveDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectStock} from "@ord-components/forms/select/selectDataSource/useSelectStock";
import {useSelectPartnerType} from "@ord-components/forms/select/selectDataSource/useSelectPartnerType";
import {useSelectPartnerCustomer} from "@ord-components/forms/select/selectDataSource/useSelectPartnerCustomer";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {FilterOutlined} from "@ant-design/icons";
import React from "react";
import {DisplayPartner} from "@pages/Partner/Shared/DisplayPartner";

const PartnerNotNull = (props: {
    record: ProductInventoryMoveDto,
    addFilterPartner: () => void;
}) => {
    const {record, addFilterPartner} = props;
    return (

        <>

            {
                !!record && !!record.partnerId &&
                <>
                    <DisplayPartner {...record}/>
                    {/*<a className={'ms-1 text-blue-600'} onClick={() => addFilterPartner()}>
                        <FilterOutlined/>
                    </a>*/}
                </>
            }

        </>

    );
}

export const PartnerMoveCell = (props: {
    record: ProductInventoryMoveDto,
    addFilterPartner: () => void;
}) => {
    const {record} = props;
    const [t] = useTranslation('stock');
    const customer = useSelectPartnerCustomer();
    return (<>

        <PartnerNotNull {...props}></PartnerNotNull>
        {
            record.moveType == MoveType.HoaDon && !!!record.partnerId &&
            <span>{t('customerOther')}</span>
        }


        {/*{
            !!record.inventoryId && (+record.inventoryId) > 0 && <div className={'italic'}>
                {t('stock')}: <DisplayTextFormSelectDataSource value={record.inventoryId}
                                                               renderDisplay={(opt) => opt?.data?.inventoryName}
                                                               datasource={useSelectStock()}></DisplayTextFormSelectDataSource>
            </div>
        }*/}

    </>);
}

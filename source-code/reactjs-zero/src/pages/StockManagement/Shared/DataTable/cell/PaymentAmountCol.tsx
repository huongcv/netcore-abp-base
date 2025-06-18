import {StockMovePagedOutputDto} from "@api/index.defs";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import React from "react";

export const PaymentAmountCol = (props: {
    record: StockMovePagedOutputDto
}) => {
    const {record} = props;

    return (<>
        {
            !!record?.paymentAmount &&
            <PriceCell value={record?.paymentAmount} fixed={0}/>
        }
    </>);

}
export const PaymentDebtAmountCol = (props: {
    record: StockMovePagedOutputDto
}) => {
    const {record} = props;

    return (<>
        {
            !!record?.debtAmount &&
            <PriceCell value={record?.debtAmount} fixed={0}/>
        }
    </>);

}

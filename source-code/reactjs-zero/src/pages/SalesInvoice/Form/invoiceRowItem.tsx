import {NumericFormat} from "react-number-format";
import {Flex, Tooltip} from "antd";
import * as React from "react";
import {isNumber} from "lodash";
import {currencyDefault} from "@ord-core/AppConst";
import {InfoCircleTwoTone} from "@ant-design/icons";
import Utils from "@ord-core/utils/utils";

export const InvoiceRowItem = (props: {
    label: string | undefined| React.ReactNode;
    val: string | number | React.ReactNode | undefined;
    hiddenCurrency?: boolean;
    infoLabel?: React.ReactNode | undefined;
    roundNumber?: number | 0;
}) => {
    return (<>
        <Flex justify="space-between" className="w-full gap-2">
            <span>{props.label}
                {props.infoLabel && <Tooltip placement="leftBottom" title={props.infoLabel}>
                    <InfoCircleTwoTone className='ml-1'/>
                </Tooltip>}
            </span>
            <span
                className="mb-[5px] border-b-[1px] border-dashed border-b-gray-300 flex-1"></span>
            <span>{isNumber(props.val) ? <NumericFormat value={Utils.formatterNumber(props.val, props.roundNumber)} displayType={'text'}
                                                        thousandSeparator={true}/> : props.val} {props.hiddenCurrency ? '' : currencyDefault}</span>
        </Flex>
    </>)
}

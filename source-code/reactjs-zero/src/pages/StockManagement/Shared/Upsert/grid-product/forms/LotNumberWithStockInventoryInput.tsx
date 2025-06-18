import {IProductIItemFormInputProp} from "@pages/StockManagement/Shared/Upsert/grid-product/forms/model";
import React, {memo, useEffect, useState} from "react";
import {Form, Select} from "antd";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {StockProductUnitDto} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import StockDisplayEllipsisTextLong from "@ord-components/displays/StockDisplayEllipsisTextLong";
import {SelectProps} from "antd/lib";

type LabelRender = SelectProps['labelRender'];

const renderOptionLot = (item: StockProductUnitDto) => {
    return {
        value: item.lotNumber,
        label: (
            <div className='inline-flex items-center'>
                <StockDisplayEllipsisTextLong className={"text-sm leading-5 inline-flex items-center"}
                                              text={item.lotNumber!} maxWidth={120}/>
                <span className={'ms-1 italic text-sm'}>
                      - HSD: {DateUtil.showWithFormat(item.expiryDate)}
                </span>
            </div>
        ),
        data: item
    }
}

interface IProps extends IProductIItemFormInputProp {
    inventoryId?: string;
    hiddenInventory?: boolean;
    changeLotNumber?: (lotNumber: StockProductUnitDto) => void;
}

const LotNumberWithStockInventoryInput = (props: IProps) => {
    const {productItem, field, inventoryId} = props;
    const {formMoveTicket} = useUpsertStockMove();
    const {isProductUseLotNumber} = productItem;
    const [lotOptionItems, setLotOptionItems] = useState<StockProductUnitDto[] | null>(null);
    const [t] = useTranslation('stock');
    const form = Form.useFormInstance();
    const relatedMoveId_w = Form.useWatch('relatedMoveId', formMoveTicket);

    const lotOptions = form.getFieldValue([StockMoveFormName.ProductItems, field.name, 'lotNumbers']);
    useEffect(() => {
        setLotOptionItems([...(lotOptions || [])]);
    }, [lotOptions]);

    const changeLotNumber = (value: StockProductUnitDto) => {
        if (!value || !value?.inventoryLineDetailsId) {
            console.error('StockProductUnitDto: ', value);
            return;
        }

        form.setFieldsValue({
            [StockMoveFormName.ProductItems]: {
                [field.name]: {
                    lotNumber: value.lotNumber,
                    expiryDate: value.expiryDate,
                    lotNumberId: value.inventoryLineDetailsId
                },
            },
        });

        props.changeLotNumber && props.changeLotNumber(value);
    }

    const labelRender: LabelRender = (props) => {
        const {label, value} = props;

        const lot = lotOptionItems?.find(x => x.inventoryLineDetailsId === value);
        if (!lot) {
            // UiUtils.showError("Không tìm thấy số lô");
            // form.setFieldsValue({
            //     [StockMoveFormName.ProductItems]: {
            //         [field.name]: {
            //             lotNumber: null,
            //             expiryDate: null,
            //             lotNumberId: null
            //         },
            //     },
            // });
            return;
        }

        return <i>{lot.lotNumber} - {DateUtil.showWithFormat(lot.expiryDate, 'dd/MM/yyyy')}</i>;
    };

    return (<>
        {
            !!isProductUseLotNumber &&
            <>
                <Form.Item name={[field.name, 'lotNumberId']}>
                    <Select disabled={!!relatedMoveId_w}
                            labelRender={labelRender}
                            placeholder={t('selectLotNumberPlaceholder')}
                            options={lotOptionItems?.map((v) => renderOptionLot(v))}
                            className='w-full ord-input-bottom-line min-w-[150px]'
                            onChange={(event, option: any) => {
                                changeLotNumber(option.data);
                            }}
                    />
                </Form.Item>
                <Form.Item noStyle
                           name={[field.name, "expiryDate"]}
                           rules={[ValidateUtils.requiredShortMess]}>
                </Form.Item>
                <Form.Item noStyle
                           name={[field.name, "lotNumber"]}
                           rules={[ValidateUtils.requiredShortMess]}>
                </Form.Item>
            </>
        }
    </>);
}
export default LotNumberWithStockInventoryInput;


